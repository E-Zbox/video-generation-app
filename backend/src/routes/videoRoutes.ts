import { Router } from "express";
// controllers
import {
  deleteVideoBackgroundController,
  videoBackgroundUploadController,
} from "@/controllers/videoController";
// middlewares
import { uploadVideoBackgroundMedia } from "@/middlewares/uploadFiles";

const videoRoutes = Router();

videoRoutes
  .post(
    "/upload",
    uploadVideoBackgroundMedia.single("media"),
    videoBackgroundUploadController
  )
  .delete("/delete/:mediaId", deleteVideoBackgroundController);

export default videoRoutes;
