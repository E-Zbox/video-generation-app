import { Router } from "express";
// controllers
import { isAliveController } from "@/controllers";

export const baseAPIURL = "/api";

export const indexRoutes = Router();

indexRoutes
  .get("/health", isAliveController)
  .get(`${baseAPIURL}/health`, isAliveController);
