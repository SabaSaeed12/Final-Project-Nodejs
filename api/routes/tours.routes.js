const express = require("express");
const { generateId } = require("../middlewares/generateId.middleware");
const upload = require("../middlewares/upload.middleware");
const { validateInput } = require("../middlewares/validateInput.middleware.js");
const { addTourSchema,tourIdSchema,} = require("../validators/tour.validator");
const {
  addTour,
  listTours,
  getById,
  updateTour,
  deleteTour,
} = require("../controllers/tours.controllers");
const { authentication } = require("../middlewares/authentication.middleware");
const { isAdmin,isUser } = require("../middlewares/authorization.middleware");
const tourRouter = express.Router();

//Create Tour
tourRouter.post("/",authentication,isAdmin, generateId, upload,validateInput(addTourSchema, "BODY"), addTour);

//List all Tours
tourRouter.get("/list", listTours);

//Get Tour by Id
tourRouter.get("/getTourById/:tourId",validateInput(tourIdSchema, "PARAMS"),authentication,isUser, getById);

//Update Tour
tourRouter.patch("/updateTour/:tourId",validateInput(tourIdSchema, "PARAMS"),authentication,isAdmin, updateTour);

//Delete Tour
tourRouter.delete("/deleteTour/:tourId",validateInput(tourIdSchema, "PARAMS"),authentication,isAdmin, deleteTour);



module.exports = {
  tourRouter,
};
