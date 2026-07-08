import userModel from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

const createUser = async(req,res,next)=>{
    const {firstname,lastname,email,password,role} = req.body;
    try {
        const existingUser = await userModel.find({email});
        if(existingUser.length > 0){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new userModel({
            firstname,
            lastname,
            email,
            password:hashedPassword,
            role
        });
        await newUser.save();
        res.status(201).json({message:"User created successfully"});
    } catch (error) {
        next(error);
    }
}


const login  = async(req,res,next)=>{
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid credentials"});

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) return res.status(400).json({message:"Invalid credentials"});

        const accessToken = jwt.sign(
            {id:user._id, role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:"15m"}
        )

        const refreshToken = jwt.sign(
            {id:user._id, role:user.role},
            process.env.JWT_REFRESH_SECRET,
            {expiresIn:"7d"}
        )

        res.status(200).json({
            success:true,
            accessToken,
            refreshToken,
            user:{
                id:user._id,
                firstname:user.firstname,
                lastname:user.lastname,
                email:user.email,
                role:user.role
            }
        })

    } catch (error) {
        next(error);
    }
}


const getMe = async(req,res,next)=>{
     
    try {
        
        const user = await userModel.findById(req.user.id).select("-password");
        if(!user) return res.status(404).json({message:"User not found"});

        res.status(200).json({
            success:true,
            data:{
                id:user.id,
                firstname:user.firstname,
                lastname:user.lastname,
                role:user.role,
                email:user.email,
                isActive:user.isActive,
                profileImage:user.profileImage

            }
        })

    } catch (error) {
        next(error)
    }
}


    const updateProfile = async(req,res,next)=>{
        const {firstname,lastname} = req.body;

        try {
            const user = await userModel.findById(req.user.id);

            const updateData = {
                firstname,
                lastname,
            };

            if (req.file) {
                if (user.profileImageId) {
                    await cloudinary.uploader.destroy(user.profileImageId);
                }

                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "profile-images",
                });

                updateData.profileImage = result.secure_url;
                updateData.profileImageId = result.public_id;
            }

            const updatedUser = await userModel
                .findByIdAndUpdate(req.user.id, updateData, {
                    new: true,
                })
                .select("-password");

            res.status(200).json({
                success:true,
                data:updatedUser
            })
        } catch (error) {
            next(error)
        }
    }


const updatePassword = async(req,res,next)=>{
    try{
        const userId = req.user.id;

    const {currentPassword,newPassword,confirmPassword} = req.body;

    if(!currentPassword || !newPassword || !confirmPassword){
        return res.status(400).json({message:"All fields are required"});
    }

    if(newPassword !== confirmPassword){
        return res.status(400).json({message:"New password and confirm password do not match"});
    }

    const user = await userModel.findById(userId)

    const isMatch = await bcrypt.compare(currentPassword,user.password);
    if(!isMatch) return res.status(400).json({message:"Current password is incorrect"});

    const hashedPassword = await bcrypt.hash(newPassword,10);
    await userModel.findByIdAndUpdate(userId,{password:hashedPassword});

    res.status(200).json({message:"Password updated successfully"});

    }catch(error){
        next(error)
    }
}





export {createUser, login,getMe, updateProfile, updatePassword};