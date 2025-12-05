import { Request, Response } from 'express';
import prisma from '../config/database';

export const savePost = async (req: Request, res: Response) => {
    try {
        const { elementsJson, promptUsed, platform, templateId, brandProfileId } = req.body;

        // For now, use demo user
        const demoUser = await prisma.user.findUnique({ where: { email: 'demo@example.com' } });
        if (!demoUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const post = await prisma.generatedPost.create({
            data: {
                userId: demoUser.id,
                brandProfileId,
                templateId: templateId || null,
                platform: platform || 'INSTAGRAM',
                promptUsed,
                elementsJson,
                isFavorite: false,
            },
        });

        res.json({ post });
    } catch (error) {
        console.error('Error saving post:', error);
        res.status(500).json({ error: 'Failed to save post' });
    }
};

export const getUserPosts = async (req: Request, res: Response) => {
    try {
        // For now, use demo user
        const demoUser = await prisma.user.findUnique({ where: { email: 'demo@example.com' } });
        if (!demoUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const posts = await prisma.generatedPost.findMany({
            where: { userId: demoUser.id },
            orderBy: { createdAt: 'desc' },
            include: {
                template: true,
                brandProfile: true,
            },
        });

        res.json({ posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const post = await prisma.generatedPost.findUnique({
            where: { id },
            include: {
                template: true,
                brandProfile: true,
            },
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({ post });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.generatedPost.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
};
