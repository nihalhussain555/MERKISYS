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

const SYSTEM_PROMPT = `
You are the Merkisys website assistant.

Merkisys is a technology, innovation, and digital solutions company that helps businesses transform, modernize, and grow.

Your job is to answer website visitors clearly, professionally, naturally, and concisely.

CRITICAL FORMATTING & STRUCTURE RULES:
1. ALWAYS use bold headers (**Header Name**) on their own dedicated line.
2. NEVER combine headers and body text on the same line.
3. Keep descriptions extremely concise using short bullet points (•) instead of long text blocks.
4. Always put a blank line between section headers, descriptions, and bullet points.

Do NOT use:
- * (italics)
- ## or ### (Markdown titles)
- Markdown tables
- Markdown code blocks
- HTML tags
- Backticks

Use this exact short-point format when explaining Merkisys services:

**About Merkisys**

Merkisys is a digital solutions company helping businesses modernize through end-to-end technology.

**Core Services**

**1. Custom Software & Application Development**
We build tailored software engineered for your specific business requirements.
• Web applications
• Mobile applications
• Enterprise software
• API integrations

**2. Cloud & Infrastructure Services**
We build, migrate, and optimize secure, scalable cloud environments.
• Cloud migration & management
• Secure infrastructure design
• DevOps & automation

**3. Data Analytics & AI/ML**
We transform enterprise data into actionable insights and automation.
• Advanced analytics & insights
• Machine learning models
• AI & intelligent automation

**4. Digital Strategy & Consulting**
We craft clear technology roadmaps aligned with business growth goals.
• Digital transformation strategies
• Technology consulting
• Product strategy & roadmaps

**5. Cybersecurity & Compliance**
We protect critical systems, applications, and corporate data.
• Security & risk assessments
• Data protection & compliance support

**Why Choose Merkisys?**

• Tailored, modern technology solutions
• Scalable, enterprise-grade security
• Data-driven decision making
• End-to-end continuous support

TONE:
Friendly, professional, concise, and direct.
`;

/**
 * Light, general-purpose cleanup of the model's Markdown-lite output.
 * (The previous version also force-wrapped a hard-coded list of exact
 * phrases like "About Merkisys" in **bold** via regex — that was removed
 * because it was brittle (broke on any slight rewording) and unnecessary
 * once the frontend properly renders **bold** and line breaks itself.)
 */
function cleanAgentResponse(text) {
    if (!text) return "";

    let cleaned = text;

    // Convert standard Markdown h1-h6 headers into clean bold lines (**Header**)
    cleaned = cleaned.replace(/^#{1,6}\s*(.+)$/gm, "**$1**");

    // Collapse duplicate/triple bold markers down to exactly **
    cleaned = cleaned.replace(/\*\*\s*\*\*/g, "");
    cleaned = cleaned.replace(/\*\*+/g, "**");

    // Format numbered list titles ("1. Something") as separate bold lines
    cleaned = cleaned.replace(/(\n|^)(\d+\.\s*)([^\n•]+)(\n|$)/g, "$1**$2$3**$4");

    // Remove code fences / inline backticks (model is told not to use them, but just in case)
    cleaned = cleaned.replace(/```[\s\S]*?```/g, "");
    cleaned = cleaned.replace(/`([^`]+)`/g, "$1");

    // Strip single-star/underscore italics WITHOUT touching **bold** or __bold__.
    // Negative look-behind/ahead on '*' or '_' ensures doubled markers are left alone.
    cleaned = cleaned.replace(/(?<!\*)\*(?!\*)([^*\n]+?)(?<!\*)\*(?!\*)/g, "$1");
    cleaned = cleaned.replace(/(?<!_)_(?!_)([^_\n]+?)(?<!_)_(?!_)/g, "$1");

    // Standardize bullet points into neat uniform bullets, each on its own line
    cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, "• ");
    cleaned = cleaned.replace(/(?<!\n)\s*•\s*/g, "\n• ");

    // Remove excessive blank spaces/newlines
    cleaned = cleaned.replace(/[ \t]+/g, " ");
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

    return cleaned.trim();
}

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
                temperature: 0.5,
                max_tokens: 512
            })
        });

        if (!groqResponse.ok) {
            const errText = await groqResponse.text();
            console.error("Groq API error:", groqResponse.status, errText);
            return res.status(502).json({ error: "Groq API request failed." });
        }

        const data = await groqResponse.json();
        const rawReply = data.choices?.[0]?.message?.content?.trim()
            || "Sorry, I couldn't generate a response.";

        // Format and clean text structure before sending to frontend
        const reply = cleanAgentResponse(rawReply);

        res.json({ reply });

    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ error: "Something went wrong on the server." });
    }
});

app.listen(PORT, () => {
    console.log(`Merkisys server running at http://localhost:${PORT}`);
});