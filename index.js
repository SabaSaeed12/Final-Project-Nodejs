const constants = require("./dependencies/constants");
const { server } = require("./app");
const port = constants.PORT || 8000;

server.listen(port, (req, res) => {
  console.log("server is running");
});
