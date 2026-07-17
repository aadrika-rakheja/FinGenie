const {addGoal, editGoal, deleteGoal, getGoals,getGoalSummary,getGoalById,addGoalContribution}=require("../controller/goalController");
const {protect,authorize}=require("../middleware/userMiddleware");

const express=require("express");
const router=express.Router();

router.get("/getGoals",protect,getGoals);
router.post("/addGoal",protect,addGoal);
router.put("/editGoal/:id", protect, editGoal);
router.delete("/deleteGoal/:id", protect, deleteGoal);
router.get("/getGoalSummary", protect, getGoalSummary);
router.get("/getGoalById/:id",protect,getGoalById);
router.post("/addGoalContribution/:id", protect, addGoalContribution);
module.exports=router;