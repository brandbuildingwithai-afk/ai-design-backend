import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    api_key: process.env.CLOUDINARY_API_KEY ?? '',
    api_secret: process.env.CLOUDINARY_API_SECRET ?? '',
});

export const uploadToCloudinary = async (fileBuffer: Buffer, folder: string = 'brand_uploads') => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        }).end(fileBuffer);
    });
};
