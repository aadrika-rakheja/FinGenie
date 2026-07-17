const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
dotenv.config();
const connectDB=require("./config/db");
connectDB();

const app=express();

app.use(express.json());
app.use(cors());


const userRoutes=require("./routes/userRoutes");
app.use("/api/auth",userRoutes);
const expenseRoutes=require("./routes/expenseRoutes");
app.use("/api/expenses",expenseRoutes);
const budgetRoutes=require("./routes/budgetRoutes");
app.use("/api/budgets",budgetRoutes);
const goalRoutes=require("./routes/goalRoutes");
app.use("/api/goals",goalRoutes);

module.exports=app;