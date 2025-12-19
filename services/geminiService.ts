import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { UserProfile, ChatMessage, Archetype, Egotend, Highertend } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MTypeSystemInstruction = `You are "Mi", an AI assistant integrated into the MiType+ Cognitive OS. Your purpose is to help users understand themselves through the MiType+ framework. You MUST adhere to the following rules:
1.  **Analyze Data:** When given assessment data, analyze it strictly within the MiType+ framework provided in user prompts.
2.  **Generate Profiles:** Create user profiles (Base Archetype, Egotend, Highertend) based on the analysis.
3.  **Chat Support:** When chatting, use the user's provided profile data to give contextual, supportive, and insightful advice.
4.  **Tone:** Your tone is empathetic, insightful, and slightly futuristic, like a calm OS assistant.
5.  **Output Format:** Always respond in the requested JSON format when asked. For chat, respond in clear, concise markdown.`;

export async function analyzeMTra(answers: { [key: number]: number }): Promise<any> {
    const prompt = `Analyze the following 20 MTra (MiType Threshold Reaction) assessment answers to determine the user's top 3 CT (Change Threshold) Suppressors and their overall Change Threshold level. The answers are on a 1-5 scale (1=Strongly Disagree, 5=Strongly Agree).

    Answers: ${JSON.stringify(answers, null, 2)}

    **Framework for Analysis:**
    - Questions 1-5: Emotional Regulation (Higher scores = higher threshold)
    - Questions 6-10: Cognitive Flexibility (Higher scores = higher threshold)
    - Questions 11-15: Stress Response (Higher scores = lower threshold)
    - Questions 16-20: Pattern Rigidity (Higher scores = lower threshold)

    An overall high score in regulation/flexibility and low score in stress/rigidity suggests a "High" Change Threshold. The opposite suggests a "Low" threshold. A mix suggests "Moderate".

    **Common Suppressors:** "Analysis Paralysis", "Conflict Aversion", "Perfectionism", "Emotional Reactivity", "Rigid Thinking", "Impatience", "Avoidance", "Catastrophizing". Identify the top 3 based on patterns in high-scoring stress/rigidity questions.

    Return a JSON object with this exact structure: { "changeThreshold": "High" | "Moderate" | "Low", "ctSuppressors": ["Suppressor 1", "Suppressor 2", "Suppressor 3"] }`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            systemInstruction: MTypeSystemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    changeThreshold: { type: Type.STRING },
                    ctSuppressors: { 
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            },
        }
    });

    return JSON.parse(response.text);
}

export async function analyzeHbdiForSummary(answers: { [key: number]: string }): Promise<string> {
    const prompt = `Based on the following HBDI assessment answers, provide a brief (2-3 sentences) summary of the user's dominant cognitive preference.
    (A=Blue/Analytical, B=Green/Practical, C=Red/Relational, D=Yellow/Conceptual).
    Answers: ${JSON.stringify(answers, null, 2)}
    
    Example summary: "Your answers suggest a strong preference for the conceptual and relational quadrants, indicating you are an imaginative and people-oriented thinker."`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction: MTypeSystemInstruction }
    });
    
    return response.text;
}

export async function analyzeMbtiForSummary(answers: { [key: number]: string }): Promise<{ mbtiType: string, summary: string }> {
     const prompt = `Analyze the following MBTI assessment answers to determine the user's 4-letter MBTI type and provide a brief (2-3 sentences) summary of this type.
    
    Answers: ${JSON.stringify(answers, null, 2)}
    
    Return a JSON object with this exact structure: { "mbtiType": "XXXX", "summary": "..." }`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            systemInstruction: MTypeSystemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    mbtiType: { type: Type.STRING },
                    summary: { type: Type.STRING }
                },
                required: ["mbtiType", "summary"]
            }
        }
    });
    
    return JSON.parse(response.text);
}


export async function generateFullProfileFromAssessments(
    mtraResults: { changeThreshold: string; ctSuppressors: string[] },
    hbdiAnswers: { [key: number]: string },
    mbtiAnswers: { [key: number]: string }
): Promise<{ baseArchetype: Archetype, egotend: Egotend, highertend: Highertend }> {

    const twentyFourArchetypes = [
        "Imaginative Explorer",
        "Transformational Leader",
        "Innovative Designer",
        "Creative Problem Solver",
        "Visionary Conceptualiser",
        "Passionate Advocate",
        "Dynamic Motivator",
        "Intuitive Strategist",
        "Adaptive Analyst",
        "Logical Innovator",
        "Holistic Integrator",
        "Relationship Builder",
        "Personalised Coach",
        "Expressive Communicator",
        "Methodical Producer",
        "Structured Communicator",
        "Empathetic Supporter",
        "Reliable Executor",
        "Harmonious Facilitator",
        "Systematic Implementer",
        "Strategic Planner",
        "Efficient Analyst",
        "Harmonious Analyst",
        "Detailed Organiser"
    ];

    const prompt = `Synthesize a full MiType+ profile from the user's MTra, HBDI, and MBTI assessment results.

    **1. MTra Results (Change Threshold):**
    ${JSON.stringify(mtraResults, null, 2)}

    **2. HBDI Answers (Cognitive Preference):**
    ${JSON.stringify(hbdiAnswers, null, 2)}
    (A=Blue/Analytical, B=Green/Practical, C=Red/Relational, D=Yellow/Conceptual)

    **3. MBTI Answers (Processing Style):**
    ${JSON.stringify(mbtiAnswers, null, 2)}
    (Analyze tendencies towards Introversion/Extraversion, Sensing/Intuition, Thinking/Feeling, Judging/Perceiving)

    **Task:**
    
    **First, determine the Base Archetype.**
    - Analyze the HBDI and MBTI answers to find the dominant cognitive and processing styles.
    - From the list of 24 Archetypes provided below, select the ONE that best fits the user's profile based on their assessment results. You MUST use one of the names from this list for the "name" field.
    - **List of 24 Archetypes to choose from:** ${JSON.stringify(twentyFourArchetypes)}
    - Define its "coreDrive".
    - Specify the resulting "HBDI" (e.g., "A/D Dominant") and "MBTI" (e.g., "INTJ") types.
    - Set the Archetype's base "CTS" to the user's "changeThreshold" from MTra.
    
    **Second, define the Egotend and Highertend.**
    - The **Egotend** is the negative, stress-state expression of the Base Archetype, triggered by their "ctSuppressors". Name it accordingly (e.g., "The Rigid Micromanager") and list its key "challenges".
    - The **Highertend** is the positive, growth-state expression of the Base Archetype. Name it accordingly (e.g., "The Empowering Architect") and define its "pathToGrowth".

    Return a single JSON object with this exact structure:
    {
        "baseArchetype": { "name": "...", "coreDrive": "...", "HBDI": "...", "MBTI": "...", "CTS": "High" | "Moderate" | "Low" },
        "egotend": { "name": "...", "challenges": ["...", "..."] },
        "highertend": { "name": "...", "pathToGrowth": ["...", "..."] }
    }`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            systemInstruction: MTypeSystemInstruction,
            thinkingConfig: { thinkingBudget: 32768 },
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    baseArchetype: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            coreDrive: { type: Type.STRING },
                            HBDI: { type: Type.STRING },
                            MBTI: { type: Type.STRING },
                            CTS: { type: Type.STRING }
                        },
                        required: ["name", "coreDrive", "HBDI", "MBTI", "CTS"]
                    },
                    egotend: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            challenges: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ["name", "challenges"]
                    },
                    highertend: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            pathToGrowth: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ["name", "pathToGrowth"]
                    }
                }
            },
        }
    });
    
    return JSON.parse(response.text);
}


export async function getChatResponse(history: ChatMessage[], profile: UserProfile): Promise<string> {
    const userProfileContext = `This user's current MiType+ profile is:
    - Base Archetype: ${profile.baseArchetype?.name}
    - Egotend State: ${profile.egotend?.name} (Challenges: ${profile.egotend?.challenges.join(', ')})
    - Highertend State: ${profile.highertend?.name} (Growth Path: ${profile.highertend?.pathToGrowth.join(', ')})
    - Current Suppressors: ${profile.ctSuppressors?.join(', ')}
    
    Use this context to provide personalized, helpful answers.`;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,
        config: {
            systemInstruction: `${MTypeSystemInstruction}\n\n${userProfileContext}`,
        }
    });

    const lastMessage = history[history.length - 1];
    
    const result = await chat.sendMessageStream({ parts: lastMessage.parts });
    let text = '';
    for await (const chunk of result) {
      text += chunk.text;
    }
    
    return text;
}

export async function getReframingExercise(suppressor: string): Promise<string> {
    const prompt = `Provide a quick, actionable "Circuit Breaker" reframing exercise for the following CT Suppressor: "${suppressor}".
    The exercise should be 2-3 sentences long. Use a calm, direct, and supportive tone. This needs to be a very fast response.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt,
    });
    
    return response.text;
}

export async function interpretFrictionMarkers(communicationData: string, auditResults: { vagueCount: number; negativeCount: number; avoidanceCount: number; valenceScore: number; }): Promise<string> {
    const prompt = `A user has run a TFM (Total Friction Marker) audit on a piece of communication text. The audit found the following:
- Cognitive Friction Markers (Vague Language): ${auditResults.vagueCount}
- Emotional Friction Markers (High Negativity): ${auditResults.negativeCount}
- Systemic Friction Markers (Responsibility Avoidance): ${auditResults.avoidanceCount}
- Average Valence Score: ${auditResults.valenceScore.toFixed(2)} (A score above 0 is generally positive, below 0 is negative. The range is roughly -3 to +3).

The original text was:
"""
${communicationData}
"""

Based on these results and the text provided, provide a brief, insightful interpretation. Explain what these markers AND the valence score might indicate about the team's communication dynamics, a potential bottleneck, or underlying issues. A negative valence score with high negativity markers indicates significant emotional friction. A positive score with high vague markers might suggest polite but ineffective communication. Frame your interpretation as helpful advice to improve clarity, morale, and accountability. Structure your response in markdown. Start with a summary, then use bullet points for specific observations.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: MTypeSystemInstruction,
        }
    });

    return response.text;
}

export async function getArchetypeDetails(archetypeName: string): Promise<Pick<Archetype, 'coreDrive' | 'HBDI' | 'MBTI'>> {
    const prompt = `For the MiType+ Archetype named "${archetypeName}", provide its defining characteristics.
    - **coreDrive**: A concise sentence describing its primary motivation.
    - **HBDI**: The typical Herrmann Brain Dominance Instrument preference (e.g., "A/D Dominant", "C/B Secondary").
    - **MBTI**: The most common Myers-Briggs Type Indicator code (e.g., "ENTJ", "ISFP").

    Return a single JSON object with this exact structure:
    {
      "coreDrive": "...",
      "HBDI": "...",
      "MBTI": "..."
    }`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            systemInstruction: MTypeSystemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    coreDrive: { type: Type.STRING },
                    HBDI: { type: Type.STRING },
                    MBTI: { type: Type.STRING },
                },
                required: ["coreDrive", "HBDI", "MBTI"]
            },
        }
    });

    return JSON.parse(response.text);
}