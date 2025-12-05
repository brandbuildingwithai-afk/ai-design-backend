import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const email = 'demo@example.com';
    const password = await bcrypt.hash('password123', 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Demo User',
            password,
            subscriptionTier: 'PRO',
            creditsRemaining: 100,
        },
    });

    console.log({ user });

    // Seed Templates
    const templates = [
        {
            name: 'Instagram Post',
            platform: 'INSTAGRAM',
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/174/174855.png',
            promptTemplate: 'Create a visually engaging Instagram post about {topic}. Key message: {message}. Vibe: {vibe}.',
            requiredInputs: ['topic', 'message', 'vibe'],
            aiInstructions: 'Focus on strong visual hierarchy, bold typography, and high-quality imagery suitable for a square format.',
            previewImageUrl: 'https://via.placeholder.com/1080x1080?text=IG+Post',
            dimensions: { width: 1080, height: 1080 },
        },
        {
            name: 'LinkedIn Post',
            platform: 'LINKEDIN',
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/174/174857.png',
            promptTemplate: 'Create a professional LinkedIn post about {topic}. Professional insight: {insight}. Call to action: {cta}.',
            requiredInputs: ['topic', 'insight', 'cta'],
            aiInstructions: 'Use a clean, professional layout. Emphasize the text content and insight. Use corporate-friendly colors.',
            previewImageUrl: 'https://via.placeholder.com/1080x1350?text=LinkedIn+Post',
            dimensions: { width: 1080, height: 1350 },
        },
        {
            name: 'Twitter Quote',
            platform: 'TWITTER',
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/733/733579.png',
            promptTemplate: 'Create a Twitter quote card for: "{quote}" by {author}.',
            requiredInputs: ['quote', 'author'],
            aiInstructions: 'Minimalist design. Large, readable typography for the quote. High contrast.',
            previewImageUrl: 'https://via.placeholder.com/1600x900?text=Twitter+Quote',
            dimensions: { width: 1600, height: 900 },
        },
    ];

    for (const t of templates) {
        await prisma.workflowTemplate.upsert({
            where: { name: t.name },
            update: {},
            create: {
                name: t.name,
                platform: t.platform as any,
                iconUrl: t.iconUrl,
                promptTemplate: t.promptTemplate,
                requiredInputs: t.requiredInputs,
                aiInstructions: t.aiInstructions,
                previewImageUrl: t.previewImageUrl,
                dimensions: t.dimensions,
            },
        });
    }

    console.log('Templates seeded successfully');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
