import type { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import type { AuthenticatedRequest } from "../middleware/auth";
import { ApiResponse } from "../utils/apiRespons";
import { client } from "../config/huggingface";
import { openRouter } from "../config/openrouter";

export const generateCaption = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {

    const data = await client.chatCompletion({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [
            {
                role: "user",
                content: "Create an advertisement caption for a new brand of shoes called 'StepUp'",
            },
        ],
    });

    const openRouterData = await openRouter.chat.send({
        chatGenerationParams: {
            model: "google/gemma-3n-e2b-it:free",
            messages: [
                {
                    role: "user",
                    content: "Create an advertisement caption for a new brand of shoes called 'StepUp'",
                }
            ],
            stream: false,
        },
    })


    return res.status(200).json(new ApiResponse(200, "Caption generated successfully", { huggingface: data, openRouter: openRouterData }));
})