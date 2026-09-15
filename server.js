/**
 * MERKISYS – AI Agent backend
 * ---------------------------
 * Tiny Express server that:
 *  1. Serves the static website (index.html, style.css, script.js, assets)
 *  2. Exposes POST /api/chat, which forwards the conversation to Groq
 *     using the GROQ_API_KEY stored in .env
 *
 * The API key NEVER reaches the browser — it is only used here, server-side.
 */

require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const SYSTEM_PROMPT = `You are the Merkisys website assistant. Merkisys is a
technology, innovation and digital solutions company. Answer visitor
questions helpfully and concisely, and speak positively about Merkisys'
services when relevant. If you don't know something specific about the
company, say so honestly instead of making details up.`;

app.post("/api/chat", async (req, res) => {
    try {
        if (!GROQ_API_KEY) {
            return res.status(500).json({
                error: "Missing GROQ_API_KEY. Add it to your .env file and restart the server."
            });
        }

        const { messages } = req.body;

        if (!Array.isArray(messages)) {
            return res.status(400).json({ error: "messages must be an array" });
        }

        const groqResponse = await fetch(GROQ_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 512
            })
        });

        if (!groqResponse.ok) {
            const errText = await groqResponse.text();
            console.error("Groq API error:", groqResponse.status, errText);
            return res.status(502).json({ error: "Groq API request failed." });
        }

        const data = await groqResponse.json();
        const reply = data.choices?.[0]?.message?.content?.trim()
            || "Sorry, I couldn't generate a response.";

        res.json({ reply });

    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Something went wrong on the server." });
    }
});

app.listen(PORT, () => {
    console.log(`Merkisys server running at http://localhost:${PORT}`);
});
