# Local Setup Guide for macOS

This guide walks you through setting up the full-stack AI Powered Interactive Hardware Lab™ on macOS.

## Step 1: Install Prerequisites (Homebrew)

1.  **Install Homebrew**: Open `Terminal` and run:
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```
2.  **Install Node.js**: `brew install node`
3.  **Verify**: Open a new Terminal and run `node -v` and `npm -v`.

## Step 2: Prepare the Project

1.  **Get Project Files**: Download all project files into a folder.
2.  **Open in Terminal**: `cd ~/Path/To/Your/Project/Folder`

## Step 3: Set Up the Unified Backend Server (`backend/`)

1.  **Navigate to Backend Folder**:
    ```bash
    cd backend
    ```
2.  **Install Dependencies**: `npm install`.
3.  **Configure API Key**: Create a `.env` file in `backend/` and add:
    ```
    API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```
4.  **Add Firebase Credentials**: Place your `serviceAccountKey.json` file in the **project's root directory**.

## Step 4: Set Up the Frontend (Root `/`)

1.  **Navigate to Root**: Open a **new Terminal tab/window** and navigate to the project's root folder.
2.  **Install Dependencies**: `npm install`.

## Step 5: Run the Full Application

You need **two Terminal tabs/windows** running.

1.  **Start Backend**: In your first terminal (in `backend/`), run:
    ```bash
    npm run dev
    ```
    This starts on port `3001`. Leave it running.

2.  **Start Frontend**: In your second terminal (in the project root), run:
    ```bash
    npm run dev
    ```
    This starts the UI, typically on `http://localhost:5173`.

3.  **Connect Frontend to Local Server**:
    *   Open `services/apiService.ts`.
    *   Ensure the URL is correct:
        ```typescript
        const BACKEND_URL = 'http://localhost:3001';
        ```
    *   Save the file.

4.  **View in Browser**: Open `http://localhost:5173/` in your browser.