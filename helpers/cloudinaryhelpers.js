const cloudinary = require('../config/cloudinary.js');


const uploadToCloudinary = async(filepath) =>{
    try{
        const result = await cloudinary.uploader.upload(filepath);

        return {
            url : result.secure_url,
            publicId : result.public_id
        }

    }catch(error){
        console.error("Error while uploading to cloudinary",error)
        throw new error('Error while uploading to cloudinary')
    }
}

module.exports = {
    uploadToCloudinary
}
