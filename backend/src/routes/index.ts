import express from 'express';
import { NextFunction, Request, Response } from "express-serve-static-core";
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import sessionRoutes from './session.routes';
import schoolGroupRoutes from './schoolGroup.routes'
import resourceRoutes from './resource.route'
import exportRoutes from './export.routes';
import packRoutes from './pack.routes';
import moduleRoutes from "./module.route";

export const routes = express.Router();

routes.use((req: Request, res: Response, next: NextFunction) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  res.header('Access-Control-Expose-Headers', 'Content-Disposition')
  res.header('Access-Control-Allow-Headers', 'Content-Disposition');
  next();
})

routes.use(authRoutes);
routes.use(userRoutes);
routes.use(sessionRoutes);
routes.use(schoolGroupRoutes);
routes.use(resourceRoutes);
routes.use(exportRoutes);
routes.use(packRoutes);
routes.use(moduleRoutes);

export default routes;