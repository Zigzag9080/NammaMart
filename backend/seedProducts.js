const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/productModel");

const products = [
  {
    name: "Handmade Gift Box",
    price: 499,
    rating: 4.8,
    shop: "Malar Crafts",
    image: "🎁",
    category: "Gifts",
  },

  {
    name: "Cotton Kurti",
    price: 799,
    rating: 4.6,
    shop: "Anbu Fashions",
    image: "👗",
    category: "Fashion",
  },

  {
    name: "Natural Face Care Set",
    price: 649,
    rating: 4.7,
    shop: "Green Glow",
    image: "🌿",
    category: "Beauty",
  },

  {
    name: "Handmade Cookies",
    price: 299,
    rating: 4.9,
    shop: "Home Bakes",
    image: "🍪",
    category: "Food",
  },

  {
    name: "Premium Notebook",
    price: 199,
    rating: 4.7,
    shop: "Write Well",
    image: "📓",
    category: "Stationery",
  },

  {
    name: "Handmade Home Decor",
    price: 599,
    rating: 4.8,
    shop: "Home Harmony",
    image: "🏠",
    category: "Home",
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Products inserted successfully");

    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error:", error);
  });