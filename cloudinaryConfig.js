require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs =require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadonCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath) return null
        //upload the file on cloudinary
        const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })
        //file has been uploaded successfull
        console.log("file uploaded",response.url);
        return response;

    } catch (error) {
        
    }
}

module.exports = cloudinary;
