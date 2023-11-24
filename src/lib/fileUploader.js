const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "temps/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const multerHelper = multer({ storage: storage });
