const Booking = require("../schemas/booking.schemas");

const saveBooking = async (data) => {
  try {
    const booking = new Booking(data);
    const savedBooking = await booking.save();

    if (savedBooking) {
      return {
        status: "SUCCESS",
        data: savedBooking,
      };
    } else {
      return {
        status: "FAILED",
      };
    }
  } catch (error) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      error: error,
    };
  }
};
const updateBooking = async (conditionObj, updateObj, options) => {
  try {
    const updateBooking = await Booking.findByIdAndUpdate(
      conditionObj,
      updateObj,
      options
    )
      .lean()
      .exec();

    //console.log(updateBooking);

    if (updateBooking) {
      return {
        status: "SUCCESS",
        data: updateBooking,
      };
    } else {
      return {
        status: "FAILED",
      };
    }
  } catch (error) {

    return {
      status: "INTERNAL_SERVER_ERROR",
      error: error,
    };
  }
};
module.exports = {
  saveBooking,
  updateBooking,
};
