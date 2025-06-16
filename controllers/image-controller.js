const Image = require("../models/image.js");
const {uploadToCloudinary} = require("../helpers/cloudinaryhelpers.js");
const cloudinary = require('../config/cloudinary.js')

const uploadImageController = async(req,res)=>{
    try{
        //check if file is missing in the req object 
        
        if(!req.file){
            return res.status(400).json({
                success : false,
                message : "File is required, Please upload an image"
            })
        }
    // upload this to cloudinary 
        const {url,publicId} = await uploadToCloudinary(req.file.path);

    // store the image url and public id along with the uploaded user id
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy : req.userInfo.userId
        })

        await newlyUploadedImage.save();


        res.status(201).json({
            success : true,
            message : "Image uploaded successfully",
            image : newlyUploadedImage 
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Something went wrong!"
        })
    }
}

const fetchImageController = async(req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1)*limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);


      
        if(images){
            res.status(200).json({
                success : true,
                currentPage : page,
                totalPages : totalPages,
                totalImages : totalImages,
                data : images
            })
        }
        if(!req.file){
            return res.status(400).json({
                success : false,
                message : "File is required"
            })
        }
    }catch(e){
        console.error(e);
        res.status(500).json({
            success : false,
            message : "something went wrong! Please try again"
        })
    }
}

const deleteImageController = async(req,res)=>{
    try{
        const getCurrentIdofImageToBeDeleted = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getCurrentIdofImageToBeDeleted);
        if(!image){
            return res.status(404).json({
                success : false,
                message : "Image not found"
            })
        }
        if(image.uploadedBy.toString() !== userId){
            return res.status(403).json({
                success : false,
                message : "You are not authorized to delete this image because you haven't uploaded it"
            })
        }

        // delete this from the cloudinary storage 
        await cloudinary.uploader.destroy(image.publicId);

        // delete this from the mongodb database 
        await Image.findByIdAndDelete(getCurrentIdofImageToBeDeleted);

        res.status(200).json({
            success : true,
            message : "Image deleted successfully"
        })

    }catch(e){
        console.error(e);
        res.status(500).json({
            success : false,
            message : "something went wrong! Please try again"
        })
    }
}


module.exports = {
    uploadImageController,
    fetchImageController,
    deleteImageController 

}