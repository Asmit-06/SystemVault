import File from "../models/File.js";
import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";
import Folder from "../models/Folder.js";
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const folderId = req.body.folderId;
    if(!folderId){
      return res.status(400).json({ message: "Folder ID is required" });
    }
    const folder = await Folder.findOne({_id:folderId,owner:req.userId});
    if(!folder){
      return res.status(400).json({message:"Folder not found"})
    }


    const bin = req.file.buffer;
    const cloudinaryResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "my_uploads",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      Readable.from(bin).pipe(uploadStream);
    });
    const newFile = await File.create({
      name: req.file.originalname,
      owner: req.userId,
      fileUrl: cloudinaryResponse.secure_url,
      fileType: req.file.mimetype,
      mimeType: req.file.mimetype,
      size: req.file.size,
      folder:folderId
    });

    return res
      .status(201)
      .json({ message: "File uploaded successfully", file: newFile });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error uploading file", error: err.message });
  }
};
