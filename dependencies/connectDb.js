
const mongoose = require("mongoose");
const { MONGODB_URI, mongoOptions } = require('./constants');
const connectToMongo = () => {
  mongoose
    .connect(MONGODB_URI, mongoOptions)
    .then(() => {
      console.log("connected");
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
      });
};

module.exports = connectToMongo;
