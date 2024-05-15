
import { Request, Response } from "express-serve-static-core";
import authJwt from "../middleware/authJwt";
import express from 'express';
import { moduleControlRoutes } from "../controllers/module.controller";
const route = express.Router();

//Automatic routes for each moduleControlRoute
moduleControlRoutes.forEach((moduleRoute) => {
  
  //Session routes for modules
  route.get(`/api/session/${moduleRoute.route}/:packName/:sessionIndex/:stepIndex`, 
    [authJwt.verifyToken],
    async (req: Request, res: Response) => {
      return await moduleRoute.control.getModule(req, res);
    }
  );
  route.put(`/api/session/${moduleRoute.route}`, 
    [authJwt.verifyToken, authJwt.isModerator],
    async (req: Request, res: Response) => {
      return await moduleRoute.control.putModule(req, res);
    }
  );
  
  //Pack routes for modules
  route.get(`/api/pack/single/template/${moduleRoute.route}/:packName/:templateName`, 
    [authJwt.verifyToken],
    async (req: Request, res: Response) => {
      return await moduleRoute.control.getTemplateModule(req, res);
    }
  );
  route.put(`/api/pack/single/template/${moduleRoute.route}`, 
    [authJwt.verifyToken, authJwt.isModerator],
    async (req: Request, res: Response) => {
      return await moduleRoute.control.putTemplateModule(req, res);
    }
  );
});


export default route;