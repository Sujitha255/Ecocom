"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const router = (0, express_1.Router)();
router.post('/', product_controller_1.ProductController.createProduct);
router.get('/', product_controller_1.ProductController.getProducts);
router.get('/:id', product_controller_1.ProductController.getProductById);
exports.default = router;
