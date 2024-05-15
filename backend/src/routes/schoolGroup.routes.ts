import authJwt from "../middleware/authJwt";
import express from 'express';
import verifySignUp from "../middleware/verifySignUp";
import * as controller from "../controllers/schoolGroup.controller";

const route = express.Router();

route.get("/api/schoolGroup/single/:schoolGroupName", 
  [authJwt.verifyToken],
  controller.getSchoolGroup
);
route.post("/api/schoolGroup/create", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.postSchoolGroup
);
route.get("/api/schoolGroup/status/delete/:schoolGroupName",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getDeleteStatusSchoolGroup
);
route.delete("/api/schoolGroup/single/:schoolGroupName", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.deleteSchoolGroup
);
route.get("/api/schoolGroup/detail/all", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getAllDetailedSchoolGroups
);
route.get("/api/schoolGroup/all", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getAllSchoolGroups
);
route.get("/api/schoolGroup/users/:schoolGroupName",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getAllUsersInSchool
);

export default route;