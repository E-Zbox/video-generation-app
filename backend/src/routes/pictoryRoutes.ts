import { Router } from "express";
// controllers
import {
  createPictoryTokenController,
  pictoryWebhookController,
} from "@/controllers/pictoryController";

const pictoryRoutes = Router();

pictoryRoutes
  .post("/token/create", createPictoryTokenController)
  .post("/webhook", pictoryWebhookController);

export default pictoryRoutes;
