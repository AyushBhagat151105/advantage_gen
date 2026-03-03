import { Router } from "express";
import { generateImage, getGenerationHistory } from "../controller/generate";
import { authMiddleware } from "../middleware/auth";


export const generateRouter = Router();

generateRouter.post("/image", authMiddleware, generateImage)
generateRouter.get("/history", authMiddleware, getGenerationHistory)