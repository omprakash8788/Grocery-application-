import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

// 8. generate token -You will get token signature
const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "7d" })
}

// 11.a - Check if user is admin
const getAdminStatus = (email: string | null | undefined): boolean => {
    if (!email) {
        return false
    }
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase()) : []

    return adminEmails.includes(email.toLowerCase())
    // It will return true or false
}


// Register
// POST - /api/auth/register

export const register = async (req: Request, res: Response) => {
    // 1- get data from request body
    // While register we need name, email, pass
    const { name, email, password } = req.body;

    //2 Add check ask user to add all these fields
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide all fields" })
    }
    //3. Check the existing user-if already exist or not
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

    // 4. 
    if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" })
    }
    // 5.If no existing user then incrpyt the pass
    const hashPassword = await bcrypt.hash(password, 10)
    // 6. After that create data in database [use [user] data to create new user in database]
    const user = await prisma.user.create({
        data: { name, email: email.toLowerCase(), password: hashPassword }
    })
    // 7. After that we have to return a token for authentication
    const token = generateToken(user.id) // using this id it will generate unique token
    // 10. After that send user response
    const userData: any = { ...user };
    // and exclude the password
    delete userData.password; // password property removed from the userData

    // 11. After that check user data is admin or not
    userData.isAdmin = getAdminStatus(userData.email)
    // After that send data as response
    res.status(201).json({user:userData, token})

}

// Login
// POST - /api/auth/login
export const login = async (req: Request, res: Response) => {
    // 12- get data from request body
    // While login we need email, pass
    const {email, password } = req.body;

    //13 Add check ask user to add all these fields
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" })
    }
    //14. find user from db
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() }, include:{addresses:true} })

    // 15. 
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" })
    }
    // 16- If data aval on provided email id then match the pass
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.status(401).json({ message: "Invalid email or password" })
    }

    // 17. After that we need to generate token
    const token = generateToken(user.id) // using this id it will generate unique token
    // 18. After that send user response
    const userData: any = { ...user };
    // and exclude the password
    delete userData.password; // password property removed from the userData

    // 19. After that check user data is admin or not
    userData.isAdmin = getAdminStatus(userData.email)
    // After that send data as response
    res.json({user:userData, token})

}