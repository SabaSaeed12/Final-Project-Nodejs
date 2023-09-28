const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    _userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true
      
    },
    _tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour", // Reference to the Tour model
      required: true
      
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled"],
      default: "pending",
      required: true
    },

    isDeleted: { type: Boolean, default: false },
    
  },
  { 
    timestamps: true,
    _id: true, 
}
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
