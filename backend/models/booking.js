const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Types.ObjectId,
      ref: "mentor",
      required: true,
    },
    client: {
      type: mongoose.Types.ObjectId,
      ref: "client",
      required: true,
    },
    appointmentPrice: { type: String },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model('Booking', bookingSchema);