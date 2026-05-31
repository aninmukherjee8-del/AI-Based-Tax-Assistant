import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginUser = async (req,res)=>{
    try{

        const user = await User.findOne({
            email:req.body.email
        });

        if(!user){
            return res.status(400).json({
                message:"Invalid Credentials"
            });
        }

        const isMatch =
        await bcrypt.compare(
            req.body.password,
            user.password
        );

        if(!isMatch){
            return res.status(400).json({
                message:"Invalid Credentials"
            });
        }

        const token = jwt.sign(
            {
                id:user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );

        res.status(200).json({
            token
        });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

export { loginUser };