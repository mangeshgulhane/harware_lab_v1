# Project Setup and Usage

This document provides instructions on how to set up and run the AI Powered Interactive Hardware Lab™ on your local machine.

> **For a quick, consolidated guide, see the [Local Execution Guide](./Local_Execution_Guide.md).**

## 1. Project Architecture

This is a **full-stack application** composed of two main parts that must be run simultaneously:

1.  **Frontend**: A React application (located in the root directory) that runs in your browser and provides the user interface.
2.  **Backend Service**: A unified Node.js/Express server (located in the `backend/` directory). This server handles all secure communication with the Google Gemini API and the Firestore database.

## 2. Prerequisites

Before you begin, you will need:

1.  **Node.js**: The application requires a Node.js environment to install dependencies and run both services. We recommend using the latest **LTS (Long-Term Support)** version.
2.  **A Google Gemini API Key**: The backend service requires a valid API key to function.
3.  **Firebase Credentials**: For project saving/loading, the backend service needs a Firebase project with Firestore enabled and a `serviceAccountKey.json` file.

## 3. OS-Specific Setup Guides

For detailed, step-by-step instructions on how to set up and run all parts of the application, please follow the comprehensive guide for your specific operating system.

-   [**Windows Setup Guide**](./Local%20execution/Windows_Setup.md)
-   [**macOS Setup Guide**](./Local%20execution/macOS_Setup.md)
-   [**Linux Setup Guide**](./Local%20execution/Linux_Setup.md)

These guides cover everything from installing prerequisites to running the full application stack for local development.