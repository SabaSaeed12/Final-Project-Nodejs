//bcrypt generating for admin
const bcrypt = require("bcrypt");
const password = "9090n";
const salt = bcrypt.genSaltSync(10);
const hashPassword = bcrypt.hashSync(password, salt);

console.log("hashedPassword:", hashPassword);
