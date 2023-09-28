require("dotenv").config();
const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../../dependencies/constants");
const UserModel = require("../models/users.models");

//Authentication 
const authentication = async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  const token = bearerToken?.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = JWT.verify(token, JWT_SECRET);
    //save in req for using in other process
    req.decodedToken = decodedToken;
    
  
  } catch (error) {
    //console.log(error)
    return res.status(403).json({
      message: "INVALID USER ",
    });
  }

  const { status, data } = await UserModel.getUserById(decodedToken._id);

  // If user already logged out
  if (data?.loginSession === null) {
    return res.status(403).json({
      message: "NOT ALLOWED",
    });
  }

  const isSessionMatched = data?.loginSession === decodedToken?.loginSession;

  // If user not found or login session not matched
  if (status !== "SUCCESS" || !isSessionMatched || data?.isDeleted) {
    return res.status(403).json({
      message: "INVALID USER",
    });
  }

  if (decodedToken) {
    next();
  } else {
    return res.status(403).json({
      message: "INVALID ",
    });
  }
};
module.exports = {
  authentication,
};
