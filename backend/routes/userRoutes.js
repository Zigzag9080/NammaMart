const express=require("express");
const User=require("../models/userModel");
const auth=require("../middleware/auth");
const r=express.Router();
r.get("/me",auth,async(req,res)=>{
  const u=await User.findById(req.user.id).select("-password");
  res.json(u);
}
);
r.put("/me",auth,async(req,res)=>{
  const{
    name,email,phone,address}
  =req.body;
  const u=await User.findByIdAndUpdate(req.user.id,{
    name,email,phone,address}
  ,{
    new:true,runValidators:true}
  ).select("-password");
  res.json({
    message:"Profile updated successfully",user:u}
  );
}
);
module.exports=r;
