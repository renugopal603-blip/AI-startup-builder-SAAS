export const getStartups = () => {
  const keys = Object.keys(localStorage);
  const locals: any[] = [];
  keys.forEach(key => {
    if (key.startsWith('startup_')) {
      try {
        locals.push(JSON.parse(localStorage.getItem(key) || ''));
      } catch (e) {}
    }
  });
  return locals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const saveStartups = (startups: any[]) => {
  startups.forEach(s => {
    localStorage.setItem(s.startupId || s.id, JSON.stringify(s));
  });
};

export const getStartupById = (startupId: string) => {
  try {
    const data = localStorage.getItem(startupId);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const createStartupDraft = (startupName: string, startupIdea: string) => {
  const startupId = `startup_${Date.now()}`;
  const newStartupData = {
    id: startupId,
    startupId,
    founderId: "founder_demo_user",
    startupName,
    startupIdea,
    status: 'pending_analysis',
    aiGenerated: null,
    roadmap: [],
    tasks: [],
    isSavedToMyStartups: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(startupId, JSON.stringify(newStartupData));
  return newStartupData;
};

export const updateStartup = (startupId: string, updatedData: any) => {
  const existing = getStartupById(startupId);
  if (existing) {
    const updated = { ...existing, ...updatedData, updatedAt: new Date().toISOString() };
    localStorage.setItem(startupId, JSON.stringify(updated));
    return updated;
  }
  return null;
};

export const getNotifications = () => {
  try {
    const data = localStorage.getItem('ai_startup_builder_notifications');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const addNotification = (notification: any) => {
  const current = getNotifications();
  const updated = [notification, ...current];
  localStorage.setItem('ai_startup_builder_notifications', JSON.stringify(updated));
  return updated;
};

export const generateStartupOutput = (startup: any) => {
  const isPhysical = /tea|coffee|snacks|restaurant|salon|hotel|shop|cafe|retail/i.test(startup.startupIdea);
  
  let ideaAnalysis, businessPlan, pitchDeck, marketResearch, aiReport;

  if (isPhysical) {
    ideaAnalysis = {
      refinedIdea: `${startup.startupName} is a modern, premium localized business focusing on high-quality offerings and exceptional customer experience.`,
      problemStatement: "Customers lack premium, aesthetically pleasing, and high-quality options in their local vicinity.",
      solution: "A beautifully designed, premium location offering curated products and an unforgettable customer experience.",
      targetCustomers: ["Local Professionals", "Students", "Premium Shoppers"],
      uniqueValueProposition: "Combining high-end aesthetics with premium quality products in a localized, accessible setting.",
      businessModel: "Direct-to-Consumer Retail / Walk-in Sales",
      revenueModel: ["Walk-in Sales", "Takeaway", "Combo Offers", "Office Bulk Orders", "Franchise Expansion"],
      coreFeatures: ["Premium Ambiance", "Curated Menu/Products", "Loyalty Program", "Fast Service"],
      marketOpportunity: "High local footfall and growing demand for premium aesthetic experiences.",
      nextSteps: ["Secure Location", "Finalize Branding", "Vendor Agreements"]
    };
    
    businessPlan = {
      executiveSummary: `${startup.startupName} will redefine the local retail experience by offering premium products in a highly aesthetic environment.`,
      problemAndSolution: "Problem: Uninspiring local options. Solution: A premium, design-forward establishment.",
      marketOpportunity: "Capitalizing on the growing trend of experiential retail and dining.",
      productAndFeatures: "High-quality products, instagrammable interiors, and exceptional service.",
      businessModel: "Retail sales, takeaway, and potential B2B bulk orders.",
      goToMarketStrategy: "Local influencer marketing, grand opening event, and targeted local social media ads.",
      competitiveAnalysis: "Competitors lack the premium aesthetic and curated quality we offer.",
      teamSuggestion: ["Store Manager", "Head Barista/Chef", "Marketing Lead", "Operations Staff"],
      financialProjection: "Year 1 Revenue: $250k, Break-even by Month 8.",
      fundingAsk: "$150,000 for lease, interior setup, and initial inventory."
    };

    pitchDeck = [
      { slide: 1, title: "Cover Slide", content: `${startup.startupName} - Premium Local Experience` },
      { slide: 2, title: "Problem", content: "Lack of premium aesthetic venues in the local area." },
      { slide: 3, title: "Solution", content: "A high-end, beautifully designed space offering top-tier products." },
      { slide: 4, title: "Market Size", content: "Local addressable market of 50,000+ daily commuters/residents." },
      { slide: 5, title: "Product Demo", content: "[Interior Mockups & Product Samples]" },
      { slide: 6, title: "Business Model", content: "Walk-in, Takeaway, Bulk Orders." },
      { slide: 7, title: "Traction", content: "Pre-launch hype, 500+ waitlist/social followers." },
      { slide: 8, title: "Go-To-Market", content: "Local SEO, Influencer Partnerships, Grand Opening." },
      { slide: 9, title: "Team", content: "Experienced retail and hospitality operators." },
      { slide: 10, title: "Funding Ask", content: "$150k for Buildout and Launch." }
    ];

    marketResearch = {
      tam: "$50M (Regional Market)",
      sam: "$5M (City Market)",
      som: "$500k (Local Neighborhood Target)",
      targetMarket: "Urban professionals and students aged 18-45.",
      customerSegments: ["Daily Commuters", "Weekend Socializers", "Remote Workers"],
      competitors: ["Local Mom-and-Pop Shops", "Generic Chains"],
      marketTrends: ["Experiential Retail", "Premiumization", "Aesthetic Environments"],
      opportunities: ["B2B Catering", "Merchandise Sales", "Franchising"],
      risks: ["High Rent Costs", "Staff Turnover", "Supply Chain Issues"],
      pricingSuggestions: "Premium pricing (+20% above market average) justified by quality and experience."
    };

    aiReport = {
      investmentReadinessScore: 82,
      keyStrengths: ["Clear tangible product", "Strong local demand", "Aesthetic focus aligns with current trends"],
      riskFactors: ["High initial CapEx for interior", "Location dependency", "Staffing challenges"],
      improvementSuggestions: ["Secure a letter of intent for a prime location", "Develop a strong local marketing pre-launch campaign"],
      fundingReadiness: "Good for local angel investors or small business loans.",
      mentorReviewSummary: "Solid physical business concept. Focus heavily on location scouting and lease negotiations."
    };
  } else {
    ideaAnalysis = {
      refinedIdea: `${startup.startupName} is an innovative tech solution designed to streamline workflows and drive efficiency in its target sector.`,
      problemStatement: "Current software solutions are outdated, fragmented, and fail to leverage modern AI capabilities.",
      solution: "A unified, AI-powered platform that automates tedious tasks and provides actionable insights.",
      targetCustomers: ["SMBs", "Enterprise Teams", "Freelancers"],
      uniqueValueProposition: "10x faster execution through seamless AI integration and intuitive UI/UX.",
      businessModel: "B2B SaaS / Subscription",
      revenueModel: ["Freemium Tier", "Pro Subscription ($49/mo)", "Enterprise Custom Plans"],
      coreFeatures: ["AI Automation", "Real-time Analytics", "Team Collaboration", "API Integrations"],
      marketOpportunity: "Rapidly digitizing sector with high willingness to pay for efficiency tools.",
      nextSteps: ["Build MVP", "Launch Beta", "Acquire First 100 Users"]
    };
    
    businessPlan = {
      executiveSummary: `${startup.startupName} aims to dominate the software niche by introducing advanced AI workflows to traditional processes.`,
      problemAndSolution: "Problem: Inefficient workflows. Solution: Automated SaaS platform.",
      marketOpportunity: "Capitalizing on the shift towards AI-native tooling in the enterprise space.",
      productAndFeatures: "Cloud-based dashboard, AI assistants, and robust API.",
      businessModel: "Tiered SaaS subscriptions.",
      goToMarketStrategy: "Content marketing, Product Hunt launch, and direct outbound sales.",
      competitiveAnalysis: "Legacy competitors are slow; we offer agility and cutting-edge AI.",
      teamSuggestion: ["Technical Co-founder", "Growth Marketer", "Product Designer"],
      financialProjection: "Year 1 ARR: $100k. Year 2 ARR: $1M.",
      fundingAsk: "$500,000 for engineering hires and go-to-market execution."
    };

    pitchDeck = [
      { slide: 1, title: "Cover Slide", content: `${startup.startupName} - The Future of Automated Workflows` },
      { slide: 2, title: "Problem", content: "Teams waste 40% of their week on manual, fragmented tasks." },
      { slide: 3, title: "Solution", content: "An all-in-one AI platform that connects tools and automates work." },
      { slide: 4, title: "Market Size", content: "$10B+ TAM in enterprise workflow automation." },
      { slide: 5, title: "Product Demo", content: "[Dashboard Screenshot & AI Flow Demo]" },
      { slide: 6, title: "Business Model", content: "SaaS: $49/mo Pro, $99/mo Business." },
      { slide: 7, title: "Traction", content: "1,000+ waitlist, 5 beta enterprise pilots." },
      { slide: 8, title: "Go-To-Market", content: "PLG, SEO, and Outbound Sales." },
      { slide: 9, title: "Team", content: "Ex-FAANG engineers and SaaS operators." },
      { slide: 10, title: "Funding Ask", content: "$500k Pre-Seed round." }
    ];

    marketResearch = {
      tam: "$10B (Global SaaS Market for Niche)",
      sam: "$1B (Target Geography & Segment)",
      som: "$10M (Attainable Year 1-3)",
      targetMarket: "Tech-forward SMBs and mid-market enterprises.",
      customerSegments: ["Operations Teams", "Marketing Agencies", "IT Departments"],
      competitors: ["Legacy Incumbents", "Horizontal Tools (e.g., Notion, Airtable)"],
      marketTrends: ["AI Integration", "No-code/Low-code", "Remote Work Enablement"],
      opportunities: ["Vertical-specific workflows", "Data monetization", "Marketplace expansions"],
      risks: ["High customer acquisition costs", "Data privacy regulations", "Rapid AI obsolescence"],
      pricingSuggestions: "Value-based pricing. Start with a $49/mo base tier."
    };

    aiReport = {
      investmentReadinessScore: 88,
      keyStrengths: ["Highly scalable model", "Strong AI tailwinds", "High gross margins"],
      riskFactors: ["Fierce competition", "Tech execution risk", "GTM dependency"],
      improvementSuggestions: ["Solidify the exact ICP (Ideal Customer Profile)", "Build a clickable prototype immediately"],
      fundingReadiness: "Ready for Pre-Seed VC pitching.",
      mentorReviewSummary: "Excellent SaaS concept. Focus on building a rapid MVP and getting early user feedback."
    };
  }

  return { ideaAnalysis, businessPlan, pitchDeck, marketResearch, aiReport };
};

export const generateRoadmapAndTasks = (startup: any) => {
  const isPhysical = /tea|coffee|snacks|restaurant|salon|hotel|shop|cafe|retail/i.test(startup.startupIdea);
  
  const roadmap = [
    { 
      id: 1, phase: 'Phase 1', title: "Idea & Validation", status: 'completed',
      milestones: [
        { name: 'Define core concept', done: true },
        { name: 'Market research', done: true }
      ]
    },
    { 
      id: 2, phase: 'Phase 2', title: "MVP / Setup", status: 'in-progress',
      milestones: [
        { name: 'Initial build', done: true },
        { name: 'Vendor/Tech setup', done: false }
      ]
    },
    { 
      id: 3, phase: 'Phase 3', title: "Launch", status: 'upcoming',
      milestones: [
        { name: 'Soft launch', done: false },
        { name: 'Marketing push', done: false }
      ]
    },
    { 
      id: 4, phase: 'Phase 4', title: "Growth", status: 'upcoming',
      milestones: [
        { name: 'First 100 customers', done: false },
        { name: 'Scale operations', done: false }
      ]
    }
  ];

  let tasks = [];

  if (isPhysical) {
    tasks = [
      { id: 1, title: 'Finalize interior design mockups', description: 'Work with designer to plan aesthetic', phaseTitle: 'MVP / Setup', priority: 'High', status: 'in-progress', dueDate: 'Next Week' },
      { id: 2, title: 'Scout 3 potential physical locations', description: 'Visit and evaluate local spots', phaseTitle: 'Idea & Validation', priority: 'High', status: 'done', dueDate: 'Past' },
      { id: 3, title: 'Negotiate supplier contracts for inventory', description: 'Premium coffee beans, tea leaves, snacks', phaseTitle: 'MVP / Setup', priority: 'High', status: 'todo', dueDate: 'In 2 Weeks' },
      { id: 4, title: 'Apply for business licenses and health permits', description: 'Local city requirements', phaseTitle: 'MVP / Setup', priority: 'High', status: 'todo', dueDate: 'In 2 Weeks' },
      { id: 5, title: 'Plan grand opening local marketing campaign', description: 'Flyers, Instagram local ads', phaseTitle: 'Launch', priority: 'Medium', status: 'todo', dueDate: 'Next Month' },
      { id: 6, title: 'Hire initial staff (manager, barista/cashier)', description: 'Post jobs locally', phaseTitle: 'Launch', priority: 'High', status: 'todo', dueDate: 'Next Month' },
    ];
  } else {
    tasks = [
      { id: 1, title: 'Design Figma UI/UX mockups', description: 'Core dashboard screens', phaseTitle: 'MVP / Setup', priority: 'High', status: 'in-progress', dueDate: 'Next Week' },
      { id: 2, title: 'Define database schema and architecture', description: 'Postgres + Prisma', phaseTitle: 'Idea & Validation', priority: 'High', status: 'done', dueDate: 'Past' },
      { id: 3, title: 'Integrate OpenAI API for core workflow', description: 'Connect backend to LLM', phaseTitle: 'MVP / Setup', priority: 'High', status: 'todo', dueDate: 'In 2 Weeks' },
      { id: 4, title: 'Set up Stripe billing and subscriptions', description: 'Checkout portal', phaseTitle: 'MVP / Setup', priority: 'Medium', status: 'todo', dueDate: 'In 2 Weeks' },
      { id: 5, title: 'Launch on Product Hunt', description: 'Prepare assets and copy', phaseTitle: 'Launch', priority: 'High', status: 'todo', dueDate: 'Next Month' },
      { id: 6, title: 'Deploy to Vercel/AWS', description: 'Production environment setup', phaseTitle: 'Launch', priority: 'High', status: 'todo', dueDate: 'Next Month' },
    ];
  }

  return { roadmap, tasks };
};

export const getDocuments = () => {
  try {
    const data = localStorage.getItem('ai_startup_builder_documents');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveDocument = (document: any) => {
  const current = getDocuments();
  const updated = [document, ...current];
  localStorage.setItem('ai_startup_builder_documents', JSON.stringify(updated));
  return updated;
};

export const getDocumentById = (id: string) => {
  const docs = getDocuments();
  return docs.find((d: any) => d.id === id) || null;
};

export const updateDocument = (id: string, updatedData: any) => {
  let docs = getDocuments();
  let updatedDoc = null;
  docs = docs.map((d: any) => {
    if (d.id === id) {
      updatedDoc = { ...d, ...updatedData };
      return updatedDoc;
    }
    return d;
  });
  if (updatedDoc) {
    localStorage.setItem('ai_startup_builder_documents', JSON.stringify(docs));
  }
  return updatedDoc;
};

export const deleteDocument = (id: string) => {
  const docs = getDocuments();
  const filtered = docs.filter((d: any) => d.id !== id);
  localStorage.setItem('ai_startup_builder_documents', JSON.stringify(filtered));
  return filtered;
};
