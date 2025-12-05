import { generateLayout } from '../layout.service';

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => {
    return {
        Anthropic: jest.fn().mockImplementation(() => ({
            messages: {
                create: jest.fn().mockResolvedValue({
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify([
                                { id: 'title', type: 'text', x: 10, y: 10, width: 80, height: 20 },
                                { id: 'image', type: 'image', x: 10, y: 40, width: 80, height: 50 }
                            ])
                        }
                    ]
                })
            }
        }))
    };
});

describe('Layout Service', () => {
    it('should generate a layout array from a brief', async () => {
        const brief = {
            platform: 'INSTAGRAM',
            layoutStyle: 'grid',
            requiredAssets: ['text', 'image']
        };

        const layout = await generateLayout(brief);

        expect(Array.isArray(layout)).toBe(true);
        expect(layout.length).toBe(2);
        expect(layout[0].type).toBe('text');
    });

    it('should return fallback layout on error', async () => {
        // Override mock to fail parsing
        const { Anthropic } = require('@anthropic-ai/sdk');
        Anthropic.mockImplementationOnce(() => ({
            messages: {
                create: jest.fn().mockResolvedValue({
                    content: [{ type: 'text', text: 'Invalid JSON' }]
                })
            }
        }));

        const brief = { platform: 'INSTAGRAM' };
        const layout = await generateLayout(brief);

        expect(Array.isArray(layout)).toBe(true);
        expect(layout[0].id).toBe('image'); // Fallback has id 'image'
    });
});
