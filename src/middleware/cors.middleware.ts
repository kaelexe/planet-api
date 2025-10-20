import cors from "cors";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

dotenv.config();

const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || ["*"];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS policy violation: Origin ${origin} is not allowed`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: process.env.CORS_CREDENTIALS === "true",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};

export default cors(corsOptions);
