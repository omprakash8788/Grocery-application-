import express from 'express'
import { login, register } from '../controllers/authController.js';

//20 Instance for Router
const authRouter = express.Router();


// 21 - API communication address
authRouter.post('/register', register)
authRouter.post('/login', login)

// 22. Export authRouter
export default authRouter;
