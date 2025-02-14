import cors from "cors";
import express from "express";
import {
  createServer,
  Server as HTTPServer,
  IncomingMessage,
  ServerResponse,
} from "http";
import { connect } from "mongoose";
import { Server, Socket } from "socket.io";
// listeners
import jobListener from "./listeners.ts/jobListener";

const { MONGODB_URI } = process.env;

class Service {
  public app: express.Application;
  public httpServer: HTTPServer<typeof IncomingMessage, typeof ServerResponse>;
  public io: Server;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 200,
      },
    });

    this.connectDb();

    this.initializeApp();

    this.initializeIO();
  }

  async connectDb() {
    try {
      await connect(MONGODB_URI!, {
        dbName: "video-generation-app",
        retryReads: true,
      });

      console.log("Connected to db successfully!");
    } catch (error) {
      console.log(error);
    }
  }

  initializeApp() {
    this.app.use(
      cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 200,
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeIO() {
    this.io.on("connection", (socket: Socket) => {
      jobListener(io, socket);
    });
  }
}

const service = new Service();

export const app = service.app;

export const io = service.io;

export const server = service.httpServer;
