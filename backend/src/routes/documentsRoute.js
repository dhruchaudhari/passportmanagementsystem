import express from "express";
import { uploadDocuments } from "../controllers/documentsController.js";

const router = express.Router();

// Route to upload documents
router.post("/upload", uploadDocuments);

export default router;
