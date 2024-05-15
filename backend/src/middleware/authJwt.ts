
import jwt from "jsonwebtoken";
import config from "../config/auth.config";
import { User } from "../models/user.model";
import { RequestHandler } from "express-serve-static-core";

const verifyToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, config.secret, (err: any, user: any) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.body.userId = user.id;

    next()
  })
};
const isAdmin: RequestHandler = (req, res, next) => {
  User.findByPk(req.body.userId).then(user => {
    if(!user) {
      res.send(500)
      return;
    }
    user.$get('role').then(role => {
      if (role?.name === "admin") {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
    });
  });
};

const isModerator: RequestHandler = (req, res, next) => {
  User.findByPk(req.body.userId).then(user => {
    if(!user) {
      res.send(500)
      return;
    }
    user.$get('role').then(role => {
      if (role?.name === "moderator") {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Moderator Role!"
      });
    });
  });
};

const isModeratorOrAdmin: RequestHandler = (req, res, next) => {
  User.findByPk(req.body.userId).then(user => {
    if(!user) {
      res.send(500)
      return;
    }
    user.$get('role').then(role => {
      if (role?.name === "moderator" || role?.name == "admin") {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Moderator or Admin Role!"
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin
};
export default authJwt;
