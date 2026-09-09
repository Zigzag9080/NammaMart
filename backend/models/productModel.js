const mongoose=require("mongoose");
const schema=new mongoose.Schema({
  name:{
    type:String,required:true,trim:true}
  ,price:{
    type:Number,required:true}
  ,rating:{
    type:Number,default:0}
  ,shop:{
    type:String,required:true}
  ,image:{
    type:String,default:""}
  ,category:{
    type:String,required:true}
  ,description:{
    type:String,default:""}
  ,stock:{
    type:Number,default:0}
  ,sellerId:{
    type:mongoose.Schema.Types.ObjectId,ref:"User",default:null}
}
,{
  timestamps:true}
);
module.exports=mongoose.model("Product",schema);
