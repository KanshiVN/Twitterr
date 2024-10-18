import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, userName} = req.body;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const existingEmail = await User.findOne({email});
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }
    //hash password
    if(password.length<6) {
        return res.status(400).json({ error: "Password should be at least 6 characters long" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
        userName,
    })

    if(newUser){
        generateTokenAndSetCookie(newUser._id,res)
        await newUser.save();
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            userName: newUser.userName,
            followers: newUser.followers,
            following: newUser.following,
            coverImg: newUser.coverImg,
            profileImg: newUser.profileImg
        });
    }
    else{
        res.status(400).json({ error: "Failed to create user" });
    }

  } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal server error"})
  }
};

export const login = async (req, res) => {
  try {
      const { userName, password } = req.body;
      const user = await User.findOne({ userName: userName });
      const isPasswordCorrect = await bcrypt.compare(password, user?.password ||"")

      if (!user ||!isPasswordCorrect) {
        return res.status(400).json({ error: "Invalid username or password" });
      }
      generateTokenAndSetCookie(user._id,res);

      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        userName: user.userName,
        followers: user.followers,
        following: user.following,
        coverImg: user.coverImg,
        profileImg: user.profileImg,
       
      })

  } catch (error) {
    console.log("Error in login contoller", error.message);
    res.status(500).json({error:"Email or password is incorrect"});
  }
};

export const logout = async (req, res) => {
 try {
    res.cookie('jwt',"",{maxAge:0})
    res.status(200).json({message:"Logged out successfully"});
 } catch (error) {
    console.log("Error in logout contoller", error.message);
    res.status(500).json({error:"Internal server error"});
  
 }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
}