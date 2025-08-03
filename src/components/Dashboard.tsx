import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchAllSubscriptions,
  fetchWatchHistory,
  unsubscribe,
} from '../../services/youtubeService';
import type {
  Subscription,
  PlaylistItem,
  Channel,
  CategorizedChannels,
} from '../../types';
import Header from './Header';
import Loader from './Loader';
import ChannelCard from './ChannelCard';
import UnsubscribeConfirmationModal from './UnsubscribeConfirmationModal';
import { DAILY_UNSUBSCRIBE_LIMIT } from '../../constants';

interface DashboardProps {
  accessToken: string;
  onLogout: () => void;
}

const CategorySection: React.FC<{
  title: string;
  description: string;
  channels: Channel[];
  selectedChannels: string[];
  onSelectChannel: (channelId: string) => void;
  onSelectAll: (channelIds: string[]) => void;
  onDeselectAll: (channelIds: string[]) => void;
  icon: React.ReactNode;
}> = ({
  title,
  description,
  channels,
  selectedChannels,
  onSelectChannel,
  onSelectAll,
  onDeselectAll,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (channels.length === 0) return null;

  const channelIds = channels.map((c) => c.subscriptionId);
  const areAllSelected =
    channels.length > 0 &&
    channelIds.every((id) => selectedChannels.includes(id));

  return (
    <div className="bg-gray-800/50 rounded-xl mb-6 border border-gray-700">
      <div className="w-full p-4 flex justify-between items-center gap-4">
        <button
          className="flex-grow text-left flex items-center gap-4"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={`category-${title.toLowerCase()}`}
        >
          <div className="bg-gray-700 p-2 rounded-full">{icon}</div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {title} ({channels.length})
            </h2>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </button>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() =>
              areAllSelected
                ? onDeselectAll(channelIds)
                : onSelectAll(channelIds)
            }
            className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors px-3 py-1 rounded-md hover:bg-gray-700"
            aria-label={
              areAllSelected
                ? `Deselect all channels in ${title}`
                : `Select all channels in ${title}`
            }
          >
            {areAllSelected ? 'Deselect All' : 'Select All'}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Collapse section' : 'Expand section'}
          >
            <svg
              className={`w-6 h-6 text-gray-400 transition-transform ${
                isOpen ? 'transform rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div
          id={`category-${title.toLowerCase()}`}
          className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {channels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              isSelected={selectedChannels.includes(channel.subscriptionId)}
              onSelect={() => onSelectChannel(channel.subscriptionId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ accessToken, onLogout }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');
  const [error, setError] = useState<string | null>(null);
  const [categorizedChannels, setCategorizedChannels] =
    useState<CategorizedChannels>({ keep: [], review: [], unsubscribe: [] });
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [hiddenChannelCount, setHiddenChannelCount] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [analysisMethod, setAnalysisMethod] = useState<string>('');

  const handleSelectChannel = (subscriptionId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(subscriptionId)
        ? prev.filter((id) => id !== subscriptionId)
        : [...prev, subscriptionId],
    );
  };

  const handleSelectAll = (channelIds: string[]) => {
    setSelectedChannels((prev) => [...new Set([...prev, ...channelIds])]);
  };

  const handleDeselectAll = (channelIds: string[]) => {
    setSelectedChannels((prev) =>
      prev.filter((id) => !channelIds.includes(id)),
    );
  };

  const handleBulkUnsubscribe = () => {
    if (selectedChannels.length === 0) return;
    setShowConfirmationModal(true);
  };

  const executeUnsubscribe = async () => {
    setIsUnsubscribing(true);
    const successfullyUnsubscribed: string[] = [];
    let shouldLogout = false;

    for (const subId of selectedChannels) {
      try {
        await unsubscribe(accessToken, subId);
        successfullyUnsubscribed.push(subId);
      } catch (err) {
        console.error(`Failed to unsubscribe from ${subId}:`, err);
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          const isQuotaError =
            err.response?.data?.error?.errors?.[0]?.reason === 'quotaExceeded';
          if (isQuotaError) {
            alert(
              'Failed to continue: YouTube API quota exceeded. Please try again tomorrow.',
            );
          } else {
            console.error(
              'Authentication error (403) during unsubscribe: Logging out.',
              err,
            );
            shouldLogout = true;
          }
        } else {
          alert(
            `Failed to unsubscribe from one or more channels. Check console for details.`,
          );
        }
        break;
      }
    }

    if (shouldLogout) {
      onLogout();
      return;
    }

    setCategorizedChannels((prev) => ({
      keep: prev.keep.filter(
        (c) => !successfullyUnsubscribed.includes(c.subscriptionId),
      ),
      review: prev.review.filter(
        (c) => !successfullyUnsubscribed.includes(c.subscriptionId),
      ),
      unsubscribe: prev.unsubscribe.filter(
        (c) => !successfullyUnsubscribed.includes(c.subscriptionId),
      ),
    }));

    setSelectedChannels((prev) =>
      prev.filter((id) => !successfullyUnsubscribed.includes(id)),
    );
    setIsUnsubscribing(false);
    setShowConfirmationModal(false);
    if (successfullyUnsubscribed.length > 0) {
      alert(
        `Successfully unsubscribed from ${successfullyUnsubscribed.length} channels.`,
      );
    }
  };

  const runAnalysis = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setHiddenChannelCount(0);
      setAnalysisMethod('');

      setLoadingMessage('Fetching your subscriptions...');
      const subs: Subscription[] = await fetchAllSubscriptions(
        accessToken,
        (count) => setLoadingMessage(`Fetched ${count} subscriptions...`),
      );

      setLoadingMessage('Fetching your watch history (last 3 months)...');
      const history: PlaylistItem[] = await fetchWatchHistory(
        accessToken,
        (count) => setLoadingMessage(`Found ${count} watched videos...`),
      );

      const allChannels: Channel[] = subs.map((sub) => ({
        id: sub.snippet.resourceId.channelId,
        title: sub.snippet.title,
        thumbnail: sub.snippet.thumbnails.high.url,
        subscriptionId: sub.id,
        watchCount: history.filter(
          (item) =>
            item.snippet.videoOwnerChannelId ===
              sub.snippet.resourceId.channelId ||
            item.snippet.channelId === sub.snippet.resourceId.channelId,
        ).length,
      }));

      allChannels.sort((a, b) => b.watchCount - a.watchCount);

      const sliceIndex = Math.floor(allChannels.length * 0.2);
      const channelsToAnalyze = allChannels.slice(sliceIndex);
      setHiddenChannelCount(sliceIndex);

      const categorized: CategorizedChannels = {
        keep: [],
        review: [],
        unsubscribe: [],
      };

      if (channelsToAnalyze.length > 0) {
        setLoadingMessage('Performing local analysis...');
        setAnalysisMethod(
          'Categorized based on the number of videos watched in the last 3 months.',
        );
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate processing
        channelsToAnalyze.forEach((channel) => {
          if (channel.watchCount > 2) {
            categorized.keep.push(channel);
          } else if (channel.watchCount > 0) {
            categorized.review.push(channel);
          } else {
            categorized.unsubscribe.push(channel);
          }
        });
      }

      categorized.keep.sort((a, b) => a.watchCount - b.watchCount);
      categorized.review.sort((a, b) => a.watchCount - b.watchCount);
      categorized.unsubscribe.sort((a, b) => a.watchCount - b.watchCount);

      setCategorizedChannels(categorized);
      setIsLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        const isQuotaError =
          err.response?.data?.error?.errors?.[0]?.reason === 'quotaExceeded';
        if (isQuotaError) {
          setError(
            "You've exceeded the YouTube API quota for today. This can happen after many actions. Please try again tomorrow.",
          );
        } else {
          console.error(
            'Authentication error (403): Session likely expired. Logging out automatically.',
            err,
          );
          onLogout();
          return;
        }
      } else if (err instanceof Error) {
        setError(
          `An error occurred: ${err.message}. Please try refreshing the page.`,
        );
      } else {
        setError('An unknown error occurred.');
      }
      console.error(err);
      setIsLoading(false);
    }
  }, [accessToken, onLogout]);

  useEffect(() => {
    runAnalysis();
  }, []);

  if (isLoading) return <Loader message={loadingMessage} />;

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <Header onLogout={onLogout} />
        <main className="flex-grow p-4 md:p-8 max-w-2xl mx-auto flex items-center justify-center w-full">
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-8 text-center w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-red-400 mb-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">
              An Error Occurred
            </h2>
            <p className="text-red-300">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  const allCategorizedChannels = [
    ...categorizedChannels.keep,
    ...categorizedChannels.review,
    ...categorizedChannels.unsubscribe,
  ];
  const channelsToUnsubscribe = allCategorizedChannels.filter((c) =>
    selectedChannels.includes(c.subscriptionId),
  );
  const isOverLimit = selectedChannels.length > DAILY_UNSUBSCRIBE_LIMIT;

  return (
    <div>
      <Header onLogout={onLogout} />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {hiddenChannelCount > 0 && (
          <div className="bg-gray-800/60 p-4 rounded-lg mb-6 border border-gray-700 text-center">
            <p className="text-gray-300">
              We have automatically hidden your {hiddenChannelCount}{' '}
              most-watched channels to help you focus.
            </p>
          </div>
        )}

        {analysisMethod && (
          <div className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700 flex items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-purple-400 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-white">Analysis Insight</h3>
              <p className="text-sm text-gray-300">{analysisMethod}</p>
            </div>
          </div>
        )}

        <CategorySection
          title="Keep"
          description="Channels you actively watch and love."
          channels={categorizedChannels.keep}
          selectedChannels={selectedChannels}
          onSelectChannel={handleSelectChannel}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
        <CategorySection
          title="Review"
          description="Channels you watch occasionally. Worth a second look."
          channels={categorizedChannels.review}
          selectedChannels={selectedChannels}
          onSelectChannel={handleSelectChannel}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
        <CategorySection
          title="Unsubscribe"
          description="Channels you rarely or never watch. Time to declutter!"
          channels={categorizedChannels.unsubscribe}
          selectedChannels={selectedChannels}
          onSelectChannel={handleSelectChannel}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          }
        />
      </main>
      {selectedChannels.length > 0 && (
        <div className="sticky bottom-0 left-0 right-0 bg-gray-800 border-t border-purple-500 p-4 shadow-lg z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
            <div className="flex-grow">
              <span className="font-bold text-white">
                {selectedChannels.length} channel(s) selected
              </span>
              {isOverLimit && (
                <p className="text-sm text-yellow-400 font-semibold mt-1">
                  Daily limit exceeded: YouTube allows about{' '}
                  {DAILY_UNSUBSCRIBE_LIMIT} unsubscribes per day. Please select
                  fewer channels.
                </p>
              )}
            </div>
            <button
              onClick={handleBulkUnsubscribe}
              disabled={isUnsubscribing || isOverLimit}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 flex-shrink-0"
            >
              {isUnsubscribing ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                'Unsubscribe'
              )}
              {!isUnsubscribing && 'Selected'}
            </button>
          </div>
        </div>
      )}
      {showConfirmationModal && (
        <UnsubscribeConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={executeUnsubscribe}
          channelsToUnsubscribe={channelsToUnsubscribe}
          isUnsubscribing={isUnsubscribing}
        />
      )}
    </div>
  );
};

export default Dashboard;
