import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    appointmentdate: {
        type: Date,
        required: true
    },
    centerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Center",
        required: true
    }
}, { timestamps: true })

export const Appointment = new mongoose.model("Appointment", appointmentSchema)