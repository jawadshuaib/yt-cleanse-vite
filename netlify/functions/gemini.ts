import type { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';
import { GEMINI_MODEL_NAME, GEMINI_ANALYSIS_SCHEMA } from '../../constants';

export const handler: Handler = async (event) => {
  const body = event.body ? JSON.parse(event.body) : {};
  const { channels, userPreference } = body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: 'Missing Gemini API key.',
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  // Reduce the list to prevent timeouts
  const limitedChannels = channels.slice(0, 100);

  const channelInfo = limitedChannels.map((c: any) => ({
    id: c.id,
    title: c.title,
  }));

  const prompt = `
You are a recommendation engine for YouTube subscriptions. Analyze the user's data to help them declutter.
Here is a list of the user's subscribed channels:
${JSON.stringify(channelInfo, null, 2)}
Here is a description of the type of channels the user wants to keep:
"${userPreference}"
Based on this description, categorize each channel ID from the subscription list into one of three groups:
- "keep": Channels that match the user's preferences.
- "review": Channels that may be of interest but are not a perfect match.
- "unsubscribe": Channels that seem irrelevant to the user's stated interests.
Return your analysis as a JSON object matching the provided schema. Ensure every channel ID from the original list is placed into one of the three categories.
`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: GEMINI_ANALYSIS_SCHEMA,
      },
    });

    const text = response.text;
    console.log('RESULT:', text);
    if (!text) {
      throw new Error('No response text from Gemini API.');
    }
    const result = JSON.parse(text);
    if (result.keep && result.review && result.unsubscribe) {
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      };
    } else {
      throw new Error('Invalid JSON structure from Gemini API.');
    }
  } catch (error) {
    console.error('Gemini function error:', error);
    return {
      statusCode: 500,
      body: 'Failed to get analysis from AI.',
    };
  }
};
