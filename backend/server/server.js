import express from "express";
import cors from "cors";
import ConnectDB from "./config/db.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use("/api/auth",authRoutes);


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