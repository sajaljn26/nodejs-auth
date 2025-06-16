const User = require('../models/user.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//register controller
const registerUser = async(req,res)=>{
    try{
        //extract the user information from the request body
        const {username , email , password , role} = req.body;

        // check if the user is already exist in the database 
        const checkExistingUser = await User.findOne({$or : [{username},{email}]});
        if(checkExistingUser){
            return res.status(400).json({
                success : false,
                message : "User already exisiting either with the same username or same email please try with a different username or email"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //create a new user and save into your database 
        const newlyCreatedDatabase = new User({
            username,
            email,
            password : hashedPassword,
            role : role || "User" 
        })

        await newlyCreatedDatabase.save();

        if(newlyCreatedDatabase){
            res.status(200).json({
                success : true,
                message : "User registered succesfully"
            })
        }else{
            res.status(404).json({
                success : false,
                message : "Unable to register user please try again"
            })
        }

    }catch(e){
        console.error(e);
        res.status(500).json({
            success : false,
            message : "Some error occured please try again"
        })
    }
}

// login controller 
const loginUser = async(req,res)=>{
    try{
        const {username,password} = req.body;
        // find if the current user exist in database 
        const user = await User.findOne({username})
        if(!user){
            res.status(400).json({
                success : false,
                message : "User does not exist"
            })
        }
        // if the password is correct or not 
        const isPasswordMatched = await bcrypt.compare(password,user.password)
        if(!isPasswordMatched){
            res.status(400).json({
                success : false,
                message : "Invalid username and password"
            })
        }
    // create user token 
    const accessToken = jwt.sign({
        userId : user._id,
        username : user.username,
        role : user.role
    },process.env.JWT_SECRET_KEY,{
        expiresIn : '15m'
    })

    res.status(200).json({
        success : true,
        message : "Logged in successfully",
        accessToken
    })

    }catch(e){
        console.error(e);
        res.status(500).json({
            success : false,
            message : "Some error occured please try again"
        })
    }
}

const changePassword = async(req,res)=>{
    try{
        const userId = req.userInfo.userId
        // extract old and new passwords 
        const {oldPassword , newPassword} = req.body;
        // find the current logged in user 
        const user = await User.findById(userId);
        if(!user){
            res.status(400).json({
                success : false,
                message : "User not found"
            })
        }

        // check if the old password is correct 
        const isPasswordMatched = await bcrypt.compare(oldPassword,user.password);
        if(!isPasswordMatched){
            return res.status(400).json({
                success : false,
                message : "Old password not Correct please try again!"
            })
        }

        // hash new password 
        const salt = await bcrypt.genSalt(10);
        const newHashedpassword = await bcrypt.hash(newPassword, salt);

        user.password = newHashedpassword;
        await User.save();

        return res.status(200).json({
            success : true,
            message : "Password Changed successfully"
        })

    }catch(e){
        console.error(e);
        res.status(500).json({
            success : false,
            message : "Some error occured please try again"
        })

    }
}


module.exports = {loginUser,registerUser,changePassword}