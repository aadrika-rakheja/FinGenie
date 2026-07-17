const {getAllBudgets,addBudget,getBudgetSummary,editBudget,deleteBudget}=require("../controller/budgetController");
const express=require("express");
const {protect,authorize}=require("../middleware/userMiddleware");

const router=express.Router();

router.get("/getAllBudgets",protect,getAllBudgets);
router.post("/addBudget",protect,addBudget);
router.put("/editBudget/:id", protect, editBudget);
router.delete("/deleteBudget/:id", protect, deleteBudget);
router.get("/budget-summary",protect,getBudgetSummary);

module.exports=router;