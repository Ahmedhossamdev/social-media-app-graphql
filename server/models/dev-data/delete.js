const { mongoose } = require('mongoose');
const Post = require("../Post");
const connectDB = require('../../config/db.js');
connectDB();


deleteData = async ()=>{
    try {
        await Post.deleteMany();
        console.log("Data deleted successfully");
    }
    catch (err){
        console.log("Error deleting data");
    }
}

 deleteData();


