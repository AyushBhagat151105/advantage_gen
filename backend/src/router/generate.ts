import { Router } from "express";
import { generateImage } from "../controller/generate";
import { authMiddleware } from "../middleware/auth";


export const generateRouter = Router();

generateRouter.post("/image", authMiddleware, generateImage)