const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
     name:{
        type:String,
        required:[true,"Name is required"],
        minlength: 3
    },
    email:{
        type:String,
        reqired:[true,"Email is required"],
        unique:true,
        lowercase:true
    },
    password:{
        type:"String",
        required:[true,"Password is required"],
        minlength:5
    },
    profleImage:{
        type:String
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "user"
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpires:{
        type:Date
    }
},{timestamps:true});

module.exports=mongoose.model("User",userSchema);