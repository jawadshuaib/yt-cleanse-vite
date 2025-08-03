import React from 'react';
import { YOUTUBE_API_SCOPES, GOOGLE_CLIENT_ID } from '../../constants';

const LoginScreen: React.FC = () => {
  const handleLogin = () => {
    const oAuth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Parameters for the OAuth request
    const params = {
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: window.location.origin, // Redirect back to the app's origin
      response_type: 'token', // "token" for implicit flow to get access_token directly
      scope: YOUTUBE_API_SCOPES,
    };

    const url = `${oAuth2Endpoint}?${new URLSearchParams(params).toString()}`;

    // Redirect the user to the Google OAuth consent screen
    window.location.href = url;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
          Welcome to <span className="text-purple-400">YT Cleanse</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Declutter your YouTube subscriptions intelligently. We will analyze
          your watch history to recommend which channels to keep, review, or
          unsubscribe from.
        </p>

        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Get Started</h2>
          <p className="text-gray-400 mb-6">
            Sign in with your Google account to securely fetch your YouTube
            data. Your information is processed entirely in your browser.
          </p>
          <button
            onClick={handleLogin}
            className="w-full max-w-sm mx-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.98 2.023C17.913 20 12 20 12 20s-5.913 0-7.563-.475c-.983-.263-1.726-1.038-1.98-2.023C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.98-2.023C6.087 4 12 4 12 4s5.913 0 7.563.475c.983.263 1.726 1.038 1.98 2.023zM9.546 15.548V8.452L15.454 12l-5.908 3.548z" />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
