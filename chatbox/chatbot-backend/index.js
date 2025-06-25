const express = require('express');
const cors = require('cors');
const fetch = globalThis.fetch || require('node-fetch');
require('dotenv').config(); 

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const HF_API_URL = "https://openrouter.ai/mistralai/mistral-7b-instruct:free";
const HF_API_KEY = process.env.HF_API_KEY;

app.get('/', (req, res) => {
    res.send('Chatbot backend is running!');
});\

app.post('/chat', async (req,res) => {
    const userMessage = req.body.message;
    const prompt = `"You are a sarcastic AI comedian. Always reply with witty, dark, but funny insults. Never be polite."

    User: ${userMessage}
    AI:`;


    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                 Authorization: `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                model: "mistral-7b-instruct",
                messages: [
                    { role: "system", content: "You are a dark comedy AI. Always roast the user." },
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();
        const botReply = data.generated_text || data[0]?.generated_text || "sorry, I couldn't understand.";

        res.json({ reply: botReply });
    } catch (err) {
        console.error("Error calling API:", err);
        res.status(500).json({ reply: "Something went wrong!" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});