import { Router } from "express";
import { uploadData } from "../controllers/uploadController";

const router = Router();

/**
 * Route: POST /upload/data
 * Purpose: Handles the incoming file upload (FormData) from the client.
 */
router.post("/data", uploadData);

export default router;