const express = require("express");
const app = express();
const server = require("http").createServer(app);
const connectToMongo = require("./dependencies/connectDb");
const { StatusCodes } = require("http-status-codes");
connectToMongo();

app.use(express.json());

const { tourRouter } = require("./api/routes/tours.routes");
const { userRouter } = require("./api/routes/users.routes");

const { adminRouter } = require("./api/routes/admin.routes");

app.use("/tours", tourRouter);
app.use("/users", userRouter);
app.use("/admin", adminRouter);

app.use("/", (req, res) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    message: "No such route found",
  });
});

module.exports = { server };
