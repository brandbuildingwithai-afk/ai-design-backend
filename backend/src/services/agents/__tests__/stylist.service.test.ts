import { applyBrandStyle } from '../stylist.service';

describe('Stylist Service', () => {
    const mockBrandProfile = {
        brandName: 'Test Brand',
        primaryColor: '#FF0000',
        secondaryColor: '#00FF00',
        accentColor: '#0000FF',
        fontPrimary: 'Roboto',
        fontSecondary: 'Open Sans',
        toneOfVoice: 'professional',
        brandStyleJson: {},
        learnedFromUrls: []
    };

    const mockLayout = [
        { id: 'headline', type: 'text', x: 10, y: 10 },
        { id: 'image', type: 'image', x: 10, y: 50 }
    ];

    const mockContent = {
        headline: 'New Headline',
        body: 'New Body',
        imageUrl: 'http://example.com/img.png'
    };

    it('should apply brand styles and content to layout', async () => {
        const result = await applyBrandStyle(mockLayout, mockContent, mockBrandProfile);

        // Check structure
        expect(result.brand.name).toBe('Test Brand');

        // Check text styling
        const headline = result.elements.find((e: any) => e.id === 'headline');
        expect(headline.text).toBe('New Headline');
        expect(headline.fontFamily).toBe('Roboto');
        expect(headline.color).toBe('#FF0000');

        // Check image injection
        const image = result.elements.find((e: any) => e.type === 'image');
        expect(image.src).toBe('http://example.com/img.png');
    });
});
