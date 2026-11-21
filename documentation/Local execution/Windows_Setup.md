# Local Setup Guide for Windows

This guide will walk you through setting up and running the full-stack AI Powered Interactive Hardware Lab™ on a Windows machine.

## Step 1: Install Prerequisites

1.  **Download Node.js**: Go to the official [Node.js website](https://nodejs.org/en/download/) and download the "LTS" version installer for Windows.
2.  **Run the Installer**: Follow the on-screen instructions.
3.  **Verify Installation**: Open a new Command Prompt or PowerShell and run `node -v` and `npm -v`.

## Step 2: Prepare the Project

1.  **Get Project Files**: Create a folder for the project and place all the project files into it.
2.  **Open in Terminal**: Open a Command Prompt or PowerShell and navigate to your project folder using `cd`.

## Step 3: Set Up the Unified Backend Server (`backend/`)

1.  **Navigate to Backend Folder**:
    ```bash
    cd backend
    ```
2.  **Install Dependencies**: Run `npm install`.
3.  **Configure API Key**:
    *   In the `backend/` folder, create a new file named `.env`.
    *   Add your Gemini API key:
        ```
        API_KEY="YOUR_GEMINI_API_KEY_HERE"
        ```
    *   Save the file.
4.  **Add Firebase Credentials**: Place your `serviceAccountKey.json` file in the **project's root directory** (the one containing the `backend` folder).

## Step 4: Set Up the Frontend (Root `/`)

1.  **Navigate to Root**: Open a **new, separate** Command Prompt/PowerShell and navigate to the project's root folder.
2.  **Install Frontend Dependencies**: Run `npm install`.

## Step 5: Run the Full Application

You will need **two terminals** running at the same time.

1.  **Start the Backend Server**: In your first terminal (inside `backend/`), run:
    ```bash
    npm run dev
    ```
    The server will start on port `3001`. Leave this running.

2.  **Start the Frontend**: In your second terminal (in the project root), run:
    ```bash
    npm run dev
    ```
    This will start the UI, typically on `http://localhost:5173`.

3.  **Connect Frontend to Local Server**:
    *   Open the file `services/apiService.ts`.
    *   Ensure the URL points to your local server:
        ```typescript
        const BACKEND_URL = 'http://localhost:3001';
        ```
    *   Save the file.

4.  **View in Browser**: Open `http://localhost:5173/` in your web browser. The application is now running.