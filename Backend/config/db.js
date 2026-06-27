const mongoose=require("mongoose");
const MONGO_USERNAME=process.env.MONGO_USERNAME;
const MONGO_PASSWORD=process.env.MONGO_PASSWORD;
const MONGO_DB_NAME=process.env.MONGO_DB_NAME;

const MONGO_URL=`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.ioa4xfk.mongodb.net/${MONGO_DB_NAME}?appName=Cluster0`;


const connectDB=async()=>{
    try{
        await mongoose.connect(MONGO_URL);
        console.log("Database connected successfully");
    }catch(e){
        console.log("Error in connecting DB:" ,e.message);
        process.exit(1);
    }
};

module.exports=connectDB;