const User = require("../schemas/users.schema");

const saveUser = async (userData) => {
  try {
    const user = new User({
      ...userData,
    });
    const savedUser = await user.save();

    if (savedUser) {
      return {
        status: "SUCCESS",
        data: savedUser,
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
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email, isDeleted: false })
      .lean()
      .exec();

    if (user) {
      return {
        status: "SUCCESS",
        data: user,
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
const getAllUsers = async () => {
  try {
    const users = await User.find({ isDeleted: false, userRoles: "USER" })
      .lean()
      .exec();

    if (users.length > 0) {
      return {
        status: "SUCCESS",
        data: users,
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
const getUserById = async (_id) => {
  try {
    const user = await User.findById({ _id, isDeleted: false })
      .select("-password -isDeleted")
      .lean()
      .exec();

    if (user) {
      return {
        status: "SUCCESS",
        data: user,
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
const updateUser = async (conditionObj, updateObj, options) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      conditionObj,
      updateObj,
      options
    )
      .lean()
      .exec();

    if (updatedUser) {
      return {
        status: "SUCCESS",
        data: updatedUser,
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
const deleteUser = async (_id) => {
  try {
    //console.log(_id);
    const deletedUser = await User.findByIdAndUpdate(_id, { isDeleted: true });

    if (deletedUser) {
      return {
        status: "SUCCESS",
        data: deletedUser,
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
  saveUser,
  getUserByEmail,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
