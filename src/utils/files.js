const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadPath = path.join(__dirname, `../../uploads/${folder}`);
      if (file.fieldname) {
        uploadPath = path.join(uploadPath, file.fieldname);
      }
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const name = file.originalname.split(" ").join("_");
      cb(null, `${Date.now()}-${name}`);
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

const getUrl = (req, folder, file) => {
  return `${req.protocol}://${req.get("host")}/app/uploads/${folder}/${path.basename(file)}`;
};

module.exports = { upload, deleteFile, getUrl };
