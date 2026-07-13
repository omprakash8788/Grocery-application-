import "dotenv/config"
import express from "express"

import cors from "cors"
import authRouter from "./routes/authRoutes.js";

const app = express();

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3000

app.get('/', (re, res)=>{
    res.send("Server is Live")
})

//23 Register phase
app.use('/api/auth', authRouter)

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})