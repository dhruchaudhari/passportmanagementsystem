import { Document } from "../models/documents.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// Upload documents
export const uploadDocuments = async (req, res, next) => {
  try {
    const { adharcard, birthcertificate, utilitybill } = req.body;

    const newDocuments = new Document({
      adharcard,
      birthcertificate,
      utilitybill,
    });

    const savedDocuments = await newDocuments.save();
    res.status(201).json(new ApiResponse(201, savedDocuments));
  } catch (error) {
    next(new ApiError(500, "Failed to upload documents"));
  }
};
