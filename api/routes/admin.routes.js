const express = require("express");
const adminRouter = express.Router();
const { authentication } = require("../middlewares/authentication.middleware");
const { isAdmin } = require("../middlewares/authorization.middleware");
const { loginUser, listUsers,getUserById,deleteUser } = require("../controllers/users.controllers");
const { updatedBooking } = require("../controllers/booking.controllers");
const { getById } = require("../controllers/tours.controllers");
const { validateInput } = require("../middlewares/validateInput.middleware.js");
const { loginUserSchema,userIdSchema} = require("../validators/user.validator");
 const { tourIdSchema,bookingIdSchema} = require("../validators/tour.validator");
 
//login admin 
adminRouter.get("/login", validateInput(loginUserSchema, "BODY"),loginUser);

//get all users list
adminRouter.get("/listAllUsers", authentication,isAdmin, listUsers);

//Get User By Id
adminRouter.get("/getUserById/:userId",validateInput(userIdSchema, "PARAMS"),authentication,isAdmin, getUserById);

//Delete User
adminRouter.patch("/deleteUser/:userId",validateInput(userIdSchema, "PARAMS"),authentication,isAdmin, deleteUser);

//Get Tour by Id
adminRouter.get("/getTourById/:tourId",validateInput(tourIdSchema, "PARAMS"),authentication,isAdmin, getById);

//Update Booking By Admin
adminRouter.patch("/updateBooking/:bookingId",validateInput(bookingIdSchema, "PARAMS"),authentication,isAdmin, updatedBooking);


module.exports = {
  adminRouter,
};
