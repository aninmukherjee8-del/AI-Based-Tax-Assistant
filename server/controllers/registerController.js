import User from "../models/User.js";
import bcrypt from "bcryptjs";

const registerUser = async (req, res) => {
   try {

      const existingUser =
      await User.findOne({
         email:req.body.email
      });

      if(existingUser){
         return res.status(400).json({
            message:"Email already exists"
         });
      }

      const hashedPassword =
      await bcrypt.hash(req.body.password,10);

      const user = await User.create({
         name:req.body.name,
         email:req.body.email,
         password:hashedPassword
      });

      res.status(201).json({
         message:"User registered"
      });

   } catch(error){
      res.status(500).json({
         message:error.message
      });
   }
};

export { registerUser };