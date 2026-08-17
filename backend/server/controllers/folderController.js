import cloudinary from "../config/cloudinary.js";
import Folder from "../models/Folder.js";
import File from "../models/File.js";
export const createFolder = async(req,res)=>{
  try{
    const{name,parentFolder} = req.body;
    if(!name){
      return res.status(400).json({message: "Folder name is required"});
    }
    if(parentFolder){
      const parent = await Folder.findOne({_id:parentFolder, owner:req.userId});
      if(!parent){
        return res.status(400).json({message: "Parent folder not Found"});
      }
    }
    const newFolder = new Folder({
      name,
      owner: req.userId,
      parentFolder: parentFolder || null,
    });

    const savedFolder = await newFolder.save();
    res.status(201).json(savedFolder);
  }catch(err){
    console.error(err);
    res.status(500).json({message: "Server Error"});
  }
}

export const getFolders = async(req,res)=>{
  try{
    let folders;
    const{parentFolder} = req.query;
    if(parentFolder){
       folders = await Folder.find({parentFolder:parentFolder, owner:req.userId, isDeleted:false});
    }else{
       folders = await Folder.find({owner:req.userId, parentFolder:null, isDeleted:false});
    }

    
    res.status(200).json(folders);

  }catch(err){
    console.error(err);
    res.status(500).json({message: "Server Error"});
  }
}

export const getFolderById = async(req,res)=>{
  try{
    const folder = await Folder.findOne({_id:req.params.id, owner:req.userId, isDeleted:false});
    if(!folder){
      return res.status(404).json({message: "Folder not Found"});
    }
    return res.status(200).json(folder);
  }catch(err){
    console.error(err);
    res.status(500).json({message: "Server Error"}); 
  }
}

export const updateFolder = async(req,res)=>{
  try{
    const folder = await Folder.findOne({_id:req.params.id,owner:req.userId});
    if(!folder){
      return res.status(404).json({message: "Folder not Found"});
    }
    const {name,parentFolder} = req.body;
    if (!("name" in req.body) && !("parentFolder" in req.body)) {
      return res.status(400).json({ message: "Nothing to update" });
    }
    if(name){
      folder.name = name;
    }
    if("parentFolder" in req.body){
      if(parentFolder === null){
        folder.parentFolder = null;
      }else{
        const parent = await Folder.findOne({_id:parentFolder, owner:req.userId});
        if(!parent){
          return res.status(400).json({message: "Parent folder not Found"});
        }
        folder.parentFolder = parentFolder;
      }
    }
    
    const updatedFolder = await folder.save();
    res.status(200).json(updatedFolder);

  }catch(err){
    console.error(err);
    res.status(500).json({message: "Server Error"});
  }
}

export const deleteFolder = async(req,res)=>{
  try{
    const folder = await Folder.findOne({_id:req.params.id, owner:req.userId});
    if(!folder){
      return res.status(404).json({message: "Folder not Found"});
    }
    const childFolder = await Folder.findOne({parentFolder:folder._id, owner:req.userId, isDeleted:false});
    if(childFolder){
      return res.status(400).json({message: "Folder has child folders, cannot delete"});
    }
    folder.isDeleted = true;
    folder.deletedAt = new Date();
    await folder.save();
    res.status(200).json({message: "Folder deleted successfully"});
  }catch(err){
    console.error(err);
    res.status(500).json({message: "Server Error"});
  }
}

export const getTrashFolders=async(req,res)=>{
  try{
    const folders =await Folder.find({owner:req.userId,isDeleted:true}).sort({deletedAt:-1});
    res.status(200).json(folders);
  }catch(err){
    console.error(err);
    return res.status(500).json({message: "Error fetching trash folders", error: err.message});
  }
}

export const restoreFolder = async(req,res)=>{
  try{
    const folder =await Folder.findOne({_id:req.params.id,owner:req.userId,isDeleted:true});
    if(!folder){
      return res.status(404).json({message: "Folder not Found"});
    }
    folder.isDeleted = false;
    folder.deletedAt = null;
    await folder.save();
    return res.status(200).json({message: "Folder restored successfully", folder});
  }catch(err){
    console.error(err);
    return res.status(500).json({message: "Error restoring folder", error: err.message});
  }
}

export const permanentlyDeleteFolder = async(req,res)=>{
  try{
    const folder = await Folder.findOne({_id:req.params.id,owner:req.userId,isDeleted:true});
    if(!folder){
      return res.status(404).json({message: "Folder not Found"});
    }
    const files = await File.find({folder:folder._id, owner:req.userId});
    for(const file of files){
      const {publicId} = file;
      await cloudinary.uploader.destroy(publicId);
      await file.deleteOne();
    }
    const deletedFolder = await folder.deleteOne();
    return res.status(200).json({message: "Folder permanently deleted successfully", folder: deletedFolder});
  }catch(err){
    console.error(err);
    return res.status(500).json({message: "Error permanently deleting folder", error: err.message});
  }
    
}