# Local Execution Guide

This guide explains how to run the frontend and the unified backend service of the AI Powered Interactive Hardware Lab™ on your local machine.

## Architecture Overview

To run the application locally, you must run **two** separate processes at the same time:
1.  The **Backend Service** (in `backend/`) to handle all AI and database calls.
2.  The **Frontend Service** (in the root `/`) for the user interface.

## Prerequisites

1.  **Node.js**: A JavaScript runtime. [Download the LTS version](https://nodejs.org/).
2.  **Google Gemini API Key**: Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  **Firebase Project**: For saving projects, you need a Firebase project with Firestore. See the OS-specific guides for setup.

---

## Step 1: Set Up and Run the Backend Server

1.  **Open a Terminal (Terminal 1)**.
2.  **Navigate to the Backend Folder**:
    ```bash
    cd path/to/project/backend
    ```
3.  **Install Dependencies** (only needs to be done once):
    ```bash
    npm install
    ```
4.  **Create Environment File**: Create a file named `.env` in the `backend/` folder and add your key:
    ```
    # backend/.env
    API_KEY="YOUR_GEMINI_API_KEY_HERE"
    LLM_PROVIDER="gemini"
    ```
5.  **Add Firebase Credentials**: Place your `serviceAccountKey.json` file in the **project's root directory** (one level above `backend/`).
6.  **Run the Server**:
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3001`. **Keep this terminal open.**

---

## Step 2: Set Up and Run the Frontend

1.  **Open a NEW Terminal (Terminal 2)**.
2.  **Navigate to the Project Root Folder**:
    ```bash
    cd path/to/project
    ```
3.  **Install Dependencies** (only needs to be done once):
    ```bash
    npm install
    ```
4.  **Connect Frontend to Your Local Server**:
    *   Open the file `services/apiService.ts`.
    *   Ensure the URL points to your local backend server:
        ```typescript
        // services/apiService.ts
        const BACKEND_URL = 'http://localhost:3001'; // The unified AI and Database service
        ```
    *   Save the file.
5.  **Run the Frontend App**:
    ```bash
    npm run dev
    ```
    A local server will start, typically at `http://localhost:5173`.

## You're Done!

You can now open `http://localhost:5173` in your browser to use the fully local application. You should have two terminals running simultaneously.