import express from "express";
import {
  createCenter,
  getCenters,
  getCenterById,
  addSlot,
  getSlotsByCenter,
  deductSlot
} from "../controllers/centerController.js";

const router = express.Router();

router.post("/", createCenter);
router.get("/", getCenters);
router.get("/:id", getCenterById);
router.post("/:id/slots", addSlot);
router.get("/:id/slots", getSlotsByCenter);
router.post("/deduct-slot", deductSlot);

export default router;
