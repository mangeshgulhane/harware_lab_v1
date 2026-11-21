# Local Setup Guide for Linux (Debian/Ubuntu)

This guide walks you through setting up the full-stack AI Powered Interactive Hardware Lab™ on Linux using **nvm**.

## Step 1: Install Prerequisites (nvm)

1.  **Install `nvm`**: Open your terminal and run the official install script.
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    ```
2.  **Activate `nvm`**: Close and reopen your terminal.
3.  **Install Node.js**: `nvm install --lts`.
4.  **Verify**: Run `node -v` and `npm -v`.

## Step 2: Prepare the Project

1.  **Get Project Files**: Download all files into a project folder.
2.  **Open in Terminal**: `cd ~/Path/To/Your/Project/Folder`.

## Step 3: Set Up the Unified Backend Server (`backend/`)

1.  **Navigate to Backend Folder**:
    ```bash
    cd backend
    ```
2.  **Install Dependencies**: `npm install`.
3.  **Configure API Key**: Create a `.env` file in `backend/` with your key:
    ```
    API_KEY="YOUR_GEMINI_API_KEY_HERE"
    ```
4.  **Add Firebase Credentials**: Place your `serviceAccountKey.json` file in the **project's root directory**.

## Step 4: Set Up the Frontend (Root `/`)

1.  **Navigate to Root**: Open a **new terminal tab/window** to the project's root.
2.  **Install Dependencies**: `npm install`.

## Step 5: Run the Full Application

You need **two terminals** running.

1.  **Start Backend**: In your first terminal (in `backend/`), run:
    ```bash
    npm run dev
    ```
    This starts on port `3001`. Leave it running.

2.  **Start Frontend**: In your second terminal (in project root), run:
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