import { Request, Response } from 'express';
import { generateDesignBrief } from '../services/agents/planner.service';
import { generateLayout } from '../services/agents/layout.service';
import { generateContent } from '../services/agents/content.service';
import { applyBrandStyle } from '../services/agents/stylist.service';
import prisma from '../config/database';

/**
 * Orchestrates the full design generation pipeline.
 * Expects JSON body: { prompt: string }
 */
export const generateDesign = async (req: Request, res: Response) => {
    try {
        const { prompt, templateId } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Fetch template if provided
        let template = null;
        if (templateId) {
            template = await prisma.workflowTemplate.findUnique({ where: { id: templateId } });
        }

        // 1. Design brief from user prompt
        const brief = await generateDesignBrief(prompt, template);

        // 2. Layout based on brief
        const layout = await generateLayout(brief);

        // 3. Content (copy + image)
        const content = await generateContent(brief);

        // 4. Retrieve brand profile (demo user fallback)
        const demoUser = await prisma.user.findUnique({ where: { email: 'demo@example.com' } });
        const brandProfile = await prisma.brandProfile.findFirst({ where: { userId: demoUser?.id } });
        if (!brandProfile) {
            return res.status(500).json({ error: 'Brand profile not found' });
        }

        // 5. Apply brand styling
        const design = await applyBrandStyle(layout, content, brandProfile);

        // Optional: log execution (if AgentLog model exists)
        if (prisma['agentLog']) {
            await prisma.agentLog.create({
                data: {
                    userId: demoUser?.id ?? '',
                    agentName: 'DesignOrchestrator',
                    inputPrompt: prompt,
                    outputJson: design,
                },
            });
        }

        return res.status(200).json({ design });
    } catch (error: any) {
        console.error('Design generation error:', error);
        return res.status(500).json({ error: 'Failed to generate design', details: error.message });
    }
};
