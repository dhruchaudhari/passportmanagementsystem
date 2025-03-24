import { verifyJWT } from "../middleware/auth.js";
import express from 'express';
import { Wallet } from "../models/wallet.js";

const router = express.Router();

// Get wallet balance for the current user
router.get("/balance", verifyJWT, async (req, res) => {
  const userId = req.user._id; // Ensure req.user is set properly
  try {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(200).json({ success: true, balance: 0 });
    }
    res.status(200).json({ success: true, balance: wallet.balance });
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    res.status(500).json({ success: false, message: "Failed to fetch wallet balance." });
  }
});

// Deduct payment amount from the wallet
router.post("/deduct", verifyJWT, async (req, res) => {
  const userId = req.user._id;  // Extract from authenticated user
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount." });
  }

  try {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ success: false, message: "Wallet not found." });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ success: false, message: "Insufficient balance." });
    }

    wallet.balance -= amount;
    await wallet.save();

    res.status(200).json({ success: true, message: "Payment successful.", balance: wallet.balance });
  } catch (error) {
    console.error("Error deducting payment:", error);
    res.status(500).json({ success: false, message: "Payment failed. Please try again." });
  }
});

// Add funds to the wallet
router.post("/add", verifyJWT, async (req, res) => {
  const userId = req.user._id;  
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount." });
  }

  try {
    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = new Wallet({ userId, balance: amount });
    } else {
      wallet.balance += amount;
    }

    await wallet.save();

    res.status(200).json({ success: true, message: "Funds added successfully.", balance: wallet.balance });
  } catch (error) {
    console.error("Error adding funds to wallet:", error);
    res.status(500).json({ success: false, message: "Failed to add funds to wallet." });
  }
});

export default router;
