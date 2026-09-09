const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
require("dotenv").config();
const productRoutes=require("./routes/productRoutes");
const authRoutes=require("./routes/authRoutes");
const orderRoutes=require("./routes/orderRoutes");
const userRoutes=require("./routes/userRoutes");
const app=express();
app.use(cors());
app.use(express.json());
app.get("/",(req,res)=>res.send("NammaMart Backend is running!"));
app.use("/api/products",productRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/users",userRoutes);
mongoose.connect(process.env.MONGO_URI).then(async()=>{
  console.log("MongoDB connected successfully");
  console.log("DATABASE:", mongoose.connection.db.databaseName);
  console.log("COLLECTIONS:", (await mongoose.connection.db.listCollections().toArray()).map(c => c.name));
  console.log("PRODUCT COUNT:", await mongoose.connection.db.collection("products").countDocuments());

  app.listen(5000,()=>console.log("Server running on http://localhost:5000"));
}).catch(e=>console.error("MongoDB connection failed:",e));