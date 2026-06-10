import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, ChatMessage, Archetype, Egotend, Highertend } from '../types';
import { MBTI_ARCHETYPE_MAP } from './mbtiArchetypeService';

const getAI = () => {
    // Initializing Gemini client strictly using process.env.GEMINI_API_KEY as per the platform guidelines
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
};

const MTypeSystemInstruction = `You are "Mi", an AI assistant integrated into the MiType+ Cognitive OS. Your purpose is to help users understand themselves through the MiType+ framework. You MUST adhere to the following rules:
1.  **Analyze Data:** When given assessment data, analyze it strictly within the MiType+ framework provided in user prompts.
2.  **Generate Profiles:** Create user profiles (Base Archetype, Egotend, Highertend) based on the analysis.
3.  **Chat Support:** When chatting, use the user's provided profile data to give contextual, supportive, and insightful advice.
4.  **Tone:** Your tone is empathetic, insightful, and slightly futuristic, like a calm OS assistant.
5.  **Output Format:** Always respond in the requested JSON format when asked. For chat, respond in clear, concise markdown.`;

export async function analyzeMTra(answers: { [key: number]: number }): Promise<any> {
    const ai = getAI();
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
        model: 'gemini-3-flash-preview',
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
    const ai = getAI();
    const prompt = `Based on the following HBDI assessment answers, provide a brief (2-3 sentences) summary of the user's dominant cognitive preference.
    (A=Blue/Analytical, B=Green/Practical, C=Red/Relational, D=Yellow/Conceptual).
    Answers: ${JSON.stringify(answers, null, 2)}
    
    Example summary: "Your answers suggest a strong preference for the conceptual and relational quadrants, indicating you are an imaginative and people-oriented thinker."`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction: MTypeSystemInstruction }
    });
    
    return response.text || "Analysis complete.";
}

export async function analyzeMbtiForSummary(answers: { [key: number]: string }): Promise<{ mbtiType: string, summary: string }> {
    const ai = getAI();
    const prompt = `Analyze the following MBTI assessment answers to determine the user's 4-letter MBTI type and provide a brief (2-3 sentences) summary of this type.
    
    Answers (Indices 0-19, 'a' or 'b'): ${JSON.stringify(answers, null, 2)}
    
    **Scoring Key:**
    - EI (0-4): a=E, b=I
    - SN (5-9): a=S, b=N
    - TF (10-14): a=T, b=F
    - JP (15-19): a=J, b=P
    
    Count the answers for each letter in each dimension. The one with the highest count (3 or more out of 5) wins that letter.
    
    Return a JSON object with this exact structure: { "mbtiType": "XXXX", "summary": "..." }`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
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
    mbtiAnswers: { [key: number]: string },
    detectedMbti: string
): Promise<{ baseArchetype: Archetype, egotend: Egotend, highertend: Highertend }> {
    const ai = getAI();
    const archetypeRef = MBTI_ARCHETYPE_MAP[detectedMbti] || MBTI_ARCHETYPE_MAP['ISTJ'];

    const prompt = `Synthesize a full MiType+ profile from the user's MTra, HBDI, and MBTI assessment results. 
    
    CRITICAL: YOU MUST USE THE MBTI TYPE "${detectedMbti}" FOR THIS PROFILE.
    REFERENCE: The base archetype for "${detectedMbti}" is "${archetypeRef.name}".
    CORE DRIVE: "${archetypeRef.coreDrive}"
    
    Use the reference name and core drive as the foundation, but adding technical depth based on the specific assessment data below.
    
    **1. MTra Results (Change Threshold):**
    ${JSON.stringify(mtraResults, null, 2)}

    **2. HBDI Answers (Cognitive Preference):**
    ${JSON.stringify(hbdiAnswers, null, 2)}
    (A=Blue/Analytical, B=Green/Practical, C=Red/Relational, D=Yellow/Conceptual)

    **3. Detected MBTI Type:**
    ${detectedMbti}

    **Task:**
    1. Define the Base Archetype using "${archetypeRef.name}" as the name.
    2. Define its "coreDrive" using "${archetypeRef.coreDrive}" as the base.
    3. SET THE "MBTI" PROPERTY TO EXACTLY "${detectedMbti}".
    4. Define a brief string for the "HBDI" label summarizing the dominant quadrants.
    5. SET THE "CTS" PROPERTY TO "${mtraResults.changeThreshold}".
    6. Define an "Egotend" (stress mode) with:
       - "name" (something descriptive like 'The Reactive ${archetypeRef.name}')
       - "challenges" (based on suppressors: ${mtraResults.ctSuppressors.join(', ')})
       - "warningSigns" (4-5 short, relatable bullet points)
       - "commonTriggers" (3-4 simple bullet points)
    7. Define a "Highertend" (flow state) with:
       - "name" (something inspiring like 'The Integrated ${archetypeRef.name}')
       - "pathToGrowth" (simple, encouraging growth steps)
       - "strengthsInFlow" (4-5 clear, positive bullet points)
       - "quickActivation" (3-4 super simple, actionable tips)

    Return as JSON.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            systemInstruction: MTypeSystemInstruction,
            thinkingConfig: { thinkingBudget: 4000 },
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
                        }
                    },
                    egotend: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
                            warningSigns: { type: Type.ARRAY, items: { type: Type.STRING } },
                            commonTriggers: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    },
                    highertend: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            pathToGrowth: { type: Type.ARRAY, items: { type: Type.STRING } },
                            strengthsInFlow: { type: Type.ARRAY, items: { type: Type.STRING } },
                            quickActivation: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    }
                }
            },
        }
    });
    
    return JSON.parse(response.text);
}

export async function getArchetypeInAction(archetypeName: string): Promise<string> {
    const ai = getAI();
    const prompt = `Provide a practical, benefit-focused explanation for the MiType+ Archetype: "${archetypeName}". 
    Write 3-4 short paragraphs showing how this archetype's core attributes and strengths directly support a user in:
    1. Work (professional performance and productivity)
    2. Study (learning and knowledge mastery)
    3. Home Life (daily routines, relationships, and personal well-being)
    
    The tone should be casual, friendly, and relatable, avoiding overly technical jargon to appeal to a broad audience. Do not use markdown headers, just paragraphs.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction: MTypeSystemInstruction }
    });

    return response.text || "Content generation in progress...";
}

export async function getChatResponse(history: ChatMessage[], profile: UserProfile): Promise<string> {
    const ai = getAI();
    const userProfileContext = `This user's current MiType+ profile is:
    - Base Archetype: ${profile.baseArchetype?.name}
    - Egotend State: ${profile.egotend?.name}
    - Highertend State: ${profile.highertend?.name}
    - Current Suppressors: ${profile.ctSuppressors?.join(', ')}`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: history.flatMap(h => h.parts).concat([{ text: "User context: " + userProfileContext }]) },
        config: { systemInstruction: MTypeSystemInstruction }
    });
    
    return response.text || "I'm listening.";
}

export async function interpretFrictionMarkers(
    communicationData: string, 
    auditResults: { vagueCount: number; negativeCount: number; avoidanceCount: number; valenceScore: number; },
    profile: UserProfile
): Promise<string> {
    const ai = getAI();
    const userContext = `User Profile:
    - Base Archetype: ${profile.baseArchetype?.name}
    - Egotend: ${profile.egotend?.name}
    - Highertend: ${profile.highertend?.name}
    - Change Threshold: ${profile.changeThreshold}`;

    const prompt = `As "Mi", interpret the following TFM (Team Friction Marker) Audit results for the user.
    
    **Audit Results:**
    - Vague Language (Cognitive Friction): ${auditResults.vagueCount}
    - Negativity (Emotional Friction): ${auditResults.negativeCount}
    - Avoidance (Systemic Friction): ${auditResults.avoidanceCount}
    - Valence Score (Sentiment): ${auditResults.valenceScore.toFixed(2)}
    
    **Communication Sample:**
    "${communicationData}"
    
    **User Context:**
    ${userContext}
    
    **Instructions:**
    1. Provide a professional, clinical, yet insightful analysis of the friction detected.
    2. Relate the findings to the user's MiType+ profile (Archetype, Egotend, Highertend) where relevant.
    3. DO NOT output any JSON or code blocks.
    4. DO NOT hallucinate external sci-fi narratives, characters (like Sam), or organizations (like L'Arc). Stick strictly to the MiType+ framework and the provided data.
    5. Use clear Markdown formatting with bold text for emphasis.
    6. Start with a direct greeting as Mi.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction: MTypeSystemInstruction }
    });

    return response.text || "No friction detected.";
}

export async function getArchetypeDetails(archetypeName: string): Promise<Pick<Archetype, 'coreDrive' | 'HBDI' | 'MBTI'>> {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Details for MiType+ Archetype: "${archetypeName}". Return coreDrive, HBDI, MBTI as JSON.`,
        config: {
            systemInstruction: MTypeSystemInstruction,
            responseMimeType: "application/json"
        }
    });

    return JSON.parse(response.text);
}