const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
      
    },

    price: {
      type: Number,
      required: true,
    
    },
    destinations: {
      type: [String],
      required: true,
    },
    itinerary: {
      type: [String],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    numberOfPeople: {
      type: Number,
      required: true, // You can adjust this as needed
     
    },
    startingDate: {
      type: Date,
      required: true,
    },
    endingDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['ACTIVE','INACTIVE'],
      default: 'ACTIVE',
    
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    _id: true,
  }
);

module.exports = mongoose.model("Tour", tourSchema);
