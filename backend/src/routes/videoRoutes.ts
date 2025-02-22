import { Router } from "express";
// controllers
import {
  deleteMediaController,
  uploadMediaController,
} from "@/controllers/mediaController";
// middlewares
import { uploadVideoBackgroundMedia } from "@/middlewares/uploadFiles";

const videoRoutes = Router();

videoRoutes
  .post(
    "/upload",
    uploadVideoBackgroundMedia.single("media"),
    uploadMediaController
  )
  .delete("/delete/:mediaId", deleteMediaController);

export default videoRoutes;
