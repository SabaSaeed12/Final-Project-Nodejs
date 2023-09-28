const Tour = require("../schemas/tours.schemas");

const saveTour = async (data) => {
  try {
    const tour = new Tour(data);
    const savedTour = await tour.save();

    if (savedTour) {
      return {
        status: "SUCCESS",
        data: savedTour,
      };
    } else {
      return {
        status: "FAILED",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: "INTERNAL_SERVER_ERROR",
      error: error,
    };
  }
};

const getAllTours = async () => {
  try {
    const tours = await Tour.find({ isDeleted: false }).lean().exec();
    // console.log(tours);

    if (tours.length > 0) {
      return {
        status: "SUCCESS",
        data: tours,
      };
    } else {
      return {
        status: "FAILED",
      };
    }
  } catch (error) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      error: error.message,
    };
  }
};

const getTourById = async (_id) => {
  try {
    const tour = await Tour.findById({ _id, isDeleted: false }).lean().exec();
    
    if (tour) {
      return {
        status: "SUCCESS",
        data: tour,
      };
    } else {
      return {
        status: "FAILED",
      };
    }
  } catch (error) {
    return {
      status: "INTERNAL_SERVER_ERROR",
      error: error.message,
    };
  }
};

const updateTour = async (conditionObj, updateObj, options) => {
  try {
    const updateTour = await Tour.findOneAndUpdate(
      conditionObj,
      updateObj,
      options
    )
      .lean()
      .exec();
    if (updateTour) {
      //console.log(updat);
      return {
        status: "SUCCESS",
        data: updateTour,
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
const deleteTour = async (_id) => {
  try {
   // console.log(_id);
    const deletedTour = await Tour.findByIdAndUpdate(_id, { isDeleted: true });
    if (deletedTour) {
      return {
        status: "SUCCESS",
        data: deletedTour,
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
  saveTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
};
