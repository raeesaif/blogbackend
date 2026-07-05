import userModel from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
                isActive:user.isActive

            }
        })

    } catch (error) {
        next(error)
    }
}


const updateProfile = async(req,res,next)=>{
    const {firstname,lastname} = req.body;

    try {
        const updateUser = await userModel.findByIdAndUpdate(
            req.user.id,
            {firstname,lastname},
            {returnDocument:"after"}
        ).select("-password");
        res.status(200).json({
            success:true,
            data:updateUser
        })
    } catch (error) {
        next(error)
    }
}


export {createUser, login,getMe, updateProfile};