import sendEmail from '../config/sendEmail.js'
import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/verifyEmailTemplates.js'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import genertedRefreshToken from '../utils/genertedRefreshToken.js'
import { request, response } from 'express'
import uploadImageCloudinary from '../utils/uploadImageClodinary.js'
import generatedOtp from '../utils/generatedOtp.js'
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'
import jwt from 'jsonwebtoken'

/* =========================
   REGISTER CONTROLLER
========================= */
export async function registerUserController(req, res){
    try{
        const { name, email, password } = req.body

        if(!name || !email || !password){
            return res.status(400).json({
                message : "Provide name, email, password",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(user){
            return res.status(400).json({
                message : "Already registered email",
                error : true,
                success : false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const newUser = new UserModel({
            name,
            email,
            password : hashPassword
        })

        const save = await newUser.save()

        const VerifyEmailURL = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`

        await sendEmail({
            sendTo : email,
            subject : "Verify email from binkeyit",
            html : verifyEmailTemplate({
                name,
                url : VerifyEmailURL
            })
        })

        return res.json({
            message : "User registered successfully",
            error : false,
            success : true,
            data : save
        })

    } catch(error){
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

/* =========================
   VERIFY EMAIL CONTROLLER
========================= */
export async function verifyEmailController (req, res){
    try{
        const { code } = req.body

        const user = await UserModel.findOne({ _id : code })

        // ✅ FIXED LOGIC
        if(!user){
            return res.status(400).json({
                message : "Invalid code",
                error : true,
                success : false
            })
        }

        await UserModel.updateOne(
            { _id : code },
            { verify_email : true }
        )

        return res.json({
            message : "Email verified successfully",
            success : true,
            error : false
        })

    } catch(error){
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

/* =========================
   LOGIN CONTROLLER
========================= */
export async function loginController(req, res) {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Provide Email and Password",
                error: true,
                success: false
            });
        }

        // Find User
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not registered",
                error: true,
                success: false
            });
        }

        // Check Password
        const checkPassword = await bcryptjs.compare(
            password,
            user.password
        );

        if (!checkPassword) {
            return res.status(400).json({
                message: "Invalid password",
                error: true,
                success: false
            });
        }

        // Generate Tokens
        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await genertedRefreshToken(user._id);

        // Update refresh token + last login date
        await UserModel.findByIdAndUpdate(
            user._id,
            {
                refresh_token: refreshToken,
                last_login_date: new Date(),
                status: "Active"
            },
            { new: true }
        );

        // Cookie Options
        const cookiesOption = {
            httpOnly: true,
            secure: false, // localhost ke liye false
            sameSite: "Lax",
            path: "/"
        };

        // Set Cookies
        res.cookie("accessToken", accessToken, cookiesOption);
        res.cookie("refreshToken", refreshToken, cookiesOption);

        // IMPORTANT:
        // User details bhi response me bhejo
        return res.status(200).json({
            message: "Login Successfully",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    mobile: user.mobile,
                    verify_email: user.verify_email,
                    last_login_date: new Date(),
                    status: "Active",
                    address_details: user.address_details || [],
                    shopping_cart: user.shopping_cart || [],
                    orderHistory: user.orderHistory || [],
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.log("Login Error:", error);

        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}
/* =========================
   LOGOUT CONTROLLER
========================= */
export async function logoutController(req, res) {
    try {
        // ✅ correct user id
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated",
                error: true,
                success: false
            });
        }

        // ✅ clear refresh token from DB
        await UserModel.findByIdAndUpdate(userId, {
            refresh_token: ""
        });

        // ✅ cookie options
        const cookiesOption = {
            httpOnly: true,
            secure: false, // localhost
            sameSite: "Lax",
            path: "/"
        };

        // ✅ clear cookies
        res.clearCookie("accessToken", cookiesOption);
        res.clearCookie("refreshToken", cookiesOption);

        return res.status(200).json({
            message: "Logout Successfully",
            error: false,
            success: true
        });

    } catch (error) {
        console.log("Logout Error:", error);

        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

// upload user avatar

export async function uploadAvtar(req, res) {
    try {
        const userId = req.userId
        console.log("UserID:", userId)

        const image = req.file

        if (!image) {
            return res.status(400).json({
                message: "No file uploaded",
                success: false,
                error: true
            });
        }

        const upload = await uploadImageCloudinary(image)
        console.log("Upload:", upload)

        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            { avatar: upload.url },
            { new: true }
        )

        console.log("Updated User:", updateUser)

        return res.status(200).json({
            message: "Image uploaded successfully",
            success: true,
            error : false,
            data: {
                _id : userId,
                avatar : upload.url
            }
        });

    } catch (error) {
        console.log("ERROR:", error)

        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// update User Details
export async function updateUserDetails(req, res) {
    try {
        const userId = req.userId
        const { name, email, mobile, password } = req.body

        let hashPassword = ""

        if (password) {
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password, salt)
        }

        const updateUser = await UserModel.updateOne(
            {_id : userId},
            {
                ...(name && { name }),
                ...(email && { email }),
                ...(mobile && { mobile }),
                ...(password && { password: hashPassword })
            },
            { new: true }
        ).select("-password -refresh_token")

        return res.json({
            message: "Updated User Successfully",
            error: false,
            success: true,
            data: updateUser
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// forgot Password not login
export async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body
        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            })
        }

        const otp = generatedOtp()
        const expireTime = Date.now() + 60 * 60 * 1000

        await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime)
        })

        await sendEmail({
            sendTo: email,
            subject: "Forgot password from Binkeyit",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        })

        return res.json({
            message: "Check your email",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// verify forgot password otp
export async function verifyForgotPasswordOtp(req, res) {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({
                message: "Provide required field email, otp.",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            })
        }

        const currentTime = new Date().toISOString()

        if (!user.forgot_password_expiry || user.forgot_password_expiry < currentTime) {
            return res.status(400).json({
                message: "Otp is expired",
                error: true,
                success: false
            })
        }

        if (String(otp) !== String(user.forgot_password_otp)) {
            return res.status(400).json({
                message: "Invalid otp",
                error: true,
                success: false
            })
        }

        // ✅ Clear OTP after verification
        user.forgot_password_otp = null
        user.forgot_password_expiry = null
        await user.save()

        return res.json({
            message: "Verify otp successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
// reset the password
export async function resetpassword(req, res){
    try{
        const { email, newPassword, confirmPassword } = req.body

        if(!email || !newPassword || !confirmPassword){
            return res.status(400).json({
                message : "Provide required fields email, newPassword, confirmPassword",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return res.status(400).json({
                message : "Email is not available",
                error : true,
                success : false
            })
        }

        // ✅ Password match check
        if(newPassword !== confirmPassword){
            return res.status(400).json({
                message : "newPassword and confirmPassword do not match.",
                error : true,
                success : false
            })
        }

        // 🔐 Optional: Check OTP verified
        if(user.forgot_password_otp){
            return res.status(400).json({
                message: "Verify OTP first",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword, salt)

        await UserModel.findByIdAndUpdate(user._id, {
            password : hashPassword
        })

        return res.json({
            message : "Password updated successfully.",
            error : false,
            success : true
        })

    } catch(error){
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//refresh token controller
export async function refreshToken(req, res) {
    try {
        const incomingRefreshToken =
            req.cookies?.refreshToken ||
            req.headers?.authorization?.split(" ")[1]

        if (!incomingRefreshToken) {
            return res.status(401).json({
                message: "Refresh token missing",
                error: true,
                success: false
            })
        }

        const decoded = jwt.verify(
            incomingRefreshToken,
            process.env.SECRET_KEY_REFRESH_TOKEN
        )

        const user = await UserModel.findById(decoded._id)

        if (!user) {
            return res.status(401).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        // DB token match check
        if (user.refresh_token !== incomingRefreshToken) {
            return res.status(401).json({
                message: "Invalid refresh token",
                error: true,
                success: false
            })
        }

        const newAccessToken = await generatedAccessToken(user._id)

        const cookiesOption = {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            path: "/"
        }

        res.cookie("accessToken", newAccessToken, cookiesOption)

        return res.json({
            message: "New Access Token Generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        })

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token",
            error: true,
            success: false
        })
    }
}

// get login user details
export async function userDetails(req, res) {
    try {
        const userId = req.userId;
        console.log("User ID:", userId);

        // IMPORTANT FIX:
        // password + refresh_token + otp fields hide kar diye
        const user = await UserModel.findById(userId).select(
            "-password -refresh_token -forgot_password_otp -forgot_password_expiry"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "User details",
            data: user,
            error: false,
            success: true
        });

    } catch (error) {
        console.log("User Details Error:", error);

        return res.status(500).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false
        });
    }
}