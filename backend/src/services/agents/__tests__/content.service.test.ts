import { generateContent } from '../content.service';
import axios from 'axios';

// Mock axios and Anthropic
jest.mock('axios');
jest.mock('@anthropic-ai/sdk', () => {
    return {
        Anthropic: jest.fn().mockImplementation(() => ({
            messages: {
                create: jest.fn().mockResolvedValue({
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                headline: 'Test Headline',
                                body: 'Test Body'
                            })
                        }
                    ]
                })
            }
        }))
    };
});

describe('Content Service', () => {
    it('should generate content and image URL', async () => {
        // Mock axios response for image generation
        (axios.post as jest.Mock).mockResolvedValue({
            data: {
                artifacts: [{ url: 'http://example.com/image.png' }]
            }
        });

        const brief = {
            platform: 'INSTAGRAM',
            tone: 'professional'
        };

        const content = await generateContent(brief);

        expect(content.headline).toBe('Test Headline');
        expect(content.body).toBe('Test Body');
        expect(content.imageUrl).toBe('http://example.com/image.png');
    });

    it('should handle image generation failure gracefully', async () => {
        (axios.post as jest.Mock).mockRejectedValue(new Error('API Error'));

        const brief = { platform: 'INSTAGRAM' };
        const content = await generateContent(brief);

        expect(content.imageUrl).toBe('');
        expect(content.headline).toBe('Test Headline');
    });
});
