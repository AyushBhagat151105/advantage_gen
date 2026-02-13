import type { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import type { AuthenticatedRequest } from "../middleware/auth";
import { ApiResponse } from "../utils/apiRespons";
import { openRouter } from "../config/openrouter";

export const generateImage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { prompt = "Create a complete advertising caption and poster-style description for a new footwear brand called StepUp The output should include: A main headline (short, bold, motivating) A sub-headline that highlights comfort, durability, and premium performance A short body text that positions StepUp as a modern, stylish, high-quality shoe brand made for everyday wear and athletes A strong call-to-action Ensure the tone is energetic, inspirational, and suitable for social media ads, print posters, and brand campaigns." } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
        return res.status(400).json(
            new ApiResponse(400, "A 'prompt' string is required in the request body")
        );
    }

    // Generate image using OpenRouter with image modality
    const result = await openRouter.chat.send({
        chatGenerationParams: {
            model: "sourceful/riverflow-v2-pro",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            modalities: ["image"],
            stream: false,
        },
    });


    const responseData = {
        image: {
            url: result,
            prompt,
            model: "sourceful/riverflow-v2-pro",
        },
    };

    return res.status(200).json(
        new ApiResponse(200, "Image generated successfully", responseData)
    );
});
