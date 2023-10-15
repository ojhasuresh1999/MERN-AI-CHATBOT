import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
config();

const app = express();
//! Middleware to parse the body of the request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//! Middleware to handle cookieapp.tsx
app.use(cookieParser(process.env.COOKIE_SECRET));

//TODO: Middleware to log the requests( remove in production)
app.use(morgan("dev"));
//! Routes for the application
app.use("/api/v1", appRouter);

export default app;
