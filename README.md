# YT Cleanse ✨

**Declutter your YouTube subscriptions intelligently.**

YT Cleanse is a web application that analyzes your YouTube subscriptions and watch history to provide smart recommendations for tidying up your feed. It helps you identify channels you no longer watch and allows you to bulk-unsubscribe with ease.

![YT Cleanse Dashboard](https://raw.githubusercontent.com/jawadshuaib/yt-cleanse/main/media/screenshot.png)

---

## 🚀 Key Features

- **🧠 Intelligent Analysis**: Utilizes the Google Gemini API to perform a thematic analysis of your subscriptions against your recent watch history, providing nuanced recommendations that go beyond simple watch counts.
- **🛡️ Local Fallback Mode**: If no Gemini API key is provided, the app falls back to a robust local analysis, categorizing channels based on how many of their videos you've watched in the last three months.
- **🎯 Focus Mode**: Automatically hides your top 20% most-watched channels, allowing you to focus on the subscriptions that are actually cluttering your feed.
- **✅ Bulk Actions**: Features a "Select All" option for each category and a clean, multi-select interface to unsubscribe from dozens of channels in a single operation.
- **🔒 Secure & Private**: All YouTube data is fetched and processed directly in your browser. The application only requests the necessary permissions to manage your subscriptions, and your access token is never stored on a server.
- **❗ Robust Error Handling**: Provides clear, user-friendly feedback for common issues like API rate limits (quota exhaustion), preventing confusion and keeping you informed.

## 🛠️ How It Works & Technology Stack

YT Cleanse is a modern, client-side-only application built with performance and user experience in mind.

1.  **Authentication**: The user signs in using Google's OAuth 2.0 (Implicit Flow) to grant temporary, secure access to their YouTube data.
2.  **Data Fetching**: The app uses the **YouTube Data API v3** to fetch the user's list of subscriptions and their watch history from the last three months.
3.  **Analysis**:
    - **AI Mode**: If a Gemini API key is configured, the titles of your watched videos and your subscription list are sent to the **Google Gemini API**. It returns a categorized list of channels to `Keep`, `Review`, or `Unsubscribe` from based on thematic relevance.
    - **Local Mode**: Without an AI key, it performs a local analysis based on watch frequency.
4.  **User Interaction**: The user is presented with the categorized channels in a clean, interactive UI where they can review the suggestions, select channels, and bulk-unsubscribe.

### Core Technologies:

- **Frontend**: [React](https://reactjs.org/) (with hooks), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN for rapid development)
- **APIs & Auth**: [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2), [YouTube Data API v3](https://developers.google.com/youtube/v3), [Google Gemini API](https://ai.google.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Architecture**: Purely client-side, using browser `importmap` for module resolution without a build step.

## 🔧 Setup & Local Development

To run this project locally, you'll need to set up Google credentials and serve the files.

### 1. Prerequisites

- A modern web browser.
- A local web server. You can use any simple server, like Python's built-in one or the `http-server` npm package.

### 2. Google Cloud Configuration

You need to create a Google Cloud project to get the necessary API keys and credentials.

1.  **Create a Google Cloud Project**:
    - Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new project.
2.  **Enable APIs**:
    - In your project, go to "APIs & Services" > "Library".
    - Search for and enable the **YouTube Data API v3**.
    - Search for and enable the **Vertex AI API** (which grants access to Gemini models).
3.  **Create OAuth 2.0 Client ID**:
    - Go to "APIs & Services" > "Credentials".
    - Click "Create Credentials" > "OAuth client ID".
    - Select "Web application" as the application type.
    - Under "Authorized JavaScript origins", add your local development URL (e.g., `http://localhost:3000`, `http://127.0.0.1:5500`).
    - Copy the generated **Client ID**.
4.  **Create an API Key**:
    - Go to "APIs & Services" > "Credentials".
    - Click "Create Credentials" > "API key".
    - **Important**: Restrict this key to only be usable with the "Vertex AI API" for security.
    - Copy the generated **API Key**.

### 3. Application Configuration

> **Warning**
> The current setup uses a hardcoded Client ID in `constants.ts`. For a real-world deployment, this should be handled via environment variables at build time. Do not commit your actual credentials to a public repository.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/jawadshuaib/yt-cleanse.git
    cd yt-cleanse
    ```
2.  **Update Google Client ID**:
    - Open `constants.ts`.
    - Replace the placeholder `GOOGLE_CLIENT_ID` with the one you created.
3.  **Provide Gemini API Key**:

    - This project is designed to use an environment variable `process.env.API_KEY`. In a static-file setup, `process.env` is not available. For local testing, you can temporarily modify `services/geminiService.ts`:

    ```typescript
    // In services/geminiService.ts
    // Replace this:
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // With this (for local testing ONLY):
    const ai = new GoogleGenAI({ apiKey: 'YOUR_GEMINI_API_KEY_HERE' });
    ```

### 4. Running the App

- Start a local web server from the root of the project directory. For example, using Python 3:
  ```bash
  npm run dev
  ```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
