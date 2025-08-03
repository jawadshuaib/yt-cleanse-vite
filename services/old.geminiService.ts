import { GoogleGenAI } from '@google/genai';
import type { Channel, PlaylistItem } from '../types';
import { GEMINI_MODEL_NAME, GEMINI_ANALYSIS_SCHEMA } from '../constants';

export const analyzeSubscriptionsWithGemini = async (
  channels: Channel[],
  watchHistory: PlaylistItem[],
): Promise<{ keep: string[]; review: string[]; unsubscribe: string[] }> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const ai = new GoogleGenAI({ apiKey });

  const channelInfo = channels.map((c) => ({ id: c.id, title: c.title }));
  const watchedVideoTitles = watchHistory.map((v) => v.snippet.title);

  const prompt = `
    You are a recommendation engine for YouTube subscriptions. Analyze the user's data to help them declutter.
    
    Here is a list of the user's subscribed channels:
    ${JSON.stringify(channelInfo, null, 2)}
    
    Here is a list of video titles the user has watched recently:
    ${JSON.stringify(watchedVideoTitles, null, 2)}
    
    Based on the watch history, categorize each channel ID from the subscription list into one of three groups:
    - "keep": Channels that align well with the user's recent viewing habits.
    - "review": Channels that have some thematic overlap but are not frequently watched.
    - "unsubscribe": Channels that seem irrelevant to the user's recent interests or are never watched.
    
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
    if (!text) {
      throw new Error('No response text from Gemini API.');
    }
    const result = JSON.parse(text);

    if (result.keep && result.review && result.unsubscribe) {
      return result;
    } else {
      throw new Error('Invalid JSON structure from Gemini API.');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to get analysis from AI. Please try again.');
  }
};
