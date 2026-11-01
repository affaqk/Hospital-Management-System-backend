
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    department: {
      type: String,
      trim: true,
      default: "",
    },

    time: {
      type: String,
      trim: true,
      default: "",
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Cancelled",
        "Completed",
      ],
      default: "Pending",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    consultationFee: {
      type: Number,
      min: 0,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);

export default Appointment;
