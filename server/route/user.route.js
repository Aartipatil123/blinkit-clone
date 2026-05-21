import {Router} from'express'
import auth from '../middleware/auth.js'
import { registerUserController, verifyEmailController, loginController, logoutController, uploadAvtar, updateUserDetails, forgotPasswordController, verifyForgotPasswordOtp, resetpassword, refreshToken, userDetails} from '../controllers/user.controller.js'
import upload from '../middleware/multer.js'

const userRouter = Router()
userRouter.post('/register',registerUserController)
userRouter.post('/verify-email',verifyEmailController)
userRouter.post('/login',loginController)
userRouter.get('/logout',auth,logoutController)
userRouter.put('/upload-avtar',auth, upload.single('avatar') ,uploadAvtar)
userRouter.put('/update-user',auth,updateUserDetails)
userRouter.put('/forgot-password',forgotPasswordController)
userRouter.put('/verify-forgot-password-otp',verifyForgotPasswordOtp)
userRouter.put('/reset-password',resetpassword)
userRouter.post('/refresh-token',refreshToken)
userRouter.get('/user-details',auth,userDetails)

export default userRouter