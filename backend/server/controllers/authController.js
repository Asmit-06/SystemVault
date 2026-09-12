import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { generateAccessToken, generateRefreshToken } from "../config/generateToken.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: passwordHash,
      usedStorage: 0,
      storageLimit: 1073741824, // 1 GB
    });

    const savedUser = await newUser.save();
    const accessToken = generateAccessToken(savedUser._id);
    const refreshToken = generateRefreshToken(savedUser._id);

    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      avatar: savedUser.avatar,
      usedStorage: savedUser.usedStorage,
      storageLimit: savedUser.storageLimit,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (!userExists) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!userExists.password) {
      return res.status(400).json({
        message: "This account was registered with Google. Please use Google Sign-In."
      });
    }

    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(userExists._id);
    const refreshToken = generateRefreshToken(userExists._id);

    return res.status(200).json({
      _id: userExists._id,
      name: userExists.name,
      email: userExists.email,
      avatar: userExists.avatar,
      usedStorage: userExists.usedStorage,
      storageLimit: userExists.storageLimit,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { credential, token, access_token } = req.body;
    const rawToken = credential || token || access_token;

    if (!rawToken) {
      return res.status(400).json({ message: "Google credential/token is required" });
    }

    let payload = null;

    // 1. Try Google userinfo API (Works with OAuth2 access_token)
    try {
      const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${rawToken}` },
      });
      if (userinfoRes.ok) {
        payload = await userinfoRes.json();
      }
    } catch (e) {
      // Ignore and proceed to ID token verification
    }

    // 2. Try Google OAuth client ID token verification (Works with OpenID Connect credential JWT)
    if (!payload && process.env.GOOGLE_CLIENT_ID) {
      try {
        const ticket = await client.verifyIdToken({
          idToken: rawToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
      } catch (e) {
        // Ignore and try tokeninfo fallback
      }
    }

    // 3. Try Google tokeninfo endpoint (Works with ID token)
    if (!payload) {
      try {
        const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${rawToken}`);
        if (googleRes.ok) {
          payload = await googleRes.json();
        }
      } catch (fetchErr) {
        console.error("Google tokeninfo error:", fetchErr);
      }
    }

    // 4. Fallback for custom decoded JWT payload
    if (!payload) {
      const decoded = jwt.decode(rawToken);
      if (decoded && decoded.email) {
        payload = decoded;
      }
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Failed to verify Google token. Please try again." });
    }

    const normalizedEmail = payload.email.toLowerCase().trim();
    const googleId = payload.sub || payload.id;
    const name = payload.name || payload.given_name || normalizedEmail.split("@")[0];
    const avatar = payload.picture || null;

    let user = await User.findOne({
      $or: [{ email: normalizedEmail }, { googleId }],
    });

    if (user) {
      let updated = false;
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (!user.avatar && avatar) {
        user.avatar = avatar;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      user = new User({
        name,
        email: normalizedEmail,
        googleId,
        avatar,
        usedStorage: 0,
        storageLimit: 1073741824, // 1 GB
      });
      await user.save();
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      usedStorage: user.usedStorage,
      storageLimit: user.storageLimit,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Google Auth error:", err);
    res.status(500).json({ message: "Google authentication failed" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const forgotPassword = async(req,res)=>{
  try{
    const{email} = req.body;
    if(!email){
      return res.status(400).json({message:"Email is required"});
    }

    const user = await User.findOne({email:email.toLowerCase().trim()});
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
     user.resetPasswordToken = hashedToken;
     user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
     await user.save();

     const clientUrl  =  process.env.CLIENT_URL || "http://localhost:5173";
     const resetUrl = `${clientUrl}/reset-password/${rawToken}`;

     const message = `You requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

     await sendEmail(user.email,"Password Reset Request",message,`<p>${message}</p>`);
     res.status(200).json({message:"Password reset email sent"});
  }catch(err){
    console.error("Forgot Password error:", err);
    res.status(500).json({message:"Server Error"});
  }
}

export const resetPassword = async(req,res)=>{
  try{
    const{token} = req.params;
    const{newPassword} = req.body;
    if(!newPassword || newPassword.length < 6){
      return res.status(400).json({message:"New password must be at least 6 characters"});
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {$gt: Date.now()}
    })

    if(!user){
      return res.status(400).json({message:"Invalid or expired token"});
    }
    const passwordHash = await bcrypt.hash(newPassword,10);
    user.password = passwordHash;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.status(200).json({message:"Password reset successful You can now log in with your new password"});
  }catch(err){
    console.error("Reset Password error:", err);
    res.status(500).json({message:"Server Error"});
  }
}