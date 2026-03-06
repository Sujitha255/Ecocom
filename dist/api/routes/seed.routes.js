"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../../config/db"));
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    try {
        console.log('Seeding database via API...');
        // Clean existing data
        await db_1.default.proposalProduct.deleteMany();
        await db_1.default.proposal.deleteMany();
        await db_1.default.orderItem.deleteMany();
        await db_1.default.impactReport.deleteMany();
        await db_1.default.order.deleteMany();
        await db_1.default.productTag.deleteMany();
        await db_1.default.sustainabilityFilter.deleteMany();
        await db_1.default.product.deleteMany();
        await db_1.default.user.deleteMany();
        // Create Users
        await db_1.default.user.create({
            data: {
                email: 'admin@ecosaas.com',
                password: 'password123',
                role: 'ADMIN',
                company: 'EcoSaaS Corp',
            },
        });
        // Create Products
        const products = [
            {
                name: 'Bamboo Coffee Cup (Bulk)',
                description: 'Durable, reusable coffee cups made from 100% organic bamboo fiber.',
                sku: 'ECO-CUP-001',
                price: 12.50,
                stock: 500,
                category: 'Serviceware',
                subCategory: 'Cups',
                plasticWeight: 0,
                carbonFootprint: 0.15,
                tags: ['Reusable', 'Biodegradable', 'BPA-Free'],
            },
            {
                name: 'Recycled Paper Straws (1000ct)',
                description: 'High-quality paper straws that don\'t get soggy.',
                sku: 'ECO-STR-002',
                price: 45.00,
                stock: 200,
                category: 'Disposables',
                subCategory: 'Straws',
                plasticWeight: 0,
                carbonFootprint: 0.05,
                tags: ['Recyclable', 'Compostable'],
            },
            {
                name: 'Cornstarch Takeout Containers',
                description: 'Heat-resistant takeaway boxes made from cornstarch (PLA).',
                sku: 'ECO-CONT-003',
                price: 0.85,
                stock: 5000,
                category: 'Packaging',
                subCategory: 'Containers',
                plasticWeight: 0,
                carbonFootprint: 0.22,
                tags: ['Compostable', 'Corn-based'],
            }
        ];
        for (const p of products) {
            const { tags, ...productData } = p;
            await db_1.default.product.create({
                data: {
                    ...productData,
                    tags: {
                        create: tags.map(tag => ({ name: tag }))
                    }
                }
            });
        }
        res.status(200).json({ status: 'Success', message: 'Database seeded successfully' });
    }
    catch (error) {
        console.error('Seeding error:', error);
        res.status(500).json({ error: 'Seeding failed', message: error.message });
    }
});
exports.default = router;
