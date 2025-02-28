import { Router } from "express";
// controllers
import {
  deleteMediaController,
  generateThumbnailsController,
  trimVideoController,
  uploadMediaController,
} from "@/controllers/mediaController";
// middlewares
import { uploadVideoBackgroundMedia } from "@/middlewares/uploadFiles";

const videoRoutes = Router();

videoRoutes
  .post("/generate-thumbnails", generateThumbnailsController)
  .post("/trim", trimVideoController)
  .post(
    "/upload",
    uploadVideoBackgroundMedia.array("media"),
    uploadMediaController
  )
  .delete("/delete/:mediaId", deleteMediaController);

export default videoRoutes;
