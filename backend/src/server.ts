import { Request, Response, NextFunction, RequestHandler } from "express";

import express from 'express';
import serveIndex from 'serve-index';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import fs from 'fs';
import https from 'https';

// .ENV typescript Setup
import 'dotenv/config';
if(process.env.USING_ENV == undefined) {
  console.log(".env not detected, please make sure to change example.env into \
a .env file with the variable 'USING_ENV'");
}
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(fileUpload());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Time: ', Date.now());
  console.log("My request is " + req.url);
  try {
    next();
  }
  catch(error){
    let message;
    if (error instanceof Error) message = error.message
    else message = String(error)
    // we'll proceed, but let's report it
    reportError({message})
  }
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

app.use('/request-type', (req: Request, res: Response, next: NextFunction) => {
  console.log('Request type: ', req.method);
  next();
});

app.use('/public', express.static('public'));
app.use('/public', serveIndex('public'));

import routes from './routes/index';

app.use('/', routes);
console.log("routes loaded");

import sequelize from './models/index';
let debug = false;

sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
.then(function(){
  //return sequelize.sync({alter: true, force: true }); 
  return sequelize.sync({alter: true}); //USE IF YOU CHANGE THE STRUCTURE OF ANY DB STUFF
  //return sequelize.sync(); //NORMAL USE
})
.then(function(){
    return sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
})
.then(function(){
    console.log('db syncd.');
    if(process.env.USE_KEYS=='0') {
      app.listen(3000, () => console.log('App is listening on port 3000.'));
    }
    else {
      //Insert your key and certificate path
      const options = {
        key: fs.readFileSync(`keys/privkey.pem`),
        cert: fs.readFileSync(`keys/fullchain.pem`)
      };
      https.createServer(options, app).listen(3000);
    }
}, function(err: Error){
    console.log(err);
});