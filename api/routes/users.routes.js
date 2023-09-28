const express = require("express");
const {
  addUser,
  loginUser,
  getUserById,
  updateUser,
  addToWishlist,
  getWishlist,
  deleteFromWishlist,
  logoutUser,
} = require("../controllers/users.controllers");
const { authentication } = require("../middlewares/authentication.middleware");
const { isUser } = require("../middlewares/authorization.middleware");
const { addBooking } = require("../controllers/booking.controllers");
const { generateId } = require("../middlewares/generateId.middleware");
const uploadProfile = require("../middlewares/uploadProfile.middleware");
const { validateInput } = require("../middlewares/validateInput.middleware.js");
const userRouter = express.Router();
const {
  addUserSchema,
  loginUserSchema,
  userIdSchema,
  updateUserSchema,
} = require("../validators/user.validator");
const {

  tourIdSchema,
} = require("../validators/tour.validator");

//Register User
userRouter.post(
  "/",
  generateId,
  uploadProfile,
  validateInput(addUserSchema, "BODY"),
  addUser
);


//Login User
userRouter.get("/login", validateInput(loginUserSchema, "BODY"), loginUser);

// Logout User (Add this route)
userRouter.post("/logout", authentication, isUser, logoutUser);

//Get User By Id
userRouter.get(
  "/getUserById/:userId",
  validateInput(userIdSchema, "PARAMS"),
  authentication,
  isUser,
  getUserById
);

//Update User
userRouter.patch("/updateUser",validateInput(updateUserSchema, "BODY"), authentication, isUser, updateUser);

//Add Tour in user Wishlist
userRouter.post(
  "/addWishList/:tourId",
  validateInput(tourIdSchema, "PARAMS"),
  authentication,
  isUser,
  addToWishlist
);

//Get Tour from user wishlist
userRouter.get("/getWishList", authentication, isUser, getWishlist);

//Remove Tour from user wishlist
userRouter.delete(
  "/deleteFromWishlist/:tourId",
  validateInput(tourIdSchema, "PARAMS"),
  authentication,
  isUser,
  deleteFromWishlist
);

//Add Booking
userRouter.post(
  "/:tourId",
  validateInput(tourIdSchema, "PARAMS"),
  authentication,
  isUser,
  addBooking
);

module.exports = {
  userRouter,
};
