import { Role } from "../models/role.model";
import { User } from "../models/user.model";
import { RequestHandler } from "express-serve-static-core";

const checkDuplicateUsernameOrEmail: RequestHandler = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
  });
};

const checkRole: RequestHandler = (req, res, next) => {
  if (req.body.role) {
    Role.findOne({
      where: {
        name: req.body.role
      }
    }).then((role) => {
      if(!role) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.role
        });
        return;
      }
      next();
    })
  }
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRole: checkRole
};

export default verifySignUp;
