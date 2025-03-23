import express from 'express';
import { PassportApplication } from '../models/passportapplication.js';
import { Document } from '../models/documents.js';
import { verifyJWT } from '../middleware/auth.js';
import { adminCheck } from '../middleware/admin.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Get all applications (Dashboard List)
router.get('/applications', verifyJWT, adminCheck, async (req, res) => {
  try {
    const applications = await PassportApplication.find()
      .select('userId status visitDate createdAt')
      .populate('userId', 'username email')
      .populate('centerId', 'centername location')
      .sort({ createdAt: -1 });

    res.send(applications);
  } catch (error) {
    res.status(500).send();
  }
});

// Get single application details
router.get('/applications/:id', verifyJWT, adminCheck, async (req, res) => {
  try {
    const application = await PassportApplication.findById(req.params.id)
      .populate('userId')
      .populate('centerId')
      .populate("documents");

    if (!application) return res.status(404).send();
    res.send(application);
  } catch (error) {
    res.status(500).send();
  }
});

// Update application status
router.patch('/applications/:id/status', verifyJWT, adminCheck, async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Debugging

    if (!req.body.status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const application = await PassportApplication.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('userId');

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    console.log("Updating application status:", req.params.id, "to", req.body.status); // Debugging

    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      if (application.status === "REJECTED") {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: application.userId.email,
          subject: 'Application Status Updated',
          text: `Your application status is now: ${application.status}.It seems your details are not correct ,please check your details and resubmit your application !`
        });
      }
      else {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: application.userId.email,
          subject: 'Application Status Updated',
          text: `Your application status is now: ${application.status}. Please bring the hard copy with you at the time of physical meeting.`
        });
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    res.json({ message: "Status updated successfully", application });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
