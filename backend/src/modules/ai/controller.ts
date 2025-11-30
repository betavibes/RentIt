import { Request, Response } from 'express';
import { openai, isAIConfigured } from '../../config/ai';

export const generateProductImages = async (req: Request, res: Response) => {
    try {
        const { name, description, category, color, count = 1 } = req.body;

        if (!name || !category) {
            return res.status(400).json({ message: 'Product name and category are required' });
        }

        // Mock Mode (if no API key)
        if (!isAIConfigured()) {
            console.log('AI not configured, returning mock images');
            const mockImages = Array(count).fill(0).map((_, i) =>
                `https://placehold.co/1024x1024/EEE/31343C?text=${encodeURIComponent(name)}+${i + 1}`
            );

            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            return res.json({
                images: mockImages,
                isMock: true,
                message: 'Generated mock images (Add OPENAI_API_KEY to .env for real AI generation)'
            });
        }

        // Real AI Generation
        const prompt = `Professional e-commerce product photography of ${name} (${category}). 
        ${description ? `Description: ${description}.` : ''}
        ${color ? `Color: ${color}.` : ''}
        High quality, studio lighting, white background, 4k resolution, highly detailed, photorealistic.`;

        console.log('Generating AI images with prompt:', prompt);

        const response = await openai!.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1, // DALL-E 3 currently supports n=1 per request
            size: "1024x1024",
            quality: "standard",
            response_format: "url",
        });

        // If user requested more than 1 image, we might need multiple requests for DALL-E 3
        // For now, let's just return the one high-quality image
        // Or if we use DALL-E 2, we can generate multiple, but quality is lower.
        // Let's stick to 1 high quality DALL-E 3 image for now as the primary.

        const imageUrl = response.data?.[0]?.url;

        if (!imageUrl) {
            throw new Error('No image URL returned from OpenAI');
        }

        return res.json({
            images: [imageUrl],
            isMock: false
        });

    } catch (error: any) {
        console.error('AI Generation error:', error);
        res.status(500).json({
            message: 'Failed to generate images',
            error: error.message
        });
    }
};
