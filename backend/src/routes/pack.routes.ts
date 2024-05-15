import authJwt from "../middleware/authJwt";
import express from 'express';
import verifySignUp from "../middleware/verifySignUp";
import * as controller from "../controllers/pack.controller";

const route = express.Router();

route.get("/api/pack/all", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getAllPacks
)
route.get("/api/pack/single/pack/:name",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getTrainingPack
)
route.get("/api/pack/session/step/:packName/:sessionIndex/:stepIndex",
  [authJwt.verifyToken],
  controller.getStepModules
)
route.get("/api/pack/template/:packName/",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getTemplateModules
)
route.post("/api/pack/add", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.addPack
);
route.post("/api/pack/single/session/add", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.addSession
);
route.post("/api/pack/single/session/edit/time", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.editSessionTime
);
route.post("/api/pack/single/session/step/add", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.addStep
);
route.post("/api/pack/single/session/step/edit", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.editStep
);
route.post("/api/pack/single/session/step/edit/time", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.editStepTime
);
route.get("/api/pack/single/pack/status/delete/:packName",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getDeleteStatusFullPack
);
route.get("/api/pack/session/status/delete/:packName/:sessionIndex",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getDeleteStatusPackSession
);
route.delete("/api/pack/single/pack/:packName",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.deleteFullPack
);
route.delete("/api/pack/session/single/:packName/:sessionIndex",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.deleteSession
);
route.delete("/api/pack/session/step/single/:packName/:sessionIndex/:stepIndex",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.deleteStep
);
route.delete("/api/pack/session/step/module/single/:packName/:sessionIndex/:stepIndex/:moduleIndex",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.deleteModule
);
route.post("/api/pack/template/new", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.createTemplateModule
);
route.delete("/api/pack/template/single/:packName/:templateName", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.deleteTemplateModule
);
route.post("/api/pack/single/session/swap", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.swapOrderSession
);

route.post("/api/pack/single/session/step/swap", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.swapOrderStep
);

route.post("/api/pack/single/session/step/modules/swap", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.swapOrderModule
);

route.post("/api/pack/template/use",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.addModuleFromTemplate
);

export default route;
