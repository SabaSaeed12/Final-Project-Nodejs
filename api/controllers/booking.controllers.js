const BookingModel = require("../models/booking.models");
const TourModel = require("../models/tours.models");
const Booking = require("../schemas/booking.schemas");
const { StatusCodes } = require("http-status-codes");

//addBooking 
const addBooking = async (req, res, next) => {
  try {
    const { tourId } = req.params;
    const { _id } = req.decodedToken;
    const { io } = require("../../socket");

    // Check if the tour exists
    const tour = await TourModel.getTourById(tourId);

    if (tour.status !== "SUCCESS") {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "FAILED",
        description: "Tour not found",
      });
    }

    // Check if the user has exceeded the maximum booking limit
    const savedBookingLength = await Booking.find({
      _tourId: tourId,
      isDeleted: false,
      status: "pending",
    })
      .countDocuments()
      .exec();

    if (savedBookingLength >= tour.data.numberOfPeople) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "FAILED",
        description: "Maximum bookings reached",
      });
    }

    // Check if booking time has ended
    const currentDate = new Date(Date.now());
    if (currentDate >= tour.data.startingDate) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "FAILED",
        description: "Bookings time has ended",
      });
    }
    // Save the booking
    const savedBooking = await BookingModel.saveBooking({
      _userId: _id,
      _tourId: tourId,
    });

    if (savedBooking?.status === "SUCCESS") {
      // Notify admin about the new booking
      io.emit("booking:create", {
        type: "newBooking",
        booking: savedBooking.data,
      });
      return res.status(StatusCodes.OK).json({
        message: savedBooking.status,
        data: savedBooking?.data,
      });
    } else if (savedBooking?.status === "FAILED") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: savedBooking.status,
        description: "Booking Not Saved",
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: savedBooking?.status,
        error: savedBooking.error,
      });
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "SORRY: Something went wrong",
    });
  }
};
//updateBooking
const updatedBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const { _id } = req.decodedToken;
    const { io } = require("../../socket");

    const conditionObj = {
      _id: bookingId,
      _userId: _id,
    };

    const updateObj = {
      $set: { status: status },
    };

    const options = {
      new: true,
    };

    const updatedBooking = await BookingModel.updateBooking(
      conditionObj,
      updateObj,
      options
    );

    if (updatedBooking?.status === "SUCCESS") {
      //// Notify user about the updating status
      io.emit("booking:updateStatus", {
        type: "updateStatus",
        booking: updatedBooking.data,
      });
      

      return res.status(StatusCodes.OK).json({
        message: updatedBooking.status,
        data: updatedBooking?.data,
      });
    } else if (updatedBooking?.status === "FAILED") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: updatedBooking.status,
        description: "Update Failed hhhh",
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: updatedBooking?.status,
        error: updatedBooking.error,
      });
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "SORRY: Something went wrong",
    });
  }
};

module.exports = {
  addBooking,
  updatedBooking,
};
