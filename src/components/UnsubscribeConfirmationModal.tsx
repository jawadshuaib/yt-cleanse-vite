import React from 'react';
import type { Channel } from '../../types';

interface UnsubscribeConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  channelsToUnsubscribe: Channel[];
  isUnsubscribing: boolean;
}

const UnsubscribeConfirmationModal: React.FC<
  UnsubscribeConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  channelsToUnsubscribe,
  isUnsubscribing,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="unsubscribe-modal-title"
    >
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg border border-gray-700 animate-fade-in-up">
        <div className="p-6">
          <h2
            id="unsubscribe-modal-title"
            className="text-2xl font-bold text-white mb-2"
          >
            Confirm Unsubscription
          </h2>
          <p className="text-gray-400 mb-4">
            You are about to unsubscribe from the following{' '}
            {channelsToUnsubscribe.length} channel(s):
          </p>
          <div className="max-h-60 overflow-y-auto bg-gray-900/50 p-3 rounded-md border border-gray-600 mb-6 space-y-2">
            {channelsToUnsubscribe.map((channel) => (
              <div key={channel.id} className="flex items-center gap-3">
                <img
                  src={channel.thumbnail}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <span className="text-gray-200 font-medium truncate">
                  {channel.title}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-700/50 px-6 py-4 flex justify-end items-center gap-4 rounded-b-lg">
          <button
            onClick={onClose}
            disabled={isUnsubscribing}
            className="px-4 py-2 rounded-md text-gray-300 font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isUnsubscribing}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-red-800 disabled:cursor-not-allowed min-w-[190px]"
          >
            {isUnsubscribing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                <span>Unsubscribing...</span>
              </>
            ) : (
              <span>Confirm Unsubscribe</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsubscribeConfirmationModal;
