import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import { KnowledgeChunk, KnowledgeDoc } from '../models/KnowledgeChunk.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// ─── Multer setup (memory storage — parse immediately, never write to disk) ───
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB per file
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (allowed.includes(file.mimetype) ||
        file.originalname.match(/\.(pdf|docx|txt|csv|xlsx|xls)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Use PDF, DOCX, TXT, CSV, or XLSX.'));
    }
  },
});

// ─── Gemini embedding client ───────────────────────────────────────────────────
let gemini: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

async function getEmbedding(text: string): Promise<number[]> {
  if (!gemini) throw new Error('GEMINI_API_KEY not set');
  const res = await gemini.models.embedContent({
    model: 'text-embedding-004',
    contents: text,
  });
  return res.embeddings?.[0]?.values ?? [];
}

// ─── Text extraction ──────────────────────────────────────────────────────────

async function extractText(
  buffer: Buffer,
  mimetype: string,
  originalname: string
): Promise<{ text: string; pages: string[] }> {
  const ext = originalname.toLowerCase().split('.').pop();

  // PDF
  if (mimetype === 'application/pdf' || ext === 'pdf') {
    const pdfImport = await import('pdf-parse');
    const pdfParse = ((pdfImport as any).default || pdfImport) as any;
    const data = await pdfParse(buffer);
    // Split by form-feed character (\f) to get per-page text
    const pages = data.text.split('\f').filter((p: string) => p.trim().length > 0);
    return { text: data.text, pages: pages.length ? pages : [data.text] };
  }

  // DOCX
  if (
    mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext === 'docx'
  ) {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return { text: result.value, pages: [result.value] };
  }

  // TXT
  if (mimetype === 'text/plain' || ext === 'txt') {
    const text = buffer.toString('utf-8');
    return { text, pages: [text] };
  }

  // CSV
  if (mimetype === 'text/csv' || ext === 'csv') {
    const { parse } = await import('csv-parse/sync');
    const records = parse(buffer, { columns: true, skip_empty_lines: true });
    const text = (records as any[])
      .map((row: any) =>
        Object.entries(row)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')
      )
      .join('\n');
    return { text, pages: [text] };
  }

  // XLSX / XLS
  if (
    mimetype ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimetype === 'application/vnd.ms-excel' ||
    ext === 'xlsx' ||
    ext === 'xls'
  ) {
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const lines: string[] = [];
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      lines.push(`Sheet: ${sheetName}\n${csv}`);
    }
    const text = lines.join('\n\n');
    return { text, pages: [text] };
  }

  throw new Error(`Unsupported file type: ${mimetype}`);
}

// ─── Chunking ─────────────────────────────────────────────────────────────────

function chunkText(
  text: string,
  chunkSize = 1000,
  overlap = 200
): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 50) chunks.push(chunk); // skip tiny leftover chunks
    start += chunkSize - overlap;
  }
  return chunks;
}

// ─── Cosine similarity ────────────────────────────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || a.length !== b.length) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ─── Public: retrieve top-K chunks for a startup question ─────────────────────

export async function retrieveContext(
  question: string,
  startupId: string,
  topK = 5
): Promise<{ text: string; filename: string; chunkIndex: number; score: number }[]> {
  const qEmbedding = await getEmbedding(question);
  // Fetch all indexed chunks for this startup (embedding stored in Mongo)
  const chunks = await KnowledgeChunk.find(
    { startupId, status: 'indexed' },
    { text: 1, embedding: 1, filename: 1, chunkIndex: 1 }
  ).lean();

  if (!chunks.length) return [];

  const scored = chunks
    .map(c => ({
      text: c.text,
      filename: c.filename,
      chunkIndex: c.chunkIndex,
      score: cosineSimilarity(qEmbedding, c.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(c => c.score > 0.3); // minimum relevance threshold

  return scored;
}

// ─── Route handlers ───────────────────────────────────────────────────────────

// POST /api/rag/upload  (multipart/form-data: files[], startupId)
export const uploadDocs = async (req: AuthRequest, res: Response): Promise<void> => {
  const files = req.files as Express.Multer.File[];
  const { startupId } = req.body;
  const userId = req.user?.id;

  if (!files || files.length === 0) {
    res.status(400).json({ success: false, error: 'No files uploaded' });
    return;
  }
  if (!startupId) {
    res.status(400).json({ success: false, error: 'startupId is required' });
    return;
  }

  // Return immediately with docIds — processing happens async
  const docIds: string[] = files.map(() => uuidv4());

  // Acknowledge fast
  res.status(202).json({
    success: true,
    message: `${files.length} file(s) received. Processing in background.`,
    docs: files.map((f, i) => ({
      docId: docIds[i],
      filename: f.originalname,
      status: 'uploading',
    })),
  });

  // Process each file in background
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const docId = docIds[i];

    // Create doc record with 'uploading' status
    await KnowledgeDoc.create({
      startupId,
      userId,
      docId,
      filename: file.originalname,
      fileType: file.mimetype,
      status: 'uploading',
      chunkCount: 0,
    });

    // Process async (no await — fire and forget per file)
    processFile(file, docId, startupId, userId || '').catch(err => {
      console.error(`❌ RAG processing failed for ${file.originalname}:`, err);
      KnowledgeDoc.updateOne(
        { docId },
        { status: 'error', errorMessage: err.message }
      ).catch(console.error);
    });
  }
};

async function processFile(
  file: Express.Multer.File,
  docId: string,
  startupId: string,
  userId: string
) {
  // Mark as processing
  await KnowledgeDoc.updateOne({ docId }, { status: 'processing' });

  // 1. Extract text
  const { text, pages } = await extractText(
    file.buffer,
    file.mimetype,
    file.originalname
  );

  if (!text.trim()) {
    await KnowledgeDoc.updateOne(
      { docId },
      { status: 'error', errorMessage: 'No extractable text found in document.' }
    );
    return;
  }

  // 2. Chunk (page-aware: chunk within each page, track page number)
  const allChunks: { text: string; page: number; index: number }[] = [];
  let globalIndex = 0;
  for (let p = 0; p < pages.length; p++) {
    const pageChunks = chunkText(pages[p], 1000, 200);
    for (const chunk of pageChunks) {
      allChunks.push({ text: chunk, page: p + 1, index: globalIndex++ });
    }
  }

  // 3. Embed each chunk and save to MongoDB
  const savedChunks: any[] = [];
  for (const chunk of allChunks) {
    try {
      const embedding = await getEmbedding(chunk.text);
      savedChunks.push({
        startupId,
        userId,
        docId,
        filename: file.originalname,
        fileType: file.mimetype,
        status: 'indexed',
        pageNumber: chunk.page,
        chunkIndex: chunk.index,
        text: chunk.text,
        embedding,
        charCount: chunk.text.length,
      });
    } catch (embErr) {
      console.warn(`⚠️ Embedding failed for chunk ${chunk.index}:`, embErr);
    }
  }

  if (savedChunks.length === 0) {
    await KnowledgeDoc.updateOne(
      { docId },
      { status: 'error', errorMessage: 'Embedding generation failed for all chunks.' }
    );
    return;
  }

  await KnowledgeChunk.insertMany(savedChunks);
  await KnowledgeDoc.updateOne(
    { docId },
    { status: 'indexed', chunkCount: savedChunks.length }
  );

  console.log(
    `✅ RAG: ${file.originalname} indexed — ${savedChunks.length} chunks for startup ${startupId}`
  );
}

// GET /api/rag/documents/:startupId
export const listDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  const { startupId } = req.params;
  try {
    const docs = await KnowledgeDoc.find({ startupId }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, documents: docs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/rag/document/:docId
export const deleteDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  const { docId } = req.params;
  try {
    await KnowledgeChunk.deleteMany({ docId });
    await KnowledgeDoc.deleteOne({ docId });
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/rag/reindex/:docId  — re-run from existing buffer (not supported for binary; instruct user to re-upload)
export const getDocStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { docId } = req.params;
  try {
    const doc = await KnowledgeDoc.findOne({ docId }).lean();
    if (!doc) {
      res.status(404).json({ success: false, error: 'Document not found' });
      return;
    }
    res.json({ success: true, document: doc });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
