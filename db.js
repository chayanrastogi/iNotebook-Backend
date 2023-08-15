const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://chayan:nbi8808869@cluster0.r393ks9.mongodb.net/inotebook";

const connectToMongo  = async ()=>{
   await mongoose.connect(mongoURI);
    console.log("Connected to mongo Successfully");
}

module.exports = connectToMongo; 