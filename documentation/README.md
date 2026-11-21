# AI Powered Interactive Hardware Lab™ - Documentation

Welcome to the official documentation for the AI Powered Interactive Hardware Lab™.

This project is a web-based educational tool designed to help students learn about electronics, microcontrollers, and single-board computers like the Raspberry Pi and Arduino. It provides an interactive, drag-and-drop sandbox environment where users can build virtual circuits and receive AI-generated code, wiring diagrams, and explanations to bring their ideas to life.

## Table of Contents

1.  [**Key Features**](./Features.md) - A detailed look at what the application can do.
2.  [**High-Level Design (HLD)**](./HLD.md) - An overview of the system architecture and its main components.
3.  [**Low-Level Design (LLD)**](./LLD.md) - A closer look at the frontend components and their interactions.
4.  [**Gemini API Integration**](./API_Integration.md) - Details on how the Google Gemini API is leveraged by the backend.
5.  [**Project Setup**](./Setup.md) - Instructions for setting up and running the application locally.
6.  [**Local Execution Guide**](./Local_Execution_Guide.md) - A step-by-step guide to run the app on your own machine.

## Technology Stack

-   **Frontend:** React, TypeScript, Tailwind CSS
-   **Backend Service (in /backend):** Node.js, Express.js, TypeScript, Firebase Admin
-   **Code Editor:** Monaco Editor
-   **AI Engine:** Google Gemini API (`@google/genai`)
-   **Database:** Google Firestore
-   **Graphics & Exporting:** `html2canvas`, `jspdf`