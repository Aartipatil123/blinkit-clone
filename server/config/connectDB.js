import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const Connection = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING)
        console.log("DB connection successfully Done....")
        console.log(mongoose.connection.readyState)
    } catch (err) {
        console.log("Db Connection Failed...", err)
    }
}

export default Connection