import { Type } from '@google/genai';

export const GOOGLE_CLIENT_ID =
  '411630486828-mbmmbpmuk80teci0frfdefntnblbh09b.apps.googleusercontent.com';
export const YOUTUBE_API_SCOPES = 'https://www.googleapis.com/auth/youtube';
export const GEMINI_MODEL_NAME = 'gemini-2.5-flash';

export const DAILY_UNSUBSCRIBE_LIMIT = 150; // Limit of channels a user can unsubscribe from in a day
export const GEMINI_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    keep: {
      type: Type.ARRAY,
      description:
        'Array of channel IDs that the user actively watches and should keep.',
      items: { type: Type.STRING },
    },
    review: {
      type: Type.ARRAY,
      description:
        'Array of channel IDs that the user watches infrequently and should review.',
      items: { type: Type.STRING },
    },
    unsubscribe: {
      type: Type.ARRAY,
      description:
        'Array of channel IDs that the user does not watch and should unsubscribe from.',
      items: { type: Type.STRING },
    },
  },
  required: ['keep', 'review', 'unsubscribe'],
};
