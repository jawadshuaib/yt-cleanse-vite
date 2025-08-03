import type { Channel } from '../types';

export const analyzeSubscriptionsWithGemini = async (
  channels: Channel[],
  userPreference: string,
): Promise<{ keep: string[]; review: string[]; unsubscribe: string[] }> => {
  try {
    const response = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channels, userPreference }),
    });

    if (!response.ok) {
      throw new Error('Failed to get analysis from AI. Please try again.');
    }

    const result = await response.json();

    if (result.keep && result.review && result.unsubscribe) {
      return result;
    } else {
      throw new Error('Invalid JSON structure from Gemini API.');
    }
  } catch (error) {
    console.error('Error calling Gemini Netlify function:', error);
    throw new Error('Failed to get analysis from AI. Please try again.');
  }
};
