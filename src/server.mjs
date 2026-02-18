import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import dotenv from "dotenv";

import { cloudConnect } from "./db/cloudConnect.mjs";
import stuRouter from "./links/routes/studentRouter.mjs";
import sRouter from "./links/routes/schoolRouter.mjs";
import { errorHandler } from "./utils/errorHandler.mjs";

dotenv.config();

const server = express();
server.use(express.json());
server.use(cookieParser());
server.use(session({
    secret:process.env.JWT_SECRET || "secret",
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:7 * 24 * 60 * 1000
    }
}));
server.use(passport.initialize());
server.use(passport.session());

server.use("/school",sRouter);
server.use("/student",stuRouter);

server.use(errorHandler);


const PORT = process.env.PORT || 3000;

export const start = async () => {
    try {
        await cloudConnect(process.env.MONGO_URI);

        console.log(`MongoDB connected to ${mongoose.connection.name}`);
        server.listen(PORT,console.log(`Server runnig on ${PORT}`));
    }
    catch(err){
        console.error("Server start failed",err.message);
    }
}
start();