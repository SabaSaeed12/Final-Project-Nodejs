const path = require("path");

const multer = require("multer");
const fs = require("fs");

/* MULTER FUNCTIONS */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    userId = req.generatedId;

    cb(null, "public/users/" + userId + "/");
  },
  filename: (req, file, cb) => {
    try {
      userId = req.generatedId;

      /* IF FILE ALREADY EXISTS, DELETE THE PREVIOUS FILE */
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const splitLength = file.originalname.split(".").length;
      const fileName =
        file.originalname
          .split(".")
          .splice(splitLength - 1, 1)
          .join("") +
        uniqueSuffix +
        path.extname(file.originalname);
      const fullFilePath = `./public/users/${userId}/${fileName}`;

      //console.log(fullFilePath);

      // console.log('file path 1 ', fullFilePath)
      /* IF FILE EXISTS, THEN DELETE THE FILE AND PASTE A NEW FILE THERE */

      if (fs.existsSync(fullFilePath)) {
        fs.unlinkSync(fullFilePath);
      }

      /*
              IF A FILE IN THE GIVEN DIRECTORY DOES NOT EXIST
              ,THEN CREATE A NEW FILE THERE OTHERWISE LEAVE AS IT IS
            */

      fs.mkdirSync("public/users/" + userId + "/", { recursive: true });

      cb(null, fileName);
    } catch (error) {
      console.log("error in user image upload", error);
    }
  },
});

const limits = {
  fileSize: 1024 * 1024, // 1MB
};

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/svg+xml"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "ERROR: You are trying to upload a file with unsupported file type. Only .csv files are supported."
      ),
      false
    );
  }
};

/* INITIALIZING MULTER */
const upload = multer({ storage, limits, fileFilter }).single("userProfile");

// For Handling Multer Errors/ Multer Error Handler
const uploadProfile = (req, res, next) => {
  upload(req, res, function (error) {
    if (!req.file) {
      return res.status(400).json({
        hasError: true,
        message: "ERROR: Data Validation Failed.",
        error: {
          userProfile: "Profile image is required",
        },
      });
    }
    if (error) {
     // console.log(error);
      // Check error is from Multer or not
      if (error instanceof multer.MulterError) {
        return res
          .status(400)
          .json({ status: "FAILED", description: "Multer: " + error.message });
      } else {
        // Default Internal Server Error
        return res.status(500).json({
          status: "INTERNAL_SERVER_ERROR",
          message: "SORRY: Something went wrong",
        });
      }
    }

    next();
  });
};

module.exports = uploadProfile;
