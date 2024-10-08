import express from "express";
import { productsSocket } from './middlewares/productsSocket.js';
import { Server as ServerIO } from "socket.io";
import { Server as serverHttp } from "http";
import passport from "passport";
import cookieParser from "cookie-parser";
import { initializePassport } from "./config/passport.config.js";
import { handlebarsConfig, objectConfig } from "./config/config.js";
import routerApp from './routes/routes.js';
import dotenv from 'dotenv';
import __dirname from "./utils/filenameUtils.js";
import { chatSocketIO } from "./utils/chatSocketIO.js";
import { realTimeProducts } from "./utils/realTimeProductsSocketIO.js";
import { handleErrors } from "./middlewares/errors/errors.middleware.js";
import { addLogger, logger } from "./utils/logger.js";
import { connectMongoDb } from "./config/mongoDB.config.js";
import { inactiveUserChildProcess } from "./utils/inactiveUsersChildProcess.js";
import { startServer } from "./config/startServer.js";
import './utils/globalErrorHandlers.js';


dotenv.config();
const app = express();
const httpServer = new serverHttp(app);
const io = new ServerIO(httpServer);
const { port } = objectConfig;
connectMongoDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(productsSocket(io));
app.use(addLogger);

initializePassport();
app.use(passport.initialize());

app.engine('.hbs', handlebarsConfig.engine);
app.set("views", `${__dirname}/views`);
app.set("view engine", ".handlebars");

app.use(routerApp);
app.use(handleErrors);

startServer(httpServer, port);

// borrado de usuarios inactivos
inactiveUserChildProcess();

realTimeProducts(io);
chatSocketIO(io);