import express from "express";
import cors from "cors";
import ConnectDB from "./config/db.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/folder",folderRoutes);
app.use("/api/file",fileRoutes);
app.use("/api/search",searchRoutes);
const PORT = process.env.PORT || 3000;
const start = async()=>{
  try{
    await ConnectDB();
    app.listen(PORT,()=>{
      console.log(`Server is running on port ${PORT}`);
    })

  }catch(err){
    console.error("Error starting server:", err);
    process.exit(1);
  }
}
start()