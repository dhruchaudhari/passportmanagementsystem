import mongoose from "mongoose";

const centerSchema = new mongoose.Schema(
  {
    centername: {
      type: String,
      unique: true,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    slots: {
      type: Map, 
      of: Number, 
      default: {}, 
    },
  },
  { timestamps: true }
);

export const Center = mongoose.model("Center", centerSchema);