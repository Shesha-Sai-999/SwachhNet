const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent";

app.post('/api/chat', async (req, res) => {
    try {
        const { userMessage } = req.body;
        if (!userMessage || typeof userMessage !== 'string') {
            return res.status(400).json({ error: 'Invalid input: userMessage must be a string' });
        }

        const payload = {
            contents: [{ role: "user", parts: [{ text: userMessage }] }],
            generationConfig: { temperature: 0.9, topP: 0.95, topK: 40 }
        };

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Missing GEMINI_API_KEY in environment variables");
        }

        const response = await fetch(`${GEMINI_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok || data.error) {
            return res.status(500).json({ error: data.error?.message || "Gemini API error", details: data });
        }

        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        res.json({ response: responseText });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
});

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const base64Image = req.file.buffer.toString('base64');
        const payload = {
            contents: [{
                role: "user",
                parts: [
                    { text: "Analyze this image for waste types and approximate quantity." },
                    { inline_data: { mime_type: req.file.mimetype, data: base64Image } }
                ]
            }]
        };

        const response = await fetch(`${GEMINI_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok || data.error) {
            return res.status(500).json({ error: data.error?.message || "Gemini API error", details: data });
        }

        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No description available";
        res.json({ description: responseText });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
