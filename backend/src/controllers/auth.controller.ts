import { Request, Response } from "express-serve-static-core";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { Op } from "sequelize";
import config from "../config/auth.config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { UserDto } from "../models/dto/userDto.model"

export function signup(req: Request, res: Response) {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
  .then(user => {
    if (req.body.role) {
      Role.findOne({
        where: {
          name: {
            [Op.or]: req.body.role
          }
        }
      }).then(role => {
        user.$set('role', role).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      });
    } else {
      user.$set('role', 1).then(() => {
        res.send({ message: "User was registered successfully!" });
      });
    }
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
}

//Signs in and gives the user a 24 hour jwt token
export function signin(req: Request, res: Response) {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        res.status(404).send({ message: "User Not found." });
        return;
      }
      
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      let userDto = new UserDto();
      userDto.setup(user).then(() => {
        res.status(200).send({
          user: userDto,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}