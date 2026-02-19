import type { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import type { AuthenticatedRequest } from "../middleware/auth";
import { ApiResponse } from "../utils/apiRespons";
import { openRouter } from "../config/openrouter";
import fs from "fs";
import path from "path";

// Ensure temp directory exists
const tempDir = path.resolve(__dirname, "../../temp");
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

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

    // Extract the base64 image from the response
    const choices = (result as any)?.choices;
    const imageUrl = choices?.[0]?.message?.images?.[0]?.imageUrl?.url as string | undefined;

    if (!imageUrl || !imageUrl.startsWith("data:image/")) {
        return res.status(500).json(
            new ApiResponse(500, "Failed to extract image from API response")
        );
    }

    // Parse the base64 data — format: "data:image/png;base64,<data>"
    const matches = imageUrl.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
        return res.status(500).json(
            new ApiResponse(500, "Invalid base64 image format")
        );
    }

    const ext = matches[1]!; // e.g. "png"
    const base64Data = matches[2]!;
    const fileName = `generated_${Date.now()}.${ext}`;
    const filePath = path.join(tempDir, fileName);

    // Write the image to the temp folder
    fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

    const responseData = {
        image: {
            filePath,
            fileName,
            prompt,
            model: "sourceful/riverflow-v2-pro",
        },
    };

    return res.status(200).json(
        new ApiResponse(200, "Image generated and saved successfully", responseData)
    );
});
