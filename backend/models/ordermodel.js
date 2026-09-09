const mongoose=require("mongoose");
const schema=new mongoose.Schema({
  customerId:{
    type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
  ,customerName:String,customerPhone:String,customerAddress:String,products:[{
    productId:{
      type:mongoose.Schema.Types.ObjectId,ref:"Product"}
    ,name:String,price:Number,quantity:Number,shop:String}
  ],total:Number,status:{
    type:String,enum:["Order Placed","Confirmed","Shipped","Delivered","Cancelled"],default:"Order Placed"}
}
,{
  timestamps:true}
);
module.exports=mongoose.model("Order",schema);
