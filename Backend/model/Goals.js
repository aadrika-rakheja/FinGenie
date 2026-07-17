const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    goalName: {
      type: String,
      required: true,
      trim: true
    },

    goalIcon: {
      type: String,
      default: "💰"
    },

    targetAmount: {
      type: Number,
      required: true
    },

     startDate:{
        type:Date,
        default:Date.now
    },

    targetDate: {
      type: Date,
      required: true
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },

    description: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Goals", goalSchema);