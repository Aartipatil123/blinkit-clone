const verifyEmailTemplates = ({ name, url }) => {
    return `
    <div style="font-family: Arial; padding: 20px;">
        <h2>Welcome to Binkeyit 🎉</h2>
        
        <p>Hello ${name},</p>
        <p>Thank you for registering. Please verify your email.</p>

        <a href="${url}" 
           style="color: white; background: blue; padding: 10px; text-decoration: none; display: inline-block; margin-top: 10px;">
           Verify Email
        </a>
    </div>
    `
}

export default verifyEmailTemplates