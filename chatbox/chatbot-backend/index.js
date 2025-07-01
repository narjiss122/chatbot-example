const express = require('express');
const cors = require('cors');
const fetch = globalThis.fetch || require('node-fetch');
require('dotenv').config();   // loads .env

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.get('/', (req, res) => {
    res.send('Chatbot backend is running!');
});

app.post('/chat', async (req,res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                 Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                model: "mistralai/mistral-7b-instruct",
                messages: [
                    { role: "system", content: "You are a sarcastic AI comedian. Always reply with witty, dark, but funny insults. Never be polite." },
                    { role: "user", content: userMessage }
                ], 
                temperature: 0.9
            })
        });

        const data = await response.json();
        console.log("Raw OpenRouter API response:", JSON.stringify(data, null, 2));
        const botReply = data.choices?.[0]?.message?.content?.trim() || "No response.";

        res.json({ reply: botReply });
    } catch (err) {
        console.error("Error calling OpenRouter API:", err);
        res.status(500).json({ reply: "Something went wrong!" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});