import jwt from 'jsonwebtoken'

const generatedAccessToken = (userId) => {
    return jwt.sign(
        { _id: userId },   // ✅ keep same everywhere
        process.env.SECRET_KEY_ACCESS_TOKEN,
        { expiresIn: '15m' }  // ✅ better practice
    )
}

export default generatedAccessToken