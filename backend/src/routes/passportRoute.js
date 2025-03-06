import express from "express";
import { upload } from "../middleware/multer.js";
import {
  createPassportApplication,
  updatePassportApplication,
  getUserApplications
} from "../controllers/passportController.js";
import { verifyJWT } from "../middleware/auth.js";

const router = express.Router();

// Route to create a passport application
// router.post("/create", createPassportApplication);

router.route("/apply").post(upload.fields([
  { name: "adharcard", maxCount: 1 },
  { name: "birthcertificate", maxCount: 1 },
  { name: "utilitybill", maxCount: 1 },
]),createPassportApplication)

// Route to update a passport application with document ID
router.put("/apply/:id", updatePassportApplication);

router.get("/" , verifyJWT,  getUserApplications)

export default router;
