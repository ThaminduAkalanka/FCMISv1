import express from "express";
import cors from 'cors'
import { adminRouter } from "./routes/AdminRoutes.js";
import { MemberRouter } from "./routes/MemberRoutes.js";
import { TrainerRouter } from "./routes/TrainerRoutes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";


const app = express()
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(express.json())
app.use(express.static('public'))
app.use('/auth', adminRouter)
app.use('/mem', MemberRouter)
app.use('/train', TrainerRouter)
app.use(bodyParser.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log("Server is running")
})

