// models/Wallet.js
import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  balance: { type: Number, default: 0 }, // Default balance is 0
});

export const Wallet = new mongoose.model("Wallet" , walletSchema)