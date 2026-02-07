import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBKOor25LpCXUVwnccHXxOn_DsBqfOAyw4";
const genAI = new GoogleGenerativeAI(apiKey);

async function testModels() {
    const modelsToTest = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-1.5-pro-latest",
        "gemini-pro"
    ];

    console.log("Testing models...");

    for (const modelName of modelsToTest) {
        console.log(`\n--- Testing ${modelName} ---`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say hello");
            const response = await result.response;
            console.log(`SUCCESS: ${modelName} responded: ${response.text()}`);
        } catch (error) {
            console.log(`FAILED: ${modelName} - ${error.message}`);
        }
    }
}

testModels();
