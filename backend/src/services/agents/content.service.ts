import { Stability } from '@stability/sdk';
import { config } from 'dotenv';

config();

const stability = new Stability({
    apiKey: process.env.STABILITY_API_KEY,
});

/**
 * Generates copy text and an image URL based on the design brief.
 * Returns an object with `texts` (array of strings) and `images` (array of URLs).
 */
export const generateContent = async (brief: any) => {
    // Simple placeholder copy generation using Anthropic (could be OpenAI as fallback)
    const copyPrompt = `Write concise marketing copy for a ${brief.platform} post with a ${brief.tone} tone. Include a headline and a short body. Return JSON like { headline: string, body: string }.`;
    // Reuse Anthropic for copy (if needed import Anthropic)
    const { Anthropic } = await import('@anthropic-ai/sdk');
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const copyResp = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 512,
        temperature: 0,
        system: 'You are a copywriter. Output ONLY valid JSON.',
        messages: [{ role: 'user', content: copyPrompt }],
    });
    let copyJson: any = {};
    try {
        copyJson = JSON.parse(copyResp.content[0].text);
    } catch (e) {
        copyJson = { headline: 'Your Brand', body: 'Check out our latest product!' };
    }

    // Generate a single image using Stability AI (placeholder prompt)
    const imagePrompt = `Create a high‑resolution ${brief.platform} style image for a ${brief.tone} brand. Use colors from the brand profile if available.`;
    let imageUrl = '';
    try {
        const imgResp = await stability.textToImage({
            prompt: imagePrompt,
            width: 1024,
            height: 1024,
        });
        // Assume first artifact URL
        imageUrl = imgResp.artifacts[0].url;
    } catch (e) {
        imageUrl = '';
    }

    return {
        headline: copyJson.headline,
        body: copyJson.body,
        imageUrl,
    };
};
