import { Router } from "express";
// controllers
import {
  expandTextController,
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
  );

export default userRoutes;
