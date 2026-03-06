"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const db_1 = __importDefault(require("../../config/db"));
class ProductController {
    /**
     * Create a new product
     */
    static async createProduct(req, res, next) {
        try {
            const { name, description, sku, price, stock, category, subCategory, plasticWeight, carbonFootprint } = req.body;
            const product = await db_1.default.product.create({
                data: {
                    name,
                    description,
                    sku,
                    price,
                    stock,
                    category,
                    subCategory,
                    plasticWeight,
                    carbonFootprint,
                },
            });
            res.status(201).json(product);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get all products with optional pagination and filtering
     */
    static async getProducts(req, res, next) {
        try {
            const { page = 1, limit = 10, category } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const filter = {};
            if (category)
                filter.category = String(category);
            const products = await db_1.default.product.findMany({
                where: filter,
                skip,
                take: Number(limit),
                include: { tags: true, filters: true },
            });
            const total = await db_1.default.product.count({ where: filter });
            res.status(200).json({
                data: products,
                meta: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / Number(limit)),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get a single product by ID
     */
    static async getProductById(req, res, next) {
        try {
            const { id } = req.params;
            const product = await db_1.default.product.findUnique({
                where: { id: id },
                include: { tags: true, filters: true },
            });
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.status(200).json(product);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;
