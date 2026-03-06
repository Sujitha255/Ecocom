"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
class AIService {
    /**
     * 1. AI Auto Category & Tag Generator
     */
    static async categorizeProduct(productName, productDescription) {
        const prompt = `You are an expert e-commerce catalog taxonomist specializing in sustainable products.
Categorize the given product, suggest exactly 5-10 SEO tags, and extract relevant sustainability filters (e.g., Plastic-Free, Vegan, Biodegradable).
Product Name: ${productName}
Product Description: ${productDescription}

You MUST respond in JSON format with strictly these keys:
- category (string)
- subCategory (string)
- seoTags (array of strings)
- sustainabilityFilters (array of strings)`;
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'system', content: prompt }],
            response_format: { type: 'json_object' },
        });
        return JSON.parse(response.choices[0].message.content || '{}');
    }
    /**
     * 2. AI B2B Proposal Generator
     */
    static async generateB2BProposal(clientProfile, budget, catalogJson) {
        const prompt = `You are a B2B sales automation AI for a sustainable commerce platform.
Given a client profile, requirements, and budget, recommend a product mix from our catalog.
Allocate the budget logically. Generate a 'sustainability impact positioning' paragraph that the sales team can use to pitch this to the client.

Client Profile: ${clientProfile}
Budget: $${budget}
Available Catalog: ${catalogJson}

You MUST respond in JSON format with strictly these keys:
- recommendedProducts (array of { productId: string, quantity: number, allocatedBudget: number })
- impactPositioningText (string)`;
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'system', content: prompt }],
            response_format: { type: 'json_object' },
        });
        return JSON.parse(response.choices[0].message.content || '{}');
    }
    /**
     * 3. AI Impact Reporting Generator
     */
    static async generateImpactReport(plasticSavedKg, carbonAvoidedKg) {
        const prompt = `You are a corporate sustainability writer. 
Given the backend calculated data:
- Plastic Saved: ${plasticSavedKg} kg
- Carbon Avoided: ${carbonAvoidedKg} kg CO2e

Write a 3-paragraph, empowering, and professional sustainability impact report for the B2B client. Acknowledge their positive environmental footprint.

You MUST respond in JSON format with strictly this key:
- humanReadableReport (string)`;
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'system', content: prompt }],
            response_format: { type: 'json_object' },
        });
        return JSON.parse(response.choices[0].message.content || '{}');
    }
    /**
     * 4. AI WhatsApp Support Bot
     */
    static async generateSupportReply(userMessage, contextJson) {
        const prompt = `You are a customer support AI for a sustainable brand.
You have access to user order database context provided below in JSON format.
Be concise, polite, and helpful. If a user asks a complex policy question not in your context, or if they are angry, you MUST respond setting the escalateToHuman flag to true.

User Message: "${userMessage}"
Context: ${contextJson}

You MUST respond in JSON format with strictly these keys:
- replyMessage (string, formatted for WhatsApp)
- escalateToHuman (boolean)`;
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'system', content: prompt }],
            response_format: { type: 'json_object' },
        });
        return JSON.parse(response.choices[0].message.content || '{}');
    }
}
exports.AIService = AIService;
