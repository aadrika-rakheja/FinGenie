const express=require("express");
const {getAllExpenses,addExpense,editExpense,deleteExpense}=require("../controller/expenseController");
const {protect} =require("../middleware/userMiddleware");

const router=express.Router();

router.get("/getAllExpenses",protect,getAllExpenses);
router.post("/addExpense",protect,addExpense);
router.put("/editExpense/:id",protect,editExpense);
router.delete("/deleteExpense/:id",protect,deleteExpense);

module.exports=router;