import axios from 'axios';
import type { Subscription, PlaylistItem } from '../types';

const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

const callYoutubeApi = async <T>(
  endpoint: string,
  token: string,
  params: Record<string, any>,
): Promise<T> => {
  const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: params,
  });
  return response.data;
};

const fetchPlaylistItems = async (
  token: string,
  playlistId: string,
  threeMonthsAgo: Date,
  onProgress: (count: number) => void,
): Promise<PlaylistItem[]> => {
  const historyItems: PlaylistItem[] = [];
  let nextPageToken: string | undefined = undefined;
  let keepFetching = true;

  do {
    const data = await callYoutubeApi<{
      items: PlaylistItem[];
      nextPageToken?: string;
    }>('playlistItems', token, {
      part: 'snippet',
      playlistId: playlistId,
      maxResults: 50,
      pageToken: nextPageToken,
    });

    if (data.items) {
      for (const item of data.items) {
        if (new Date(item.snippet.publishedAt) > threeMonthsAgo) {
          historyItems.push(item);
        } else {
          keepFetching = false;
          break;
        }
      }
      onProgress(historyItems.length);
    }

    nextPageToken = data.nextPageToken;

    if (!nextPageToken) {
      keepFetching = false;
    }
  } while (keepFetching);

  return historyItems;
};

export const fetchAllSubscriptions = async (
  token: string,
  onProgress: (count: number) => void,
): Promise<Subscription[]> => {
  let subscriptions: Subscription[] = [];
  let nextPageToken: string | undefined = undefined;

  do {
    const data = await callYoutubeApi<{
      items: Subscription[];
      nextPageToken?: string;
    }>('subscriptions', token, {
      part: 'snippet',
      mine: true,
      maxResults: 50,
      pageToken: nextPageToken,
    });

    subscriptions = subscriptions.concat(data.items);
    onProgress(subscriptions.length);
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return subscriptions;
};

export const fetchWatchHistory = async (
  token: string,
  onProgress: (count: number) => void,
): Promise<PlaylistItem[]> => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const data = await callYoutubeApi<{ items: { id: string }[] }>(
    'channels',
    token,
    {
      part: 'contentDetails',
      mine: true,
    },
  );

  if (!data.items || data.items.length === 0) {
    throw new Error("Could not find user's channel details.");
  }

  const historyPlaylistId = (data.items[0] as any).contentDetails
    ?.relatedPlaylists?.watchHistory;

  if (!historyPlaylistId) {
    // No way to fetch watch history via API for this account.
    console.warn(
      'Watch history playlist not available for this account. Unable to fetch watch history.',
    );
    return [];
  }

  return fetchPlaylistItems(
    token,
    historyPlaylistId,
    threeMonthsAgo,
    onProgress,
  );
};

export const unsubscribe = async (
  token: string,
  subscriptionId: string,
): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/subscriptions`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { id: subscriptionId },
  });
};
