import { Request, Response } from 'express';
import { uploadToCloudinary } from '../services/cloudinary.service';
import { analyzeBrandImages } from '../services/brand-analyzer.service';

/**
 * Controller to handle brand image uploads.
 * Expects multipart/form-data with field name 'images' (up to 5 files).
 * Returns an array of Cloudinary URLs for the uploaded images.
 */
export const uploadBrandImages = async (req: Request, res: Response) => {
    try {
        // Multer stores files in memory as Buffer objects
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No images provided' });
        }

        // Upload each file to Cloudinary in parallel
        const uploadPromises = files.map((file) =>
            uploadToCloudinary(file.buffer, 'brand_uploads')
        );
        const results = await Promise.all(uploadPromises);

        // Extract secure URLs from Cloudinary responses
        const urls = results.map((result: any) => result.secure_url);

        // Respond with the list of URLs
        return res.status(200).json({ urls });
    } catch (error: any) {
        console.error('Brand image upload error:', error);
        return res.status(500).json({ error: 'Failed to upload images', details: error.message });
    }
};

/**
 * Controller to analyze brand images using Claude Vision.
 * Expects JSON body with { urls: string[] }.
 * Returns the analyzed brand profile.
 */
export const analyzeBrand = async (req: Request, res: Response) => {
    try {
        const { urls } = req.body;

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return res.status(400).json({ error: 'No image URLs provided' });
        }

        const analysis = await analyzeBrandImages(urls);

        return res.status(200).json({ analysis });
    } catch (error: any) {
        console.error('Brand analysis error:', error);
        return res.status(500).json({ error: 'Failed to analyze brand', details: error.message });
    }
};

import prisma from '../config/database';

/**
 * Controller to save the analyzed brand profile to the database.
 * Expects JSON body with brand profile data.
 */
export const createBrandProfile = async (req: Request, res: Response) => {
    try {
        const { brandName, colors, fonts, toneOfVoice, styleDescription, keywords, imageUrls } = req.body;

        // For MVP/Dev, use a default demo user if no auth token
        // In production, this would come from req.user.id
        let user = await prisma.user.findUnique({ where: { email: 'demo@example.com' } });

        if (!user) {
            // Create demo user if not exists (fallback for failed seed)
            user = await prisma.user.create({
                data: {
                    email: 'demo@example.com',
                    password: '$2a$10$demoPasswordHashPlaceholder', // Placeholder
                    name: 'Demo User',
                    subscriptionTier: 'PRO'
                }
            });
        }

        const brandProfile = await prisma.brandProfile.create({
            data: {
                userId: user.id,
                brandName: brandName || 'Untitled Brand',
                primaryColor: colors.primary,
                secondaryColor: colors.secondary,
                accentColor: colors.accent,
                fontPrimary: fonts.primary,
                fontSecondary: fonts.secondary,
                toneOfVoice: toneOfVoice,
                brandStyleJson: {
                    styleDescription,
                    keywords,
                    fullAnalysis: req.body // Store full raw data too
                },
                learnedFromUrls: imageUrls || []
            }
        });

        return res.status(201).json({ success: true, brandProfile });
    } catch (error: any) {
        console.error('Create brand profile error:', error);
        return res.status(500).json({ error: 'Failed to create brand profile', details: error.message });
    }
};
