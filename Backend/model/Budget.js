const mongoose=require("mongoose");

const budgetSchema=new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    month:{
        type:Number,
        enum:[1,2,3,4,5,6,7,8,9,10,11,12],
        required:true
    },
    category:{
        type:String,
        enum: [
                "Food",
                "Transport",
                "Shopping",
                "Bills & Utilities",
                "Healthcare",
                "Entertainment",
                "Travel",
                "Education",
                "Rent",
                "Insurance",
                "Investments",
                "Gifts & Donations",
                "Personal Care",
                "Others"
            ],
        required:true
    },
    monthlyLimit:{
        type:Number,
        required:true
    },
    year:{
        type:Number,
        required:true
    },
    createdBy: {
        type: String,
        enum: ["Manual", "AI","Copied"],
        default: "Manual"
    }
});

budgetSchema.index(
    {
        user: 1,
        month: 1,
        year: 1,
        category: 1
    },
    {
        unique: true
    }
);


module.exports=mongoose.model("Budget",budgetSchema);