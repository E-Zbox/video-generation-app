import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
// config
import cloudinary from "@/config/cloudinary";
// utils/errors
import { FileUploadError } from "@/utils/errors";

const acceptedImageMimeTypes = [
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/3gpp",
  "video/mp4",
];

const maxFileSize = 15 * 1024 * 1024;

export const rootUploadDir = "video-generation-app";

export const uploadVideoBackgroundMedia = multer({
  fileFilter: (req, file, cb) => {
    if (!acceptedImageMimeTypes.includes(file.mimetype)) {
      return cb(
        new FileUploadError(
          `File Upload only supports the following file types ${JSON.stringify(
            acceptedImageMimeTypes
          )}`
        )
      );
    }

    cb(null, true);
  },
  limits: {
    fileSize: maxFileSize,
  },
  storage: new CloudinaryStorage({
    cloudinary,
    params: (req, file) => {
      return {
        folder: `${rootUploadDir}/video/background`,
        public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
        resource_type: "auto",
      };
    },
  }),
});
