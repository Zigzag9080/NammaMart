const express=require("express");
const Product=require("../models/productModel");
const auth=require("../middleware/auth");
const r=express.Router();
r.get("/",async(req,res)=>res.json(await Product.find().sort({
  createdAt:-1}
)));
r.get("/",async(req,res)=>{
  const products=await Product.find().sort({createdAt:-1});
  console.log("LIVE PRODUCT COUNT:",products.length);
  res.json(products);
});
r.post("/",auth,async(req,res)=>{
  if(req.user.role!=="Seller")return res.status(403).json({
    message:"Only sellers can add products"}
  );
  res.status(201).json(await Product.create({
    ...req.body,sellerId:req.user.id}
  ));
}
);
r.put("/:id",auth,async(req,res)=>{
  if(req.user.role!=="Seller")return res.status(403).json({
    message:"Only sellers can update products"}
  );
  const p=await Product.findOneAndUpdate({
    _id:req.params.id,sellerId:req.user.id}
  ,req.body,{
    new:true,runValidators:true}
  );
  if(!p)return res.status(404).json({
    message:"Product not found or not owned by you"}
  );
  res.json(p);
}
);
r.delete("/:id",auth,async(req,res)=>{
  if(req.user.role!=="Seller")return res.status(403).json({
    message:"Only sellers can delete products"}
  );
  const p=await Product.findOneAndDelete({
    _id:req.params.id,sellerId:req.user.id}
  );
  if(!p)return res.status(404).json({
    message:"Product not found or not owned by you"}
  );
  res.json({
    message:"Product deleted successfully"}
  );
}
);
module.exports=r;
