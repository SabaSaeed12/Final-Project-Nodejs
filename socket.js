const { server } = require("./app");

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for a custom event from the client
  socket.on("pushNotification", (data) => {
    // Check if this is a new booking or an update
    if (data.type === "newBooking") {
      // Emit the notification to the admin
      socket.broadcast.emit("booking:create", data.booking);
    } else if (data.type === "updateStatus") {
      // Emit the notification to the user who owns the booking
      io.to(data.booking._userId).emit("booking:updateStatus", data.booking);
      
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

module.exports = { io };
