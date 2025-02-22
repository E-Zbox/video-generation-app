import { Router } from "express";
// controllers
import {
  expandTextController,
  generateDownloadableVideoController,
  generateVideoController,
  monitorVideoStatusController,
} from "@/controllers/userController";
// middleware
import { verifyAccessToken } from "@/middlewares/pictoryToken";

const userRoutes = Router();

userRoutes
  .post("/expand/text", expandTextController)
  .post("/video/generate", [verifyAccessToken], generateVideoController)
  .get(
    "/video/monitor/:jobId",
    [verifyAccessToken],
    monitorVideoStatusController
  )
  .post(
    "/video/download",
    [verifyAccessToken],
    generateDownloadableVideoController
  );

export default userRoutes;
