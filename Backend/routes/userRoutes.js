const express=require("express");
const {signUpUser,signInUser,forgotPassword,resetPassword}=require("../controller/userController");
const {protect,authorize}=require("../middleware/userMiddleware");

const router=express.Router();

router.post("/sign-up",signUpUser);
router.post("/sign-in",signInUser);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:token",resetPassword);


module.exports=router;