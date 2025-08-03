# YT Cleanse ✨

**Declutter your YouTube subscriptions intelligently.**

YT Cleanse is a web application that analyzes your YouTube subscriptions and watch history to help you tidy up your feed. It identifies channels you no longer watch and allows you to bulk-unsubscribe with ease.

Try it out: https://yt-cleanse.netlify.app/

![YT Cleanse Dashboard](https://raw.githubusercontent.com/jawadshuaib/yt-cleanse-vite/main/media/screenshot.png)

---

## 🚀 Key Features

- **🛡️ Local Analysis**: Categorizes channels based on how many of their videos you've watched in the last three months.
- **🎯 Focus Mode**: Automatically hides your top 20% most-watched channels, allowing you to focus on subscriptions that are actually cluttering your feed.
- **✅ Bulk Actions**: Features a "Select All" option for each category and a clean, multi-select interface to unsubscribe from dozens of channels in a single operation.
- **🔒 Secure & Private**: All YouTube data is fetched and processed directly in your browser. The application only requests the necessary permissions to manage your subscriptions, and your access token is never stored on a server.
- **❗ Robust Error Handling**: Provides clear, user-friendly feedback for common issues like API rate limits (quota exhaustion), preventing confusion and keeping you informed.

## 🛠️ How It Works & Technology Stack

YT Cleanse is a modern, client-side-only application built with performance and user experience in mind.

1.  **Authentication**: The user signs in using Google's OAuth 2.0 (Implicit Flow) to grant temporary, secure access to their YouTube data.
2.  **Data Fetching**: The app uses the **YouTube Data API v3** to fetch the user's list of subscriptions and their watch history from the last three months.
3.  **Analysis**: Performs a local analysis based on watch frequency. Channels are categorized as `Keep`, `Review`, or `Unsubscribe` based on how many of their videos you've watched recently.
4.  **User Interaction**: The user is presented with the categorized channels in a clean, interactive UI where they can review the suggestions, select channels, and bulk-unsubscribe.

### Core Technologies:

- **Frontend**: [React](https://reactjs.org/) (with hooks), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN for rapid development)
- **APIs & Auth**: [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2), [YouTube Data API v3](https://developers.google.com/youtube/v3)
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
3.  **Create OAuth 2.0 Client ID**:
    - Go to "APIs & Services" > "Credentials".
    - Click "Create Credentials" > "OAuth client ID".
    - Select "Web application" as the application type.
    - Under "Authorized JavaScript origins", add your local development URL (e.g., `http://localhost:3000`, `http://127.0.0.1:5500`).
    - Copy the generated **Client ID**.

### 3. Application Configuration

> **Warning**
> The current setup uses a hardcoded Client ID in `constants.ts`. For a real-world deployment, this should be handled via environment variables at build time. Do not commit your actual credentials to a public repository.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/jawadshuaib/yt-cleanse-vite.git
    cd yt-cleanse-vite
    ```
2.  **Update Google Client ID**:
    - Open `constants.ts`.
    - Replace the placeholder `GOOGLE_CLIENT_ID` with the one you created.

### 4. Running the App

```bash
npm run dev
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
