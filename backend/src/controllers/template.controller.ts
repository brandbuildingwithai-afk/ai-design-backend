import { Request, Response } from 'express';
import prisma from '../config/database';

export const getTemplates = async (req: Request, res: Response) => {
    try {
        const templates = await prisma.workflowTemplate.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
        res.json({ templates });
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
};

export const getTemplateById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const template = await prisma.workflowTemplate.findUnique({
            where: { id },
        });

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        res.json({ template });
    } catch (error) {
        console.error('Error fetching template:', error);
        res.status(500).json({ error: 'Failed to fetch template' });
    }
};
