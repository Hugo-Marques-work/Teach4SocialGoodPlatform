import authJwt from "../middleware/authJwt";
import express from 'express';
import * as controller from "../controllers/session.controller";

const route = express.Router();

route.get("/api/session/group/all", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getAllSessionGroups
)
route.get("/api/session/group/active/all", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getAllActiveSessionGroups
)
route.get("/api/session/group/single/:groupName/:sessionIndex/:repeated",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getSessionGroup
)
route.post("/api/session/group/create", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.createSessionGroup
)
route.post("/api/session/group/start", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.startSessionGroup
);
route.post("/api/session/group/phase/next", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.startNextPhase
);
route.post("/api/session/group/finish", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.finishSessionGroup
);
route.get("/api/session/all/:packName", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getAllSessions
);
route.get("/api/session/trainingPack/available/all",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getAllAvailableTrainingPrograms
)
route.get("/api/session/pack/resource/:packName/:sessionIndex",
  [authJwt.verifyToken], //, authJwt.isModerator], 
  controller.getPackSessionResources
);
route.put("/api/session/resource", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.putSessionResources
);
route.post("/api/session/resource/new", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.createSessionResource
);
route.delete("/api/session/resource/single/:packName/:sessionIndex/:resourceIndex", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.deleteSessionResource
);

route.put("/api/session/resource/single", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.changeOneResource
);
route.post("/api/session/resource/swap", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.swapOrderSessionResource
);
route.get("/api/session/global/forumGroup/all", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getAllGlobalForumGroups
)
route.post("/api/session/global/full/forumGroups",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.setFullGlobalForumGroups
);
route.get("/api/session/school/group/all", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getAllSchoolSessionGroups
);
route.get("/api/session/school/group/single/:groupName",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getSchoolSessionGroup
);
route.post("/api/session/school/group/create", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.createSchoolSessionGroup
);
route.get("/api/session/school/group/status/delete/:groupName",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getDeleteStatusSchoolSessionGroup
);
route.delete("/api/session/school/group/single/:groupName",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.deleteFullSchoolSessionGroup
);
route.put('/api/session/restriction/',
  controller.putTrainingRestriction
);
route.post("/api/session/download/resource/:packName/:sessionIndex/:sessionResourceIndex", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.postSessionResourceFile
);

export default route;
