export interface Subscription {
  id: string;
  snippet: {
    publishedAt: string;
    title: string;
    description: string;
    resourceId: {
      kind: string;
      channelId: string;
    };
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
}

export interface PlaylistItem {
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    videoOwnerChannelTitle: string;
    videoOwnerChannelId: string;
  };
}

export interface Channel {
  id: string;
  title: string;
  thumbnail: string;
  subscriptionId: string;
  watchCount: number;
}

export interface CategorizedChannels {
  keep: Channel[];
  review: Channel[];
  unsubscribe: Channel[];
}

export enum AnalysisCategory {
  KEEP = 'keep',
  REVIEW = 'review',
  UNSUBSCRIBE = 'unsubscribe',
}
