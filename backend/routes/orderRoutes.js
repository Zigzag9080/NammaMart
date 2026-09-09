const express=require("express");
const Order=require("../models/orderModel");
const Product=require("../models/productModel");
const auth=require("../middleware/auth");
const r=express.Router();
r.post("/",auth,async(req,res)=>{
  if(req.user.role!=="Customer")return res.status(403).json({
    message:"Only customers can place orders"}
  );
  const{
    customerName,customerPhone,customerAddress,products,total}
  =req.body;
  if(!customerName||!customerPhone||!customerAddress||!products?.length)return res.status(400).json({
    message:"Please fill all delivery details."}
  );
  res.status(201).json(await Order.create({
    customerId:req.user.id,customerName,customerPhone,customerAddress,products,total}
  ));
}
);
r.get("/mine",auth,async(req,res)=>res.json(await Order.find({
  customerId:req.user.id}
).sort({
  createdAt:-1}
)));
r.put("/:id/cancel",auth,async(req,res)=>{
  if(req.user.role!=="Customer")
    return res.status(403).json({message:"Only customers can cancel orders"});

  const o=await Order.findOne({
    _id:req.params.id,
    customerId:req.user.id
  });

  if(!o)
    return res.status(404).json({message:"Order not found"});

  if(o.status!=="Order Placed" && o.status!=="Confirmed")
    return res.status(400).json({
      message:"This order cannot be cancelled now"
    });

  o.status="Cancelled";
  await o.save();

  res.json(o);
});
r.get("/seller",auth,async(req,res)=>{
  if(req.user.role!=="Seller")return res.status(403).json({
    message:"Seller access required"}
  );
  const ids=(await Product.find({
    sellerId:req.user.id}
  )).map(x=>x._id.toString());
  const os=await Order.find().sort({
    createdAt:-1}
  );
  res.json(os.filter(o=>o.products.some(p=>ids.includes(p.productId?.toString()))));
}
);
r.put("/:id/status",auth,async(req,res)=>{
  if(req.user.role!=="Seller")return res.status(403).json({
    message:"Seller access required"}
  );
  const o=await Order.findByIdAndUpdate(req.params.id,{
    status:req.body.status}
  ,{
    new:true}
  );
  if(!o)return res.status(404).json({
    message:"Order not found"}
  );
  res.json(o);
}
);
module.exports=r;
