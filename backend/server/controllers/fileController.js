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
    if (!folderId) {
      return res.status(400).json({ message: "Folder ID is required" });
    }
    const folder = await Folder.findOne({ _id: folderId, owner: req.userId });
    if (!folder) {
      return res.status(400).json({ message: "Folder not found" });
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
      folder: folderId,
      publicId: cloudinaryResponse.public_id,
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

export const getFiles = async (req, res) => {
  try {
    const { folderId } = req.query;
    if (!folderId) {
      return res.status(400).json({ message: "Folder ID is required" });
    }
    const folder = await Folder.findOne({ _id: folderId, owner: req.userId });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    const files = await File.find({ owner: req.userId, folder: folderId });
    return res.status(200).json({ files });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error fetching files", error: err.message });
  }
};

export const getFileById = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.userId });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    return res.status(200).json({ file });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error fetching file", error: err.message });
  }
};

export const updateFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.userId });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    const { name } = req.body;
    if (!("name" in req.body) || !name.trim()) {
      return res.status(400).json({ message: "File name is required" });
    }
    if (name) {
      file.name = name.trim();
    }
    const updatedFile = await file.save();
    return res
      .status(200)
      .json({ message: "File updated successfully", file: updatedFile });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error updating file", error: err.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.userId });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const { publicId } = file;
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
    await file.deleteOne();
    return res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error deleting file", error: err.message });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    const response = await fetch(file.fileUrl);
    console.log("Cloudinary URL:", file.fileUrl);
    console.log("Cloudinary status:", response.status);
    console.log("Cloudinary status text:", response.statusText);
    if (!response.ok) {
      throw new Error("Failed to fetch file from Cloudinary");
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.setHeader("Content-Type", file.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);

    return res.status(200).send(buffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error downloading file",
      error: err.message,
    });
  }
};
