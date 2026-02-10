import { Router } from "express";
import { generateCaption } from "../controller/generate";
import { authMiddleware } from "../middleware/auth";


export const generateRouter = Router();

generateRouter.post("/caption", authMiddleware, generateCaption)