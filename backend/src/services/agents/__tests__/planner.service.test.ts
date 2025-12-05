import { generateDesignBrief } from '../planner.service';

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => {
    return {
        Anthropic: jest.fn().mockImplementation(() => ({
            messages: {
                create: jest.fn().mockResolvedValue({
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                platform: 'INSTAGRAM',
                                template: 'custom',
                                layoutStyle: 'grid',
                                requiredAssets: ['image', 'text'],
                                tone: 'professional'
                            })
                        }
                    ]
                })
            }
        }))
    };
});

describe('Planner Service', () => {
    it('should generate a design brief from a prompt', async () => {
        const prompt = 'Create a professional Instagram post';
        const brief = await generateDesignBrief(prompt);

        expect(brief).toBeDefined();
        expect(brief.platform).toBe('INSTAGRAM');
        expect(brief.tone).toBe('professional');
    });

    it('should handle invalid JSON gracefully', async () => {
        // Override mock for this test
        const { Anthropic } = require('@anthropic-ai/sdk');
        Anthropic.mockImplementationOnce(() => ({
            messages: {
                create: jest.fn().mockResolvedValue({
                    content: [{ type: 'text', text: 'Invalid JSON' }]
                })
            }
        }));

        const brief = await generateDesignBrief('bad prompt');
        expect(brief.platform).toBe('INSTAGRAM'); // Fallback
    });
});
