//auth for admin
const isAdmin = async (req, res, next) => {
  const role = req.decodedToken.userRoles;

  if (role === "ADMIN") {
    next();
  } else {
    return res.status(401).json({
      message: "UN_AUTHORIZED",
      identifier: "0",
    });
  }
};

//auth for user
const isUser = async (req, res, next) => {
  const role = req.decodedToken.userRoles;

  if (role === "USER") {
    next();
  } else {
    return res.status(401).json({
      message: "UN_AUTHORIZED",
      identifier: "1",
    });
  }
};

module.exports = {
  isAdmin,
  isUser,
};
