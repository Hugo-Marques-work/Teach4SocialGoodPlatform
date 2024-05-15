import authJwt from "../middleware/authJwt";
import express from 'express';
import verifySignUp from "../middleware/verifySignUp";
import * as controller from "../controllers/export.controller";

const route = express.Router();

route.get("/api/export/data/single/:groupName/:sessionIndex", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getSessionExcelData
)
export default route;
