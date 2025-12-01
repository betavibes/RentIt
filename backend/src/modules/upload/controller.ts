import { Request, Response } from 'express';

export const uploadProductImages = async (req: Request, res: Response) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        if (req.files.length > 4) {
            return res.status(400).json({ message: 'Maximum 4 images allowed' });
        }

        // Generate URLs for uploaded files
        // Generate URLs for uploaded files
        const imageUrls = req.files.map((file: any) => {
            return file.path; // Cloudinary storage puts the URL in file.path
        });

        res.json({
            message: 'Images uploaded successfully',
            images: imageUrls
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Server error during upload' });
    }
};
