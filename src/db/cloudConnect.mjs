import mongoose from "mongoose";

export const cloudConnect = async(url) =>{
    try{
        await mongoose.connect(url);


    }catch(err){
         console.error("Something went wrong",err.message);
        throw err;
    }
}