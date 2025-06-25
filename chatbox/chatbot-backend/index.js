const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('🤖 Chatbot backend is running!');
});

app.post('/chat', (req,res) => {
    const userMessage = req.body.message;
    const botReply = `🤖: You said "${userMessage}", that's cool!`;
    res.json({ reply: botReply });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});