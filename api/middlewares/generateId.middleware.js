const mongoose = require("mongoose");

//generate Id for multer purpose
const generateId = async (req, res, next) => {
  const Id = new mongoose.Types.ObjectId();
  req.generatedId = Id.toString();

  next();
};

module.exports = { generateId };
