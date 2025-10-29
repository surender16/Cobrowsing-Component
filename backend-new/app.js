// app.js
import dotenv from "dotenv";

// Load environment variables FIRST before any other imports
dotenv.config();

import express from "express";
import cors from "cors";
import OpenTok from "opentok";
import path from "path";
import { Router } from "express";
const router = Router();

import createTokenRoutes from "./routes/tokenRoutes.js";
import createCallRequestRoutes from "./routes/callRequestRoutes.js";
import callbackRoutes from "./routes/callbackRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";

const app = express();
const apiKey = process.env.OPENTOK_API_KEY;
const apiSecret = process.env.OPENTOK_API_SECRET;
const opentok = new OpenTok(apiKey, apiSecret);

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.8.55:5173",
      "https://192.168.8.66:5173",
      "https://192.168.8.96:5173",
      "https://192.168.8.96:3000",
      "https://192.168.29.107:5173",
      "https://192.168.8.96:3040",
      "https://192.168.8.96",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api", createTokenRoutes(opentok, apiKey));
app.use("/api", createCallRequestRoutes(opentok, apiKey));
app.use("/api", callbackRoutes);
app.use("/api", uploadRoutes);
app.use("/api/opentok", conversationRoutes);

router.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;
