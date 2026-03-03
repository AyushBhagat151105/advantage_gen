import { v2 as cloudinary, type UploadApiResponse, type UploadApiErrorResponse } from 'cloudinary';
import streamifier from 'streamifier';

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadBufferToCloudinary = (
    buffer: Buffer,
    folder: string = 'advantage_gen'
): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.warn("Cloudinary credentials are not properly configured");
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            { folder },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error) {
                    console.error("Cloudinary Uploader Error Segment:", error);
                    return reject(error);
                }
                if (!result) {
                    return reject(new Error("Failed to upload to Cloudinary (no result)"));
                }
                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};
