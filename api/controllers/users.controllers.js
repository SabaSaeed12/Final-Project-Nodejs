const UserModel = require("../models/users.models");
const User = require("../schemas/users.schema");
const Tour = require("../schemas/tours.schemas");
const { signToken } = require("../helpers/signToken");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { generateSession } = require("../helpers/session");

// User Signup
const addUser = async (req, res, next) => {
  try {
    const { password, email } = req.body;

    const userFound = await UserModel.getUserByEmail(email);

    if (userFound.status === "SUCCESS") {
      return res.status(StatusCodes.CONFLICT).json({
        message: "EMAIL ALREADY EXISTS",
      });
    }

    // Generating Random Session String
    const session = generateSession();
    req.body.loginSession = session;

    // Generating salt and hashing the password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt);

    req.body.userProfilePhotoPath = req?.file.path;

    const savedUser = await UserModel.saveUser(req.body);

    if (savedUser?.status === "SUCCESS") {
      savedUser.data.password = undefined;
      savedUser.data.loginSession = undefined;

      return res.status(StatusCodes.CREATED).json({
        message: savedUser.status,
        data: savedUser?.data,
      });
    } else if (savedUser?.status === "FAILED") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: savedUser.status,
        description: "User Not Saved",
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: savedUser?.status,
        error: savedUser.error,
      });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SORRY: Something went wrong",
    });
  }
};

// User Login
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userFound = await UserModel.getUserByEmail(email);
    //console.log(userFound);

    if (userFound.status !== "SUCCESS") {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "INVALID USER a",
      });
    }

    const isMatch = await bcrypt.compare(password, userFound.data?.password);

    if (isMatch) {
      const signedToken = await signToken(userFound.data);
      return res.status(StatusCodes.OK).json({
        message: "SUCCESS",
        token: signedToken,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "INVALID USER b",
      });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SORRY: Something went wrong",
    });
  }
};

// List All Users
const listUsers = async (req, res, next) => {
  try {
    const users = await UserModel.getAllUsers();

    if (users?.status === "SUCCESS") {
      for (const user of users.data) {
        delete user.password;
        delete user.loginSession;
        delete user.email;
      }
      return res.status(StatusCodes.OK).json({
        total: users?.data.length,
        message: users?.status,
        data: users?.data,
      });
    } else if (users?.status === "FAILED") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: users?.status,
        description: "No user found",
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: users?.status,
        error: users?.error,
      });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SORRY: Something went wrong",
    });
  }
};

//Get User By Id
const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.getUserById(userId);
    if (user?.status === "SUCCESS") {
      user.data.password = undefined;
      user.data.loginSession = undefined;

      return res.status(StatusCodes.OK).json({
        message: user?.status,
        data: user?.data,
      });
    } else if (user?.status === "FAILED") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: user?.status,
        description: "No user found",
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: user?.status,
        error: user?.error,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SORRY: Something went wrong",
    });
  }
};

// Update User
const updateUser = async (req, res, next) => {
  try {
    const { _id } = req.decodedToken;
  
    const { firstName, lastName, phoneNumber } = req.body;

    const conditionObj = {
      _id: _id,
      isDeleted: false,
    };

    const updateObj = {
      $set: {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
      },
    };

    const options = {
      new: true,
    };

    const updatedUser = await UserModel.updateUser(
      conditionObj,
      updateObj,
      options
    );
    if (updatedUser?.status === "SUCCESS") {
      return res.status(StatusCodes.OK).json({
        message: updatedUser.status,
        data: updatedUser?.data,
      });
    } else if (updatedUser?.status === "FAILED") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: updatedUser.status,
        description: "Update Failed",
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: updatedUser?.status,
        error: updatedUser.error,
      });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SORRY: Something went wrong",
    });
  }
};

//Delete User
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const deleteUser = await UserModel.deleteUser(userId);

    if (deleteUser?.status === "SUCCESS") {
      return res.status(StatusCodes.OK).json({
        message: "User Deleted Successfully",
      });
    } else if (deleteUser?.status === "FAILED") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: deleteUser?.status,
        description: "No User found",
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: deleteUser?.status,
        error: deleteUser?.error,
      });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SORRY: Something went wrong",
    });
  }
};

//Add tour in user wishlist
const addToWishlist = async (req, res, next) => {
  try {
    const { tourId } = req.params;

    // Find the user by their ID
    const user = await User.findById(req.decodedToken._id);

    // Find the tour by its ID
    const tour = await Tour.findById(tourId);

    // Check if the tour exists
    if (!tour) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Tour not found." });
    }

    // Check if the tour is already in the wishlist
    if (user.wishlist.includes(tourId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Tour is already in the wishlist." });
    }

    // Add the tour to the user's wishlist
    user.wishlist.push(tourId);

    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ message: "Tour added to wishlist successfully." });
  } catch (error) {
    // Handle errors
    //console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error." });
  }
};

//Get wishlist of user
const getWishlist = async (req, res, next) => {
  try {
    // Find the user by their ID and populate their wishlist
    const user = await User.findById(req.decodedToken._id).populate("wishlist");

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found." });
    }

    res.status(StatusCodes.OK).json({ wishlist: user.wishlist });
  } catch (error) {
    // Handle errors
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error." });
  }
};

//Delete a tour from wishlist
const deleteFromWishlist = async (req, res, next) => {
  try {
    const { tourId } = req.params;

    // Find the user by their ID
    const user = await User.findById(req.decodedToken._id);

    // Check if the tour is in the user's wishlist
    if (!user.wishlist.includes(tourId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Tour is not in the wishlist." });
    }

    // Remove the tour from the user's wishlist
    user.wishlist = user.wishlist.filter(
      (wishlistTourId) => wishlistTourId.toString() !== tourId
    );

    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ message: "Tour removed from wishlist successfully." });
  } catch (error) {
    // Handle errors
    //console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error." });
  }
};

//Logout User
const logoutUser = async (req, res, next) => {
  try {
    // You can access the user's data from the decoded token in req.decodedToken
    const { _id, loginSession } = req.decodedToken;

    // Nullify the session string in the user document
    await User.findOneAndUpdate({ _id: _id }, { loginSession: null });
    console.log(req.decodedToken);

    return res.status(StatusCodes.OK).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "SORRY: Something went wrong",
    });
  }
};

module.exports = {
  addUser,
  loginUser,
  listUsers,
  getUserById,
  deleteUser,
  updateUser,
  addToWishlist,
  getWishlist,
  deleteFromWishlist,
  logoutUser,
};
