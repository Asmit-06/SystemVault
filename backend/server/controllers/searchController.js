
import File from "../models/File.js";
import Folder from "../models/Folder.js";
export const search = async (req, res) => {
  try {
    
    const{q} = req.query;
    if(!q)return res.status(400).json({message:"Search query is required"});
    const folders = await Folder.find({owner:req.userId,name:{$regex:q,$options:"i"}});
    const files = await File.find({owner:req.userId,name:{$regex:q,$options:"i"}});

    return res.status(200).json({folders:folders,files:files});
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error searching",
      error: err.message
    });
  }
};