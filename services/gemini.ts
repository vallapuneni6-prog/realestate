
import { GoogleGenAI, Type } from "@google/genai";
import { Lead, Property } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getLeadInsights = async (lead: Lead, properties: Property[]) => {
  try {
    const propertyTitles = properties.map(p => p.title).join(', ');
    const prompt = `Analyze this HNI/NRI real estate lead and provide a high-level strategic recommendation for an agent.
    Lead Name: ${lead.name}
    Residency: ${lead.citizenship}
    Net Worth Estimate: ${lead.netWorth}
    Budget: ${lead.investmentBudget}
    Preferred Types: ${lead.preferredPropertyTypes.join(', ')}
    Notes: ${lead.notes}

    Available Luxury Inventory: ${propertyTitles}

    Provide:
    1. A "Personality Snapshot" based on their profile.
    2. Which property matches them best and WHY.
    3. A suggested 1-sentence personalized opening line for a WhatsApp or Email outreach.

    Keep it sophisticated and professional. Format in Markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate AI insights at this time.";
  }
};

export const generateOutreachEmail = async (lead: Lead, property: Property) => {
  try {
    const prompt = `Draft a personalized, high-end outreach email to a luxury real estate lead.
    Recipient: ${lead.name} (${lead.citizenship})
    Property Highlight: ${property.title} in ${property.location}
    Features: ${property.amenities.join(', ')}
    Tone: Sophisticated, exclusive, respectful of their time. Avoid generic sales talk.
    
    Mention that this listing is "off-market" and was curated specifically for their portfolio.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating email.";
  }
};
