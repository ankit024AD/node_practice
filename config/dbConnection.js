const mongoose = require("mongoose");
const userModels = require("../models/userModels");


const connectDb = async () => {
    console.log("Trying to connect to the database...");
    
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/mynewtable");
      console.log("Database connected successfully");
      let response = await userModels.find({})
      console.log(response)
    } catch (error) {
      console.error("Database connection error:", error);
    }
  }

  module.exports = connectDb;