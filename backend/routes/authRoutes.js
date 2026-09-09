const express=require("express");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../models/userModel");
const r=express.Router();
const token=u=>jwt.sign({
  id:u._id.toString(),role:u.role}
,process.env.JWT_SECRET,{
  expiresIn:"7d"}
);
const safe=u=>({
  id:u._id,name:u.name,email:u.email,role:u.role,phone:u.phone,address:u.address}
);
r.post("/signup",async(req,res)=>{
  try{
    const{
      name,email,password,role}
    =req.body;
    if(!name||!email||!password)return res.status(400).json({
      message:"Please fill all signup details."}
    );
    if(password.length<6)return res.status(400).json({
      message:"Password must be at least 6 characters."}
    );
    if(await User.findOne({
      email:email.toLowerCase().trim()}
    ))return res.status(400).json({
      message:"Email already registered."}
    );
    const u=await User.create({
      name:name.trim(),email:email.toLowerCase().trim(),password:await bcrypt.hash(password,10),role:role==="Seller"?"Seller":"Customer"}
    );
    res.status(201).json({
      message:"Signup successful",token:token(u),user:safe(u)}
    );
  }
catch(e){
  res.status(500).json({
    message:e.message}
  );
}
}
);
r.post("/login",async(req,res)=>{
  try{
    const u=await User.findOne({
      email:req.body.email?.toLowerCase().trim()}
    );
    if(!u||!(await bcrypt.compare(req.body.password||"",u.password)))return res.status(401).json({
      message:"Invalid email or password."}
    );
    if(req.body.role&&u.role!==req.body.role)return res.status(401).json({
      message:`This account is registered as ${u.role}.`}
    );
    res.json({
      message:"Login successful",token:token(u),user:safe(u)}
    );
  }
catch(e){
  res.status(500).json({
    message:e.message}
  );
}
}
);
module.exports=r;
