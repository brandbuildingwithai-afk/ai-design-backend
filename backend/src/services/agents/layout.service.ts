import { Anthropic } from '@anthropic-ai/sdk';
import { config } from 'dotenv';

config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generates layout JSON based on the design brief.
 * Returns an array of element descriptors with positions and sizes.
 */
export const generateLayout = async (brief: any) => {
    const prompt = `Generate a layout JSON for a ${brief.platform} ${brief.layoutStyle} design.
Include positions (x, y) and sizes (width, height) as percentages (0‑100).
Return an array like [{ id: "title", type: "text", x: 5, y: 5, width: 90, height: 15 }, ...].`;

    const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
        temperature: 0,
        system: 'You are a layout designer. Output ONLY valid JSON array of element descriptors.',
        messages: [{ role: 'user', content: prompt }],
    });

    try {
        const textBlock = response.content.find((c: any) => c.type === 'text') as any;
        const rawText = textBlock?.text ?? '';
        const json = JSON.parse(rawText);
        return json;
    } catch (e) {
        // fallback simple single‑image layout
        return [{ id: 'image', type: 'image', x: 0, y: 0, width: 100, height: 100 }];
    }
};
