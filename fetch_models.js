const fs = require('fs');

async function listModels() {
    const apiKey = "AIzaSyBKOor25LpCXUVwnccHXxOn_DsBqfOAyw4";
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Models:", JSON.stringify(data, null, 2));
        fs.writeFileSync('models_list.json', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error fetching models:", error);
        fs.writeFileSync('models_error.txt', error.toString());
    }
}

listModels();
