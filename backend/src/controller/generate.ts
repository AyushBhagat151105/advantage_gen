import type { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import type { AuthenticatedRequest } from "../middleware/auth";
import { ApiResponse } from "../utils/apiRespons";

export const generateCaption = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {

    const userId = req.session.user.id;

    console.log(userId);

    return res.status(200).json(new ApiResponse(200, "Caption generated successfully", { session: req.session }));
})