const mongoose=require("mongoose");

const expenseSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    merchant: {
        type: String,
        required: true,
        trim: true
    },

    amount: {
        type: Number,
        required: true
    },

    type: {
        type: String,
        enum: ["Expense", "Income"],
        default: "Expense"
    },

    category: {
        type: String,
        required: true
    },

    currency: {
        type: String,
        enum: ["INR", "USD"],
        default: "INR"
    },

    paymentMethod: {
        type: String,
        enum: [
            "Cash",
            "UPI",
            "Credit Card",
            "Debit Card",
            "Net Banking"
        ]
    },
    
    transactionDate: {
        type: Date,
        required: true
    },
    goal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Goals",
        default: null
    },

    isGoalContribution: {
        type: Boolean,
        default: false
    }

},
{
    timestamps: true
});

module.exports=mongoose.model("Expenses",expenseSchema);