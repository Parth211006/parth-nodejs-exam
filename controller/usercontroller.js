import { validationResult } from "express-validator";
import user from "../models/user.js";
import bcrypt from "bcryptjs";
import User from "../models/user.js";


export const register = async (req,res)=>{
     try {

        const error = validationResult(req);

        if(error.array().length != 0){
            return res.json(error.array());
        }

        const { email, password, confirmPassword } = req.body;

        const user = await User.findOne({ email });

        if (user) return res.json({ message: "User exist." });

        if (password != confirmPassword) return res.json({ message: "Password and confirm Password not match." });

        const otp = crypto.randomInt(100000, 999999).toString();
        await sendOTPEmail(email, otp);

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);

        req.body.verifyOTP = otp;
        req.body.password = hashPassword;

        req.body.expireAt = Date.now() + (1000 * 30);

        const data = await User.create(req.body);
        return res.status(201).json({ message: "user register success.", data });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const getAlluser = async(req,res)=>{
        try {
            const data = await  User.find({});
            return res.status(200).json({message : "Data fetch success",data})
        } catch (error) {
            return res.message(400).json({message:error.message})
        }
}

export const login = async (req,res)=>{
        try {
            const {email,password} = req.body;

            const user = await User.findOne({email}).select('+password');

            if(!user) return res.status(400).json({message: "user not exist."});

            const ismatch = await bcrypt.compare(password,user.password); 

            if(!ismatch) return res.status(400).json({message: "Invalid credentails"});

            if(!user.isVarified) return res.status(400).json({message:"please verify email"});
            
            return res.status(200).json({message:error.message})    
        } catch (error) {
            return res.status(400).json()
        }
}

