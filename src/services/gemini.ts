const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

type DreamAnalysis = {
    interpretation: string;
    mood: string;
    tags: string[];
};

export async function generateDreamProse(content: string): Promise<string> {
    if (!API_KEY) throw new Error('Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.');

    const prompt = `Rewrite the following dream as a beautifully written, immersive short story or prose. Keep it in the first person. 
  
  Dream: "${content}"`;

    // Using Gemini 1.5 Pro for high-quality creative writing
    const response = await fetch(`${BASE_URL}/gemini-1.5-pro:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.8, // Slightly creative
                maxOutputTokens: 1000,
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate prose');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "The scroll is blank...";
}

export async function analyzeDream(content: string): Promise<DreamAnalysis> {
    if (!API_KEY) throw new Error('Gemini API Key is missing');

    const prompt = `Analyze this dream. Return ONLY a JSON object with these fields:
  1. "interpretation" (a deep, mystical 1-2 sentence meaning)
  2. "mood" (a single word like Serene, Ominous, Melancholic)
  3. "tags" (array of 3 short keywords)

  Dream: "${content}"`;

    // Using Gemini 1.5 Flash for speed and efficiency
    const response = await fetch(`${BASE_URL}/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.3, // Deterministic for analysis
            }
        })
    });

    if (!response.ok) throw new Error('Failed to analyze dream');

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse Gemini response:", text);
        return {
            interpretation: "The mists obscure the meaning...",
            mood: "Unknown",
            tags: ["Mystery"]
        };
    }
}
