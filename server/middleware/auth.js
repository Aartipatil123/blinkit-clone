import jwt from "jsonwebtoken"

const auth = (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.headers?.authorization?.split(" ")[1]

        console.log("Token:", token)

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No Token",
                error: true,
                success: false
            })
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorised access",
                error: true,
                success: false
            })
        }

        // ✅ FIXED LINE
        req.userId = decoded._id

        next()

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or Expired Token",
            error: true,
            success: false
        })
    }
}

export default auth