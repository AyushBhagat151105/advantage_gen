import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { config } from ".";

export const registry = new OpenAPIRegistry();


const apiDescription = `
Advantage Gen API - Backend for wardrobe management with real-time sync support.

**Authentication**: All endpoints require Better-auth JWT in Authorization header.
`;

import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

const GenerateImageRequestSchema = registry.register(
    "GenerateImageRequest",
    z.object({
        prompt: z.string().optional().openapi({
            description: "The prompt to generate an image from",
            example: "Create a complete advertising caption and poster-style description for a new footwear brand called StepUp",
        }),
    }).openapi("GenerateImageRequest")
);

const GenerateImageResponseSchema = registry.register(
    "GenerateImageResponse",
    z.object({
        success: z.boolean(),
        statusCode: z.number(),
        message: z.string(),
        data: z.object({
            image: z.object({
                filePath: z.string(),
                fileName: z.string(),
                prompt: z.string(),
                model: z.string(),
            }),
        }).optional(),
        timestamp: z.string(),
    }).openapi("GenerateImageResponse")
);

const ErrorResponseSchema = registry.register(
    "ErrorResponse",
    z.object({
        success: z.boolean(),
        statusCode: z.number(),
        message: z.string(),
        data: z.record(z.string(), z.unknown()).optional(),
        timestamp: z.string(),
    }).openapi("ErrorResponse")
);

registry.registerPath({
    method: "post",
    path: "/api/generate/image",
    summary: "Generate Image",
    description: "Generate an image based on a text prompt.",
    tags: ["Generate"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: GenerateImageRequestSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Image generated successfully",
            content: {
                "application/json": {
                    schema: GenerateImageResponseSchema,
                },
            },
        },
        400: {
            description: "Bad Request",
            content: {
                "application/json": {
                    schema: ErrorResponseSchema,
                },
            },
        },
        500: {
            description: "Internal Server Error",
            content: {
                "application/json": {
                    schema: ErrorResponseSchema,
                },
            },
        },
    },
});

export const generateOpenAPIDocument = () => {

    const doc = new OpenApiGeneratorV3(registry.definitions).generateDocument({
        openapi: "3.0.3",
        info: {
            title: "Advantage Gen API",
            version: "1.0.0",
            description: apiDescription,
        },
        servers: [{ url: `http://localhost:${config.PORT}` }],
        tags: [
            { name: "Generate", description: "Generation endpoints" }
        ],
    });

    (doc as unknown as Record<string, unknown>)["x-tagGroups"] = [
        {
            name: "API Routes",
            tags: ["Generate"]
        },
    ];

    return doc;
};