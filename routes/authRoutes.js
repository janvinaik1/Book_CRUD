const express = require("express");
const bcrypt = require("bcryptjs");
const jwt= require("jsonwebtoken");
const User= require("../models/user");

const router=express.Router();

router.post("/register",async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        console.log(req.body);

        let user=await User.findOne({email});
        if(user) {
            return res.status(400).json({msg:"User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);
        console.log(salt);

        user = new User({name,email,password: hashedPassword});
        await user.save();
        console.log(user);
        res.status(201).json({msg:"User registered successfully"});
    }catch(error){
        res.status(500).json({msg:"Server Error",error});
    }
});

router.post("/login",async(req,res)=>{
    try{
        const {email ,password} =req.body;
        let user = await User.findOne({email}); 
        if(!user){
            return res.status(400).json({msg:"Invalid Credentials"}); 
        }

        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({msg:"Invalid Credentials"});
        }

        const payload={userId:user.id};
        
        const token=jwt.sign(payload,process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({token});
        
    }catch(error){
        res.status(500).json({msg:"Server Error",error});
    }
});

router.get("/profile",verifyToken,async(req,res)=>{
    try{
        const user = await User.findById(req.user.userId).select("-password");
        res.json(user);
    }catch (error){
        res.status(500).json({msg:"Server Error", error});
    }
});

function verifyToken(req,res,next){
    const token=req.header("Authorization");
    if(!token) return res.status(401).json({msg:"Access Denied"});
    try{
        const decoded =jwt.verify(token.replace("Bearer ",""),process.env.JWT_SECRET);
        req.user=decoded;
        console.log(req.user)
        next();
    }catch(error){
        res.status(400).json({msg:"Invalid Token"});
    }
}

module.exports = router;
