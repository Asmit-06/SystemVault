import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }, 
  folder:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null
  },
  fileUrl:{
    type: String,
    required: true
  },
  fileType:{
    type: String,
    required: true
  },
  mimeType:{
    type: String,
    required: true
  },
  size:{
    type: Number,
    required: true
  },
  publicId:{
    type: String,
    required: true
  }
},{ timestamps: true})

const File = mongoose.model("File", fileSchema);
export default File;
// name
// owner
// folder
// fileUrl
// fileType
// mimeType
// size
// date