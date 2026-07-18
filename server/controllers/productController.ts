import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";


//25
// GET /api/products/flash-deals
export const getFlashDeals = async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
        where: {
            stock: { gt: 0, }
        },
        orderBy:{
            originalPrice:"desc"
        }

    })
    // Find products with discount
    const productsWithDiscount = products.map((p:any)=>{
      const discount = p.originalPrice && p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0
      return {...p, discount}
    })
    // After tht send the resp
    res.json({products:productsWithDiscount.slice(0,8)})
}