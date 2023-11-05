import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config();

const app = express();

//! CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

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
