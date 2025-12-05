import Anthropic from '@anthropic-ai/sdk';
import { config } from 'dotenv';

config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface BrandAnalysisResult {
    brandName: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
    };
    fonts: {
        primary: string;
        secondary: string;
    };
    toneOfVoice: string;
    styleDescription: string;
    keywords: string[];
}

export const analyzeBrandImages = async (imageUrls: string[]): Promise<BrandAnalysisResult> => {
    try {
        // Prepare image content blocks for Claude
        const imageBlocks = imageUrls.map((url) => ({
            type: 'image' as const,
            source: {
                type: 'url' as const,
                url: url,
            },
        }));

        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            messages: [
                {
                    role: 'user',
                    content: [
                        ...imageBlocks,
                        {
                            type: 'text',
                            text: `Analyze these brand images and extract the visual identity. 
              Return ONLY a valid JSON object with the following structure, no other text:
              {
                "brandName": "inferred name or 'Unknown'",
                "colors": {
                  "primary": "hex code",
                  "secondary": "hex code",
                  "accent": "hex code"
                },
                "fonts": {
                  "primary": "font family name or style description",
                  "secondary": "font family name or style description"
                },
                "toneOfVoice": "3-5 words describing the brand voice (e.g., Professional, Playful, Minimalist)",
                "styleDescription": "A brief paragraph describing the overall aesthetic",
                "keywords": ["array", "of", "5", "style", "keywords"]
              }`
                        }
                    ]
                }
            ]
        });

        // Parse the response
        const content = message.content[0];
        if (content.type !== 'text') {
            throw new Error('Unexpected response type from Claude');
        }

        // Extract JSON from the response (handling potential markdown code blocks)
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in response');
        }

        const analysis = JSON.parse(jsonMatch[0]) as BrandAnalysisResult;
        return analysis;

    } catch (error) {
        console.error('Brand analysis failed:', error);
        throw new Error('Failed to analyze brand images');
    }
};
