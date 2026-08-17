import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  parentFolder:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null,
  },
  date:{
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  deletedAt: {
    type: Date,
    default: null
  }
},{timestamps: true});

const Folder = mongoose.model("Folder", folderSchema);
export default Folder;