import authJwt from "../middleware/authJwt";
import express from 'express';
import * as controller from "../controllers/resource.controller";

const route = express.Router();

route.get("/api/resource/general/all", 
    controller.getAllGenericResources
);
route.get("/api/resource/pack/all/:packName", 
    controller.getPackGenericResources
);

route.get("/api/resource/download/:resourceId/:resourceIndex",
    controller.getResourceDownload
);

route.get("/api/resource/session/all/:user", 
    controller.getUserSessionResource
);

route.get("/api/resource/session/download/:packName/:sessionIndex/:sessionResourceIndex",
    controller.getSessionResourceDownload
);

route.post("/api/resource/pack/new", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.createGeneralResource
);
route.delete("/api/resource/pack/single/:packName/:resourceIndex", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.deleteGeneralResource
);
route.put("/api/resource/pack/single", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.changeOneGeneralResource
);
route.post("/api/resource/pack/swap", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.swapOrderGeneralResource
);
route.post("/api/resource/content/pack/new", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.createGeneralResourceContent
);
route.delete("/api/resource/content/pack/single/:packName/:resourceIndex/:contentIndex", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.deleteGeneralResourceContent
);
route.put("/api/resource/content/pack/single", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.changeOneGeneralResourceContent
);
route.post("/api/resource/content/pack/swap", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.swapOrderGeneralResourceContent
);
route.post("/api/general/resource/pack/download/:packName/:generalResourceIndex/:contentIndex", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.postGeneralResourceFile
);
route.get("/api/resource/pack/download/:packName/:generalResourceIndex/:contentIndex",
    controller.getGeneralResourceDownload
);


export default route;