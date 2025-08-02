import React from 'react';
import type { Channel } from '../../types';

interface ChannelCardProps {
  channel: Channel;
  isSelected: boolean;
  onSelect: () => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`relative group bg-gray-800 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
        isSelected
          ? 'border-purple-500 scale-105 shadow-lg'
          : 'border-transparent hover:border-purple-600'
      }`}
    >
      <img
        src={channel.thumbnail}
        alt={channel.title}
        className="w-full h-32 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

      <div className="absolute top-2 right-2">
        <div
          className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 ${
            isSelected
              ? 'bg-purple-600'
              : 'bg-gray-900/50 border-2 border-white/50 group-hover:border-purple-500'
          }`}
        >
          {isSelected && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 p-2 w-full">
        <div className="flex justify-between items-center gap-2">
          <h3
            className="text-sm font-bold text-white truncate"
            title={channel.title}
          >
            {channel.title}
          </h3>
          <a
            href={`https://www.youtube.com/channel/${channel.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-purple-400 rounded-full hover:bg-gray-700 transition-all"
            aria-label={`Open ${channel.title} on YouTube`}
            title="Open on YouTube"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
        <p
          className="text-xs text-gray-400"
          title="Based on watch history from the last 3 months"
        >
          Watched (3 mo): {channel.watchCount} videos
        </p>
      </div>
    </div>
  );
};

export default ChannelCard;
