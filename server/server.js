import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
    })
);

app.use(express.json());
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
    res.send("Server is working");
});

import userRoutes from "./routes/userRoutes.js";
app.use("/api/users", userRoutes);

import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

import documentRoutes from "./routes/documentRoutes.js";
app.use("/api/documents", documentRoutes);

import verificationRoutes from "./routes/verificationRoutes.js";
app.use("/api/verify", verificationRoutes);

import recommendationRoutes from "./routes/recommendationRoutes.js";
app.use(
"/api/recommendations",
recommendationRoutes
);

import chatRoutes from "./routes/chatRoutes.js";
app.use("/api/chat", chatRoutes);

import taxProfileRoutes from "./routes/taxProfileRoutes.js";
app.use("/api/tax-profile", taxProfileRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});