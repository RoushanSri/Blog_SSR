import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import blogRoutes from "./routes/blog.routes.js"
import userRoutes from "./routes/user.routes.js"
import viewRoutes from "./routes/view.routes.js"
import injectUser from "./middlewares/injectUser.js"
import { connectDB } from "./config/db.js"

const app = express()

app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/auth", authRoutes)
app.use("/admin", adminRoutes)
app.use("/blog", blogRoutes)
app.use("/user", userRoutes)

app.set("view engine", "ejs")
app.use(express.static("public"))

app.use("/", injectUser, viewRoutes)


app.listen(process.env.PORT, () => {
    connectDB()
    console.log(`Server started on port ${process.env.PORT}`)
})