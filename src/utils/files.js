const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${folder}`);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format non supporté"));
  }
};

const upload = (folder) =>
  multer({
    storage: storage(folder),
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 },
  });

const deleteFile = (filePath) => {
  fs.stat(filePath, (error) => {
    if (error) {
      console.log("File not found");
    } else {
      fs.unlink(filePath, (error) => {
        if (error) {
          console.log("Error deleting file");
        }
      });
    }
  });
};

module.exports = { upload, deleteFile };