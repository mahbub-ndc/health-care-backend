import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: "dlb8lrlb7",
  api_key: "137116662743142",
  api_secret: "wr6KDYpbKgCiRKadh_F7AVWsAAs",
});

const uploadToCloudinary = async (file: any) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      { resource_type: "auto" },
      (error, result) => {
        // Clean up the local file after upload
        fs.unlinkSync(file.path);
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          console.log("Cloudinary upload result:", result);
          resolve(result);
        }
      }
    );
  });
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
