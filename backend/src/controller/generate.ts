import type { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import type { AuthenticatedRequest } from "../middleware/auth";
import { ApiResponse } from "../utils/apiRespons"; // NOTE: Original file calls it apiRespons
import { prisma } from "../lib/prisma";
import { client } from "../config/huggingface";
import { uploadBufferToCloudinary } from "../utils/cloudinary";

export const generateImage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { prompt = "Create a complete advertising caption and poster-style description for a new footwear brand called StepUp The output should include: A main headline (short, bold, motivating) A sub-headline that highlights comfort, durability, and premium performance A short body text that positions StepUp as a modern, stylish, high-quality shoe brand made for everyday wear and athletes A strong call-to-action Ensure the tone is energetic, inspirational, and suitable for social media ads, print posters, and brand campaigns." } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
        return res.status(400).json(
            new ApiResponse(400, "A 'prompt' string is required in the request body")
        );
    }

    // Generate image using Hugging Face Text-To-Image
    const result = await client.textToImage({
        model: "black-forest-labs/FLUX.1-schnell",
        inputs: prompt,
        provider: "hf-inference",
    });
    console.log(result);

    // result is a Blob. Convert to Buffer
    const arrayBuffer = await (result as any).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let secureUrl;
    try {
        const uploadResult = await uploadBufferToCloudinary(buffer, "advantage_gen_generations");
        secureUrl = uploadResult.secure_url;
    } catch (error: any) {
        console.error("Cloudinary upload failure details:", JSON.stringify(error, null, 2));
        return res.status(500).json(
            new ApiResponse(500, "Failed to upload generated image to Cloudinary", {
                error: (error?.message) || JSON.stringify(error) || String(error)
            })
        );
    }

    // Save history in database
    const generation = await prisma.generation.create({
        data: {
            prompt,
            imageUrl: secureUrl,
            model: "black-forest-labs/FLUX.1-schnell",
            userId: req.session.user.id
        }
    });

    const responseData = {
        image: {
            id: generation.id,
            url: generation.imageUrl,
            prompt,
            model: generation.model,
            createdAt: generation.createdAt
        },
    };

    return res.status(200).json(
        new ApiResponse(200, "Image generated and saved successfully", responseData)
    );
});

export const getGenerationHistory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.session.user.id;

    const generations = await prisma.generation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(
        new ApiResponse(200, "History fetched successfully", { generations })
    );
});
