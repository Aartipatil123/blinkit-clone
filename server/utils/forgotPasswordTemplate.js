const forgotPasswordTemplate = ({ name, otp }) => {
    return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        
        <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            
            <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
            
            <p style="color: #555;">Dear <b>${name}</b>,</p>
            
            <p style="color: #555;">
                You requested a password reset. Please use the OTP below to reset your password.
            </p>

            <div style="text-align: center; margin: 20px 0;">
                <span style="display: inline-block; padding: 12px 20px; font-size: 22px; font-weight: bold; color: #ffffff; background: #007bff; border-radius: 8px; letter-spacing: 3px;">
                    ${otp}
                </span>
            </div>

            <p style="color: #777; font-size: 14px;">
                This OTP is valid for <b>1 hour</b>. Please do not share it with anyone.
            </p>

            <p style="color: #555;">
                Enter this OTP in the <b>Binkeyit</b> website to proceed with resetting your password.
            </p>

            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />

            <p style="color: #555;">Thanks & Regards,</p>
            <p style="font-weight: bold; color: #333;">Team Binkeyit</p>

        </div>
    </div>
    `
}
export default forgotPasswordTemplate