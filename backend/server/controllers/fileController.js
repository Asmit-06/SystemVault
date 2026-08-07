import File from "../models/File.js";
import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
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
