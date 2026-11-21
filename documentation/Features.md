# Key Features

The AI Powered Interactive Hardware Lab™ is designed with a rich feature set to cater to beginners and intermediate learners.

## 1. Sandbox Mode

The core of the application is a freeform sandbox environment where users can experiment with their own ideas.

-   **Interactive Canvas:** A pannable, zoomable workspace to build circuits.
-   **Drag-and-Drop Components:** A comprehensive library of virtual components (sensors, actuators, etc.) that can be dragged onto the canvas.
-   **AI Component Suggestion:** Users can type an idea, and the AI will suggest the necessary components and quantities, highlighting them in the library.
-   **AI Project Scaffolding:** From just an idea, the AI can select components, place them logically on the canvas, wire them up, and generate the corresponding code and explanation in one step.
-   **AI Project Generation:** If users place components manually, the AI can generate the wiring, code, and explanation to connect them based on the user's project idea.
-   **Live Code Editing & Analysis:** Users can modify the AI-generated code. A special "Analyze Code" feature sends the modified code back to the AI, which can update the simulation plan or even suggest wiring changes to match the new code logic.

## 2. Circuit Simulation

The application provides a dynamic simulation of the generated circuit.

-   **Time-Sequenced Simulation:** Output devices like LEDs, motors, and LCDs animate based on the logic in the generated code (e.g., `delay()` or `time.sleep()`).
-   **Interactive Inputs:** Users can interact with input components during a simulation. For example:
    *   Clicking a virtual button.
    *   Typing a value into a sensor's input field (e.g., "30 C" for a temperature sensor).
    *   Dragging a slider for a potentiometer.
-   **Real-time Feedback:** The simulation reacts instantly to user inputs based on AI-generated "triggers" that map conditional logic from the code (e.g., `if temperature > 30: led.on()`).
-   **Client-Side Validation:** The application performs real-time checks for common electrical faults like short circuits, voltage mismatches, or missing ground connections, highlighting faulty wires.

## 3. Challenge Mode

A structured learning environment to test skills with guided projects.

-   **Goal-Oriented Tasks:** Each challenge presents a specific goal (e.g., "Make an LED blink when a button is pressed").
-   **Prerequisite Questions:** Challenges start with a multiple-choice question to ensure the user understands a key concept before beginning.
-   **Manual Wiring:** Unlike sandbox mode, users must draw the wires between components themselves.
-   **AI Solution Evaluation:** Users can submit their wiring and custom-written code for evaluation. The AI checks if the solution meets the goal and provides constructive feedback.
-   **AI-Powered Hints:** If a user gets stuck, they can request a hint. The AI analyzes their current attempt and provides a small, specific tip to guide them.

## 4. Academy Mode

A text-based learning center for foundational knowledge.

-   **Structured Learning Paths:** Content is organized into paths, modules, and lessons (e.g., "Raspberry Pi Basics" -> "Electronics 101").
-   **Conceptual Explanations:** Lessons cover fundamental topics like circuits, voltage, and digital logic.
-   **Interactive Quizzes:** Simple tasks, including MCQs, are embedded within lessons to reinforce concepts.

## 5. Project & Data Management

-   **Save/Load Projects:** Users can save their sandbox projects (including component layout, wiring, and code) to their browser's local storage and load them later.
-   **Export to PDF/Image:** Projects can be exported as a high-quality JPEG image of the wiring diagram or a comprehensive PDF report containing the diagram, components list, connections table, code, and explanation.
-   **Customizable Hardware (Admin Panel):** An admin panel allows for adding new boards and components. It uses the Gemini API to fetch technical data and even generate new SVG icons from just a component name, making the library easily extensible.
