import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

export const googleLogin = async (req, res) => {
    try{
        const {credential} = req.body;
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const {sub,name,email} = payload;
        let user = await User.findOne({email});
        if(!user){
            user = new User({
                name,
                email,
                googleId: sub,
                provider: "google"
            });
            await user.save();
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
        return res.status(200).json({token, user: {id: user._id, name: user.name, email: user.email},success:true});
    }
    catch(err){
        console.error("Google login error:", err);  
        return res.status(500).json({message: "Google login failed", success:false});
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-__v");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};