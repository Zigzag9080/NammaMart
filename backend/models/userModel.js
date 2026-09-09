const mongoose=require("mongoose");
const schema=new mongoose.Schema({
  name:{
    type:String,required:true}
  ,email:{
    type:String,required:true,unique:true,lowercase:true}
  ,password:{
    type:String,required:true}
  ,role:{
    type:String,enum:["Customer","Seller"],default:"Customer"}
  ,phone:{
    type:String,default:""}
  ,address:{
    type:String,default:""}
}
,{
  timestamps:true}
);
module.exports=mongoose.model("User",schema);
