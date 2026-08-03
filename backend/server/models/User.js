import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
    unique: true,
  },
  password:{
    type: String,
    required: true,
  },
  usedStorage:{
    type: Number,
    default: 0,
  },
  storageLimit:{
    type: Number,
    default: 1073741824, // 1 GB in bytes
  },
  date:{
    type: Date,
    default: Date.now,
  }
},{timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;