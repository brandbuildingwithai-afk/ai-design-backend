import prisma from '../../config/database';
import { config } from 'dotenv';

config();

/**
 * Applies brand colors, fonts, and tone to the layout and content.
 * Returns a single design JSON ready for the frontend canvas.
 */
export const applyBrandStyle = async (layout: any[], content: any, brandProfile: any) => {
    // Merge layout with brand colors/fonts where applicable
    const styledElements = layout.map((el) => {
        const styled = { ...el };
        // Example: if element is text, apply primary/secondary fonts
        if (el.type === 'text') {
            styled.fontFamily = brandProfile.fontPrimary;
            styled.color = brandProfile.primaryColor;
        }
        // If element is image, keep as is (image URL will be injected later)
        return styled;
    });

    // Attach content (headline, body, image) to appropriate elements
    // Assume first text element is headline, second is body, first image element gets imageUrl
    const headlineEl = styledElements.find((e) => e.type === 'text' && e.id?.includes('headline'));
    const bodyEl = styledElements.find((e) => e.type === 'text' && e.id?.includes('body'));
    const imageEl = styledElements.find((e) => e.type === 'image');

    if (headlineEl) headlineEl.text = content.headline;
    if (bodyEl) bodyEl.text = content.body;
    if (imageEl && content.imageUrl) imageEl.src = content.imageUrl;

    // Include brand metadata for reference
    const design = {
        elements: styledElements,
        brand: {
            name: brandProfile.brandName,
            colors: {
                primary: brandProfile.primaryColor,
                secondary: brandProfile.secondaryColor,
                accent: brandProfile.accentColor,
            },
            fonts: {
                primary: brandProfile.fontPrimary,
                secondary: brandProfile.fontSecondary,
            },
            tone: brandProfile.toneOfVoice,
        },
    };

    return design;
};
