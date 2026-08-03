import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {generateAccessToken, generateRefreshToken} from "../config/generateToken.js";
export const register = async(req,res)=>{
  try{
    const{name,email,password} = req.body;
    if(!name || !email || !password){
      return res.status(400).json({message: "Please fill all the fields"});
    }
    if(password.length < 6){
      return res.status(400).json({message: "Password must be at least 6 characters"});
    }
    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({email:normalizedEmail});
    const userName = await User.findOne({name});
    if(userExists){
      return res.status(400).json({message: "User already exists"});
    }
    if(userName){
      return res.status(400).json({message: "Username already exists"});
    }

    const passwordHash = await bcrypt.hash(password,10);
    const newUser = new User({
      name,
      email: normalizedEmail,
      password: passwordHash
    })

    const savedUser = await newUser.save();
    const accessToken = generateAccessToken(savedUser._id);
    const refreshToken = generateRefreshToken(savedUser._id);

    res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      accessToken,
      refreshToken,
    });
  }catch(err){
    console.error(err);
    res.status(500).json({message: "Server Error"});
  }
  
  
}


export const login = async(req,res)=>{
  try{
    const{email,password} = req.body;
    if(!email || !password){
      return res.status(400).json({message: "Please fill all the fields"});
    }
    if(password.length < 6){
      return res.status(400).json({message: "Password must be at least 6 characters"});
    }
  
    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({email: normalizedEmail});
    if(!userExists){
      return res.status(400).json({message: "User does not exist"});
    }
  
    const isMatch = await bcrypt.compare(password,userExists.password);
    if(!isMatch){
      return res.status(400).json({message: "Invalid credentials"});
    }
  
    const accessToken = generateAccessToken(userExists._id);
    const refreshToken = generateRefreshToken(userExists._id);
    return res.status(200).json({
      _id: userExists._id,
      username: userExists.username,
      email: userExists.email,
      accessToken,
      refreshToken,
    });
  }catch(err){
    console.error(err);
    res.status(500).json({message: "Server Error"});
  }
 
}

export const getMe = async(req,res)=>{
  try{
    const user = await User.findById(req.userId).select("-password");
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    res.status(200).json(user);
  }catch(err){
    console.error(err);
    res.status(500).json({message: "Server Error"});
  }
}