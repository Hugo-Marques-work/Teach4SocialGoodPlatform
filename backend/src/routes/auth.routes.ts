import express from 'express';
import verifySignUp from "../middleware/verifySignUp";
import * as controller from "../controllers/auth.controller";

const route = express.Router();

route.post(
  "/api/auth/signup",
  [
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRole
  ],
  controller.signup
);

route.post("/api/auth/signin", controller.signin);

export default route;