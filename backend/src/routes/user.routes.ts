import authJwt from "../middleware/authJwt";
import express from 'express';
import verifySignUp from "../middleware/verifySignUp";
import * as controller from "../controllers/user.controller";

const route = express.Router();

route.get("/api/user/check/token",
  [authJwt.verifyToken],
  controller.checkToken
);
route.get("/api/user/all", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getAllUsers
)
route.get("/api/user/single/:user", 
  [authJwt.verifyToken],
  controller.getUser
);
route.get("/api/user/detail/single/:user", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getUserDetail
);

route.post("/api/user/create", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.createUser
);
route.delete("/api/user/single/:user", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.deleteUser
);
route.put("/api/user/update", 
  [authJwt.verifyToken, authJwt.isModerator],
  controller.updateUser
);
route.get("/api/user/single/status/delete/:user",
  [authJwt.verifyToken, authJwt.isModerator],
  controller.getDeleteStatusUser
);

route.get('/api/user/session/state/:user',
  [authJwt.verifyToken],
  controller.getSessionState
);

route.get('/api/user/session/full/state/:user',
  [authJwt.verifyToken],
  controller.getFullSessionState
);

route.put('/api/user/session/state',
  [authJwt.verifyToken],
  controller.setSessionState
);

route.get('/api/user/session/forum/all/:user',
  controller.getForum
);

route.get('/api/user/session/forumHistory/all/:user/:linkedStep',
  controller.getForumHistory
);

route.post('/api/user/session/forum/create',
  controller.createMessage
);

route.get("/api/user/roles/all",
  controller.getAllRoles
);
route.get("/api/user/result/individual/quiz/:user/:linkedStep",
  controller.getAnsweredIndividualQuiz
);
route.post("/api/user/result/resource/click",
  controller.registerUserResourceClick
)
route.post("/api/user/result/forum/messages",
  controller.registerForumMessages
)
route.post("/api/user/result/step",
  controller.submitStep
);
route.get("/api/user/time/left/:user",
  [authJwt.verifyToken],
  controller.getTimeLeft
);

export default route;