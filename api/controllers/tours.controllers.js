const TourModel = require("../models/tours.models");
const Tour = require("../schemas/tours.schemas");
const { StatusCodes } = require("http-status-codes");

//add Tour
const addTour = async (req, res, next) => {
  try {
    const { name, startingDate } = req.body;

    // Check if a tour with the same name and startingDate already exists
    const existingTour = await Tour.findOne({ name, startingDate });
    if (existingTour) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "Tour already exists",
        tour: existingTour,
      });
    }

    // Get paths of uploaded images
    req.body.images = req.files.map((file) => file.path);

    const savedTour = await TourModel.saveTour(req.body);

    if (savedTour?.status === "SUCCESS") {
      return res.status(StatusCodes.OK).json({
        message: savedTour?.status,
        data: savedTour?.data,
      });
    } else if (savedTour?.status === "FAILED") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: savedTour?.status,
        description: "User Not Save",
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: savedTour?.status,
        error: savedTour.error,
      });
    }
  } catch (error) {
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SORRY: Something went wrong",
    });
  }
};

//List All Tours
const listTours = async (req, res, next) => {
  try {
    const tours = await TourModel.getAllTours();
    console.log(tours?.data.length);
    if (tours.status === "SUCCESS") {
      return res.status(StatusCodes.OK).json({
        message: tours.status,
        data: tours.data,
      });
    } else if (tours.status === "FAILED") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: tours.status,
        description: "No tour found",
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: tours.status,
        error: tours.error,
      });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SORRY: Something went wrong",
      error: error.message,
    });
  }
};

//Get Tour By Id
const getById = async (req, res, next) => {
  try {
    const { tourId } = req.params;
    const tour = await TourModel.getTourById(tourId);
    if (tour.status === "SUCCESS") {
      return res.status(StatusCodes.OK).json({
        message: tour.status,
        data: tour.data,
      });
    } else if (tour.status === "FAILED") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: tour.status,
        description: "No Tour found",
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: tour.status,
        error: tour.error,
      });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SORRY: Something went wrong",
    });
  }
};

//update Tour
const updateTour = async (req, res, next) => {
  try {
    const { tourId } = req.params;

    const payloads = req.body;

    const conditionObj = {
      _id: tourId,
      isDeleted: false,
    };
    const updateObj = {
      $set: payloads,
    };
    const options = {
      new: true,
    };
    const updatedTour = await TourModel.updateTour(
      conditionObj,
      updateObj,
      options
    );
    if (updatedTour?.status === "SUCCESS") {
      return res.status(StatusCodes.OK).json({
        message: updatedTour.status,
        data: updatedTour?.data,
      });
    } else if (updatedTour?.status === "FAILED") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: updatedTour.status,
        description: "Update Failed",
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: updatedTour?.status,
        error: updatedTour.error,
      });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SORRY:Something went wrong",
    });
  }
};

//delete Tour
const deleteTour = async (req, res, next) => {
  try {
    const { tourId } = req.params;

    const deleteTour = await TourModel.deleteTour(tourId);

    if (deleteTour?.status === "SUCCESS") {
      return res.status(StatusCodes.OK).json({
        message: "Tour deleted",
      });
    } else if (deleteTour.status === "FAILED") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: deleteTour?.status,
        description: "No Tour found",
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: deleteTour?.status,
        error: deleteTour?.error,
      });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SORRY: Something went wrong",
    });
  }
};

module.exports = {
  addTour,
  listTours,
  getById,
  updateTour,
  deleteTour,
};
