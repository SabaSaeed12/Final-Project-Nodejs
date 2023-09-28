const JWT = require("jsonwebtoken");
const {JWT_SECRET} = require('../../dependencies/constants');

//SignToken function
const signToken = async (user) => {
  const tokenData = {
    _id: user._id,
    userRoles: user.userRoles,
    loginSession:user.loginSession
  };

  const signedToken = await JWT.sign(tokenData, JWT_SECRET);
  console.log(signedToken)
  return signedToken;
};

module.exports = {
  signToken,
};
