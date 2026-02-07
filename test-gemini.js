const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // There isn't a direct listModels on the client usually available in simple docs, 
        // but we can try a basic generation to verify specific model names if we fail to list.
        // Actually, looking at docs, there isn't a simple "listModels" helper in the high-level SDK 
        // without using the model manager or REST.
        // Let's try to specific known working models.

        console.log("Trying gemini-1.5-flash...");
        try {
            const result = await model.generateContent("Hello");
            console.log("gemini-1.5-flash worked:", result.response.text());
            return;
        } catch (e) {
            console.error("gemini-1.5-flash failed:", e.message);
        }

        console.log("Trying gemini-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        try {
            const result = await modelPro.generateContent("Hello");
            console.log("gemini-pro worked:", result.response.text());
            return;
        } catch (e) {
            console.error("gemini-pro failed:", e.message);
        }

        console.log("Trying gemini-1.5-pro...");
        const model15Pro = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        try {
            const result = await model15Pro.generateContent("Hello");
            console.log("gemini-1.5-pro worked:", result.response.text());
            return;
        } catch (e) {
            console.error("gemini-1.5-pro failed:", e.message);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
