import "dotenv/config"
import express, { NextFunction, Request, Response } from "express"

import cors from "cors"
import authRouter from "./routes/authRoutes.js";

const app = express();

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3000

app.get('/', (req:Request, res:Response)=>{
    res.send("Server is Live")
})

//23 Register phase
app.use('/api/auth', authRouter)

// 24 Error handling - This function catch any error in all routes and controller function
app.use((error:any ,req:Request, res:Response, next:NextFunction)=>{
  console.log(error(error))
  res.status(500).json({message:error.message})
})


app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})