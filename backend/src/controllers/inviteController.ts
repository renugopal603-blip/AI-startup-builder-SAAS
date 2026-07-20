import { Request, Response } from "express";
import crypto from "crypto";
import { sendMentorInviteEmail } from "../utils/sendMentorInviteEmail.js";

export const createMentorInvite = async (req: Request, res: Response) => {
    try {
        const { mentorName, mentorEmail, expertise, message } = req.body;

        if (!mentorName || !mentorEmail) {
            return res.status(400).json({
                success: false,
                message: "Mentor name and email are required",
            });
        }

        const inviteToken = crypto.randomBytes(32).toString("hex");

        const inviteLink = `${process.env.APP_URL}/signup?role=mentor&inviteToken=${inviteToken}`;

        const inviteData = {
            id: "invite_" + Date.now(),
            mentorName,
            mentorEmail,
            expertise: expertise || "",
            inviteToken,
            inviteLink,
            status: "active",
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };

        // Later you can save inviteData to MongoDB
        // For now, email sending part is important

        await sendMentorInviteEmail({
            mentorName,
            mentorEmail,
            inviteLink,
            message,
        });

        return res.status(201).json({
            success: true,
            message: "Mentor invite link created and email sent successfully",
            invite: inviteData,
        });
    } catch (error: any) {
        console.error("Create mentor invite failed:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create mentor invite",
            error: error.message,
        });
    }
};