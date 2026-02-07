import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

const apiKey = "AIzaSyBKOor25LpCXUVwnccHXxOn_DsBqfOAyw4";
const genAI = new GoogleGenerativeAI(apiKey);

async function testModels() {
    const modelsToTest = [
        "gemini-1.5-flash",
        "gemini-pro"
    ];

    let output = "";

    console.log("Testing models...");

    for (const modelName of modelsToTest) {
        const msg = `\n--- Testing ${modelName} ---`;
        console.log(msg);
        output += msg + "\n";
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say hello");
            const response = await result.response;
            const successMsg = `SUCCESS: ${modelName} responded: ${response.text()}`;
            console.log(successMsg);
            output += successMsg + "\n";
        } catch (error) {
            const errorMsg = `FAILED: ${modelName} - ${error.message}`;
            console.log(errorMsg);
            output += errorMsg + "\n";
        }
    }

    fs.writeFileSync('output.txt', output);
}

testModels();
