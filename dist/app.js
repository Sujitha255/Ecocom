"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const ai_routes_1 = __importDefault(require("./api/routes/ai.routes"));
const product_routes_1 = __importDefault(require("./api/routes/product.routes"));
const seed_routes_1 = __importDefault(require("./api/routes/seed.routes"));
// Initialize express app
const app = (0, express_1.default)();
// Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/v1/ai', ai_routes_1.default);
app.use('/api/v1/products', product_routes_1.default);
app.use('/api/v1/seed', seed_routes_1.default);
// Basic health check route
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Sustainable Commerce Platform API is running.' });
});
// Import and use module routes here...
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});
exports.default = app;
