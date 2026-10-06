// OpenAI-compatible chat completions client.
// Provider is picked from the key prefix: "xai-" → xAI Grok, "gsk_" → Groq.
const PROVIDERS = {
    xai: {
        url: "https://api.x.ai/v1/chat/completions",
        model: "grok-4.20-non-reasoning"
    },
    groq: {
        url: "https://api.groq.com/openai/v1/chat/completions",
        model: "llama-3.3-70b-versatile"
    }
}

const getProvider = (apiKey) => {
    if (apiKey.startsWith("gsk_")) return PROVIDERS.groq
    return PROVIDERS.xai
}

export const generateAIResponse = async (prompt) => {

    try {
        const apiKey = process.env.GROK_API_KEY
        if (!apiKey) {
            throw new Error("GROK_API_KEY is not set in .env file")
        }

        const provider = getProvider(apiKey)

        const response = await fetch(provider.url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: process.env.AI_MODEL || provider.model,
                messages: [
                    {
                        role: "system",
                        content: "You are a strict JSON generator. Respond with a single valid JSON object only."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7
            })
        })

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`${response.status} ${err}`);
        }

        const data = await response.json()

        const text = data.choices?.[0]?.message?.content;

        if (!text) {
            throw new Error("No text returned from AI");
        }

        const cleanText = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleanText);

    } catch (error) {
        console.error("AI Fetch Error:", error.message);
        throw new Error("AI API fetch failed");
    }

}
