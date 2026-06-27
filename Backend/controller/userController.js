const User=require("../model/User");
const bcrypt=require("bcrypt");
const generateToken=require("../utils/generateToken");

const signUpUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!name || !email || !password)
            return res.status(400).json({
                success:false,
                error:"Name, email and password are required"
        });

        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                error:"User already exists"
            });
        }

        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(password,salt);

        const user=await User.create({
            name,
            email,
            password:hashPassword,
            role: "User"
        });

        res.status(201).json({
            success:true,
            id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        })
    }catch(e){
         return res.status(500).json({
            success:false,
            message:"Failed to register",
            error:e.message
        })
    }
}

const signInUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password)
            return res.status(400).json({
                success:false,
                error:"Email and password are required"
        })

        const user=await User.findOne({email});

        if(!user)
            return res.status(400).json({
            success:false,
            error:"USer doessn't exist"
        });

        if(user && await bcrypt.compare(password,user.password)){
            return res.status(200).json({
                success:true,
                msg:"Login successfully",
                id:user._id,
                name:user.name,
                email:user.email,
                token:generateToken(user._id)
            })
        }else{
            return res.status(400).json({
                success:false,
                error:"Incorrect password"
            })
        }
    }catch(e){
        res.status(500).json({
            success:false,
            msg:"Login failed",
            error:e.message
        })
    }
    
}

const forgotPassword=async(req,res)=>{
    try{
        const {email}=req.body;
        const user=await User.findOne({email});

        if(!user)
            return res.status(400).json({
            success:false,
            msg:"User does not exist"
        })

        const crypto=require("crypto");
        const token = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken=token;
        user.resetPasswordExpires=Date.now()+10*60*1000;
        //10 min expiry 
        await user.save();

        const nodemailer=require("nodemailer");
        const transporter=nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth:{
                user:process.env.EMAIL, 
                pass:process.env.EMAIL_PASSWORD
            }
        });

        const resetURL=`http://localhost:5173/reset-password/${token}`;

        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to send emails");
            }
        });

        await transporter.sendMail({
            from:process.env.EMAIL,
            to:user.email,
            subject:"Reset Password",
            html:`
            <h2 style="color:#1E3A8A; font-family:Arial, sans-serif;">
                🔐 Reset Your FinGenie Password
            </h2>

            <p style="font-family:Arial, sans-serif; color:#444; font-size:16px;">
                Hi,
            </p>

            <p style="font-family:Arial, sans-serif; color:#444; font-size:16px; line-height:1.6;">
                We received a request to reset the password for your <strong>FinGenie</strong> account.
            </p>

            <p style="font-family:Arial, sans-serif; color:#444; font-size:16px; line-height:1.6;">
                Click the button below to create a new password. This link is valid for
                <strong>10 minutes</strong>.
            </p>

            <div style="text-align:center; margin:35px 0;">
                <a href="${resetURL}"
                style="
                        background:#2563EB;
                        color:white;
                        padding:14px 28px;
                        text-decoration:none;
                        border-radius:8px;
                        font-size:16px;
                        font-weight:bold;
                        display:inline-block;">
                    Reset Password
                </a>
            </div>

            <p style="font-family:Arial, sans-serif; color:#666; font-size:14px;">
                If you didn't request a password reset, you can safely ignore this email.
                Your password will remain unchanged.
            </p>

            <hr style="border:none; border-top:1px solid #ddd; margin:30px 0;">

            <p style="font-family:Arial, sans-serif; color:#888; font-size:13px;">
                This is an automated email from <strong>FinGenie</strong>. Please do not reply to this message.
            </p>

            <p style="font-family:Arial, sans-serif; color:#888; font-size:13px;">
                © 2026 FinGenie. All rights reserved.
            </p>
            `
        });

        res.status(200).json({
            success:true,
            msg:"Reset link sent"
        });
    }
    catch(e){
        res.status(400).json({
            success:false,
            msg:"Unable to send reset link",
            error:e.message
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                msg: "Password is required"
            });
        }

        const user = await User.findOne({
            resetPasswordToken: token
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "Invalid or expired reset token"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        // Remove reset token
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            msg: "Password reset successfully"
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            msg: "Unable to reset password",
            error: e.message
        });
    }
};


module.exports={signUpUser,signInUser,forgotPassword,resetPassword};