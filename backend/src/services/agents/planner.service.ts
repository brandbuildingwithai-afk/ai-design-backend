import { Anthropic } from '@anthropic-ai/sdk';
import { config } from 'dotenv';

config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generates a structured design brief from a free‑form user prompt.
 * Returns a JSON object describing the intended platform, layout style, and required assets.
 */
export const generateDesignBrief = async (prompt: string, template?: any) => {
    const templateContext = template
        ? `\nSTRICTLY FOLLOW THIS TEMPLATE:\nPlatform: ${template.platform}\nInstructions: ${template.aiInstructions}\nRequired Assets: ${template.requiredInputs.join(', ')}`
        : '';

    const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
        temperature: 0,
        system: `You are a design planner. Convert the user's natural language request into a JSON design brief with the following shape:
{
  platform: string,          // e.g., "INSTAGRAM", "LINKEDIN"
  template: string,          // suggested template name or "custom"
  layoutStyle: string,       // e.g., "grid", "single‑image", "carousel"
  requiredAssets: string[],  // list of asset types needed ("image", "logo", "text")
  tone: string               // brand tone of voice (e.g., "professional", "playful")
}
Only output valid JSON.${templateContext}
`,
        messages: [{ role: 'user', content: prompt }],
    });

    // The API returns a string; attempt to parse JSON safely.
    try {
        const textBlock = response.content.find((c: any) => c.type === 'text') as any;
        const rawText = textBlock?.text ?? '';
        const json = JSON.parse(rawText);

        // Force template platform if provided
        if (template) {
            json.platform = template.platform;
            json.template = template.name;
        }

        return json;
    } catch (e) {
        // Fallback: return minimal structure.
        return {
            platform: template?.platform || 'INSTAGRAM',
            template: template?.name || 'custom',
            layoutStyle: 'grid',
            requiredAssets: [],
            tone: 'neutral',
        };
    }
};
