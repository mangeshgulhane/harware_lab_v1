# Gemini API Integration

The integration with the Google Gemini API is the cornerstone of this application's intelligent features. All communication with the API is managed securely by the backend service.

## 1. Backend API Endpoints (`database/src/index.ts`)

The backend exposes a set of API endpoints that the frontend application calls. This server acts as a secure proxy, abstracting away the complexities of prompt engineering and API key management.

### Key Endpoints

-   **`/api/getUnifiedProjectInfo`**:
    *   **Purpose:** Takes a list of dropped components and a project idea from the frontend, and returns a complete project plan from Gemini.
    *   **Backend Logic:** Constructs a highly detailed prompt providing the AI with component lists, pinouts, and critical wiring rules. It then calls the Gemini API with this prompt.
    
-   **`/api/projects` (GET, POST, PUT, DELETE)**:
    *   **Purpose:** Handles all CRUD (Create, Read, Update, Delete) operations for user projects.
    *   **Backend Logic:** Interacts with the Firestore database to persist and retrieve project data.

-   **`/api/getProjectScaffoldFor...`**:
    *   **Purpose:** Takes just a project idea and generates a complete project from scratch, including component selection and placement.

-   **`/api/evaluateChallengeSolution` / `/api/getChallengeHint`**:
    *   **Purpose:** Powers the Challenge Mode by sending the user's solution (wiring and code) to the AI for evaluation or to request a hint.

-   **`/api/getComponentDetails` / `/api/getBoardDetails`**:
    *   **Purpose:** Used in the Admin Panel to auto-populate data and generate SVG schematics for new hardware by querying the AI.

## 2. Prompt Engineering and Output Control Strategy (Backend)

All prompt engineering and output control logic is handled **securely on the backend server**. This ensures the API key is never exposed and allows for complex, rule-based prompts.

### A. Detailed, Rule-Based Prompts

Every prompt sent to the API is a comprehensive document that includes:
-   **Role-playing:** The AI is instructed to act as an "expert systems engineer."
-   **Context:** It receives all relevant data, such as the exact names and pins of every component.
-   **Strict Rules:** The prompts are filled with instructions prefixed with **"CRITICAL"** or **"ULTRA-CRITICAL"** to guide the AI's logic and prevent common errors.

### B. Enforced JSON Schema

The backend ensures application stability by forcing the Gemini model to return a predictable JSON structure for every request.

```ts
// Example from the backend service
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt,
  config: {
    responseMimeType: 'application/json',
    responseSchema: { /* ... A detailed schema of the expected JSON object ... */ },
  },
});
```

-   **`responseMimeType: 'application/json'`**: Tells the model its output must be valid JSON.
-   **`responseSchema`**: Provides a formal, typed definition of the expected JSON structure.

By handling this on the server, we ensure the frontend always receives data in the format it expects, drastically reducing client-side errors.

## 3. Error Handling and Retry Loop

-   **API Errors:** The backend includes `try...catch` blocks to handle network errors or API-level errors from Gemini.
-   **Validation & Retry Loop:** The frontend component `LabApp.tsx` implements a simple retry loop.
    1.  It calls an endpoint on our backend service.
    2.  The backend proxies the request to Gemini.
    3.  Upon receiving a response, the frontend runs the client-side `validateConnections` function.
    4.  If validation fails, it re-sends the request to the backend, this time including the validation errors in the payload. The backend then includes these errors in its next prompt to Gemini, instructing the AI to correct its mistakes.
    5.  This loop runs up to 3 times to give the AI a chance to self-correct.