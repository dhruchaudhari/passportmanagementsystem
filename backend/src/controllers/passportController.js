import { PassportApplication } from "../models/passportapplication.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Document } from "../models/documents.js";
import { Center } from "../models/center.js";

export const getUserApplications = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming authentication middleware adds user ID

    const applications = await PassportApplication.find({ userId }).populate("centerId");

    if (!applications.length) {
      return next(new ApiError(404, "No applications found for this user"));
    }

    res.status(200).json(new ApiResponse(200, applications, "Applications retrieved successfully"));
  } catch (error) {
    next(new ApiError(500, "Internal Server Error"));
  }
};

export const createPassportApplication = async (req, res, next) => {
  try {
    console.log("Creating Passport Application...");

    // Log the request body and files
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);

    const {
      userId,
      centerId,
      phonenumber,
      dateofbirth,
      placeofbirth,
      mothername,
      fathername,
      district,
      state,
      country,
      gender,
      visitDate,
    } = req.body;

    // Validate required fields
    if (
      !userId ||
      !centerId ||
      !phonenumber ||
      !dateofbirth ||
      !placeofbirth ||
      !mothername ||
      !fathername ||
      !district ||
      !state ||
      !country ||
      !gender ||
      !visitDate
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Step 1: Upload documents to Cloudinary and save to DB
    let documentId = null;
    if (req.files) {
      const documentData = {};
      if (req.files.adharcard) {
        const adharResponse = await uploadOnCloudinary(
          req.files.adharcard[0].path
        );
        documentData.adharcard = adharResponse.url;
      }
      if (req.files.birthcertificate) {
        const birthCertResponse = await uploadOnCloudinary(
          req.files.birthcertificate[0].path
        );
        documentData.birthcertificate = birthCertResponse.url;
      }
      if (req.files.utilitybill) {
        const utilityBillResponse = await uploadOnCloudinary(
          req.files.utilitybill[0].path
        );
        documentData.utilitybill = utilityBillResponse.url;
      }

      // Save document URLs to the database
      const newDocument = new Document(documentData);
      const savedDocument = await newDocument.save();
      documentId = savedDocument._id;
    }

    // Step 2: Create Passport Application
    const newApplication = new PassportApplication({
      userId,
      centerId,
      phonenumber,
      dateofbirth,
      placeofbirth,
      mothername,
      fathername,
      district,
      state,
      country,
      gender,
      visitDate,
      documents: documentId, // Store the Document's ObjectId
    });

    console.log("Saving Application:", newApplication);
    const savedApplication = await newApplication.save();

    // Step 3: Update the center's slots
    const center = await Center.findById(centerId);
    if (!center) {
      throw new Error("Center not found");
    }

    // Convert visitDate to a string (e.g., "2025-02-21")
    const formattedDate = new Date(visitDate).toISOString().split("T")[0];

    // Check if a slot exists for the selected date
    if (center.slots.has(formattedDate)) {
      // If the slot exists, decrement the remaining slots
      if (center.slots.get(formattedDate) <= 0) {
        throw new Error("No remaining slots available");
      }
      center.slots.set(formattedDate, center.slots.get(formattedDate) - 1);
    } else {
      // If the slot doesn't exist, create a new one with default slots (e.g., 10)
      center.slots.set(formattedDate, 9); // Default slots minus 1
    }

    // Save the updated center
    await center.save();
    console.log("Center saved successfully");

    res.status(201).json(new ApiResponse(201, savedApplication));
  } catch (error) {
    console.error("Database Save Error:", error);
    next(new ApiError(500, "Failed to create passport application"));
  }
};


export const updatePassportApplication = async (req, res, next) => {
  try {
    const { id } = req.params; // Passport application ID
    const { documents } = req.body; // Document ID

    const updatedApplication = await PassportApplication.findByIdAndUpdate(
      id,
      { documents },
      { new: true }
    );

    if (!updatedApplication) {
      throw new ApiError(404, "Passport application not found", [
        `No application found with ID: ${id}`,
      ]);
    }

    res.status(200).json(new ApiResponse(200, updatedApplication));
  } catch (error) {
    next(
      new ApiError(
        500,
        "Failed to update passport application",
        [error.message],
        error.stack
      )
    );
  }
};
