import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import helmet from "helmet"

import Connection from "./config/connectDB.js"
import userRouter from "./route/user.route.js"
import categoryRouter from "./route/category.routes.js"
import uploadRouter from "./route/upload.router.js"
import subCategoryRouter from "./route/subCategory.routes.js"
import productRouter from "./route/product.route.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

/* CORS Configuration */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
)

/* Middlewares */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan("dev"))

/* Helmet Safe Config */
app.use(
  helmet({
    crossOriginEmbedderPolicy: false
  })
)

/* Test Route */
app.get("/", (req, res) => {
  res.json({
    message: "Server is running"
  })
})

/* API Routes */
app.use("/api/user", userRouter)
app.use("/api/category", categoryRouter)
app.use("/api/file", uploadRouter) 
app.use("/api/subcategory",subCategoryRouter)
app.use("/api/product",productRouter)

/* Database Connection */
Connection()

/* Server Start */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})