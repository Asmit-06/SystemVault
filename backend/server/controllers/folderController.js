import Folder from "../models/Folder.js";

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