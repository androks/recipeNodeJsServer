import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {Controller} from "./Controller";
import mongoose from "mongoose";
import {MONGO_URL} from "./constants/Constants";

class App {
  public app: Application;

  public controller: Controller;

  constructor() {
    this.app = express();
    this.setConfig();
    this.setMongoConfig();

    this.controller = new Controller(this.app);
  }

  private setConfig() {
    //Allows us to receive requests with data in json format
    this.app.use(bodyParser.json({ limit: '50mb' }));

    //Allows us to receive requests with data in x-www-form-urlencoded format
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended:true}));

    //Enables cors   
    this.app.use(cors());
  }

  private setMongoConfig() {
    mongoose.Promise = global.Promise;
    mongoose.connect(MONGO_URL, {
      useNewUrlParser: true
    });
  }
}
export default new App().app;