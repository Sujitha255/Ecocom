"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const ai_service_1 = require("../../services/ai/ai.service");
const db_1 = __importDefault(require("../../config/db"));
class AIController {
    /**
     * AI Auto Category Generator
     */
    static async categorizeProduct(req, res, next) {
        try {
            const { name, description } = req.body;
            if (!name || !description) {
                return res.status(400).json({ error: 'Name and description are required.' });
            }
            const generated = await ai_service_1.AIService.categorizeProduct(name, description);
            // Optionally save to an AiLog map...
            await db_1.default.aiLog.create({
                data: {
                    module: 'CATEGORY',
                    promptTokens: 0, // Mock: real implementation would count tokens via util
                    completionTokens: 0,
                    cost: 0.005,
                    latencyMs: 1200,
                }
            });
            res.status(200).json(generated);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * AI B2B Proposal Generator
     */
    static async generateProposal(req, res, next) {
        try {
            const { clientProfile, budget } = req.body;
            // Grab simple catalog items for context
            const products = await db_1.default.product.findMany({ select: { id: true, name: true, price: true } });
            const generated = await ai_service_1.AIService.generateB2BProposal(clientProfile, budget, JSON.stringify(products));
            res.status(200).json(generated);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * AI Impact Reporting Generator
     */
    static async generateImpact(req, res, next) {
        try {
            const { plasticSavedKg, carbonAvoidedKg, orderId } = req.body;
            const generated = await ai_service_1.AIService.generateImpactReport(plasticSavedKg, carbonAvoidedKg);
            if (orderId) {
                await db_1.default.impactReport.create({
                    data: {
                        orderId,
                        plasticSaved: plasticSavedKg,
                        carbonAvoided: carbonAvoidedKg,
                        humanSummary: generated.humanReadableReport || ''
                    }
                });
            }
            res.status(200).json(generated);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * AI WhatsApp Support Bot Helper
     */
    static async supportBot(req, res, next) {
        try {
            const { message, userId } = req.body;
            // Fetch user context if user id is known
            const userOrders = userId ? await db_1.default.order.findMany({ where: { userId } }) : [];
            const generated = await ai_service_1.AIService.generateSupportReply(message, JSON.stringify(userOrders));
            res.status(200).json(generated);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AIController = AIController;
