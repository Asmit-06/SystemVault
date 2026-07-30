import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

import mongoose from "mongoose"
const ConnectDB = async()=>{
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongo db connected")

  }catch(err){
    console.error(err);
    process.exit(1);
  }
}

export default ConnectDB;