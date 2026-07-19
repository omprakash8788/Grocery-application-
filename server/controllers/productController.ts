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

// 27 - Get product
// GET /api/products/:id
export const getProduct = async (req: Request, res: Response) => {
    const product = await prisma.product.findUnique({ where: { id: req.params.id as string} })
    if (!product) {
        res.status(404).json({ message: "Product not found" })
        return;
    }
    const discount = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

    res.json({ product: { ...product, discount } })

}

// 28
// POST /api/products

export const createProduct = async (req: Request, res: Response) => {
    //  First get the data from req body
    const product = await prisma.product.create({data:req.body})
    // After that send the response
    res.status(201).json({product})
    // Note - uploading images we need separate controller function
}

// 29. 
// POST /api/producs/:id
export const updateProduct = async (req: Request, res: Response) => {
   
    const product = await prisma.product.update({where:{id:req.params.id as string}, data:req.body})
    // After that send the response
    res.json({product})
   
}

// 30. 
// Delete /api/producs/:id
export const deleteProduct = async (req: Request, res: Response) => {
   
    await prisma.product.delete({where:{id:req.params.id as string}})
    // After that send the response
    res.json({message:"Product Deleted"})
   
}
