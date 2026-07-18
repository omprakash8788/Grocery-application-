import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";


//25
// GET /api/products/flash-deals
export const getFlashDeals = async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
        where: {
            stock: { gt: 0, }
        },
        orderBy: {
            originalPrice: "desc"
        }

    })
    // Find products with discount
    const productsWithDiscount = products.map((p: any) => {
        const discount = p.originalPrice && p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0
        return { ...p, discount }
    })
    // After tht send the resp
    res.json({ products: productsWithDiscount.slice(0, 8) })
}

// 26
// GET /api/products

export const getProducts = async (req: Request, res: Response) => {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    const where: any = {}
    if (category && category !== "all") where.category = category as string;
    if (search) where.name = { contains: search as string, mode: "insensitive" };
    if (minPrice || maxPrice) {
        if (minPrice) where.price.gte = Number(minPrice)
        if (maxPrice) where.price.lte = Number(maxPrice)

    }
    const orderBy: any = {};
    if (sort === "price-low") orderBy.price = "asc"
    else if (sort === "price-high") orderBy.price = "desc"
    else orderBy.createAt = 'desc'

    // Next find the product
    const products = await prisma.product.findMany({ where, orderBy })

    const productsWithDiscount = products.map((p: any) => {
        const discount = p.originalPrice && p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0
        return { ...p, discount }
    })
    //    After that send the response
    res.json({ products: productsWithDiscount })
}