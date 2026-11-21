// This factory centralizes all prompt engineering logic to avoid duplication.
// As per strict instructions, the prompts have been moved here verbatim.

export class PromptFactory {

    createFeasibilityCheckPrompt(idea: string, availableComponentIds: string[]) {
        return `
            You are an expert systems engineer acting as a project feasibility validator.
            A student has an idea for a project: "${idea}".
            You have a list of available electronic components: ${JSON.stringify(availableComponentIds)}.
            
            **CRITICAL TASK:** Your only job is to determine if the student's project is fundamentally possible with the components provided.
            1.  Read the project idea and identify the key hardware requirements. For example, "detect a person" requires a camera or PIR sensor; "show temperature" requires a temperature sensor.
            2.  Check if a component that can fulfill each key requirement exists in the list of available components.
            3.  If any single critical component is missing, the project is NOT feasible.
            
            **ULTRA-CRITICAL RESPONSE FORMAT:**
            You MUST respond with a valid JSON object. Do not include any other text or markdown.
            - If the project **is feasible**, respond with: \`{"isFeasible": true}\`
            - If the project **is NOT feasible**, respond with: \`{"isFeasible": false, "missingComponent": {"name": "NAME_OF_MISSING_COMPONENT", "reason": "A brief explanation of why it's needed."}}\`
            
            **Example 1 (Feasible):**
            Idea: "A light that turns on when it gets dark."
            Available: ["led", "photoresistor", "breadboard"]
            Your Response: \`{"isFeasible": true}\`
            
            **Example 2 (Not Feasible):**
            Idea: "A robot car with a camera that can detect a person."
            Available: ["dc-motor", "l298n", "hc-sr04"]
            Your Response: \`{"isFeasible": false, "missingComponent": {"name": "Camera Module", "reason": "The project requires a camera to detect a person, but no camera component is available in the list."}}\`
        `;
    }

    createPiSuggestionPrompt(idea: string, availableIds: string[]) {
        return `
            You are an expert Raspberry Pi 4 B systems engineer.
            A student described a project idea: "${idea}".
            From the following list of available component IDs, determine which ones are necessary and how many of each are needed.
            Available IDs: ${JSON.stringify(availableIds)}
            
            **Breadboard Rule:** Only include a 'breadboard' if the project requires connecting more than two components (excluding the breadboard itself), making direct wiring to the Pi difficult, or if the user's idea explicitly mentions using one. For very simple circuits (1-2 components), a breadboard is not necessary.
            
            **Power Supply Rule:** You MUST always include a 'power-supply' component with a count of 1 in your final "components" array, in addition to any other components you select.

            Respond with a JSON object containing a single key "components" which is an array of objects. Each object should have an "id" (the component ID) and a "count" (the number required).
            For example, if the project needs two LEDs and one button (3 components total), your response must be: {"components": [{"id": "power-supply", "count": 1}, {"id": "led", "count": 2}, {"id": "button", "count": 1}, {"id": "breadboard", "count": 1}]}
            Only include IDs from the provided list. If no components seem necessary, return an empty array.
            If you are not sure about the count of a component, assume 1.
            The response MUST be a valid JSON object. Do not include any markdown formatting.
        `;
    }

    createArduinoSuggestionPrompt(idea: string, availableIds: string[]) {
        return `
            You are an expert Arduino systems engineer.
            A student described a project idea: "${idea}".
            From the following list of available component IDs, determine which are necessary and how many of each are needed.
            Available IDs: ${JSON.stringify(availableIds)}
            
            **Breadboard Rule:** Only include a 'breadboard' if the project requires connecting more than two components (excluding the breadboard itself), making direct wiring to the Arduino difficult, or if the user's idea explicitly mentions using one. For very simple circuits (1-2 components), a breadboard is not necessary.
            
            **Power Supply Rule:** You MUST always include a 'power-supply' component with a count of 1 in your final "components" array, in addition to any other components you select.

            Respond with a JSON object containing a single key "components" which is an array of objects. Each object should have an "id" (the component ID) and a "count" (the number required).
            Only include IDs from the provided list. If no components are necessary, return an empty array.
        `;
    }

    createUnifiedPiPrompt(components: any, projectIdea: string, boardId: string, boardName: string, boardPinout: any, errors: any) {
        const componentList = components.map((c: any) => {
          const pinoutString = c.pinout ? `Pins: [${c.pinout.map((p: any) => `"${p.pin}"`).join(', ')}]` : 'No distinct pins.';
          return `- Unique Name: '${c.displayName}', instanceId: ${c.instanceId}, Type: ${c.name}, ${pinoutString}`;
        }).join('\n');
        const hasBreadboard = components.some((c: any) => c.id.toLowerCase().includes('breadboard'));
        const breadboardInstanceId = components.find((c: any) => c.id.toLowerCase().includes('breadboard'))?.instanceId;
        const boardPinList = boardPinout.map((p: any) => `"${p.name}"`).join(', ');
        const hasNodeMCU = components.some((c: any) => c.id === 'nodemcu-esp8266');
        const errorCorrectionPrompt = (errors && errors.length > 0) ? `
          **CRITICAL CORRECTION REQUIRED:**
          Your previous attempt resulted in the following wiring validation errors. You MUST correct these mistakes in your new response. Pay close attention to the error messages and fix the connections and code logic accordingly.
          **Errors to fix:**
          ${errors.map((e: any) => `- **${e.type}:** ${e.message}`).join('\n')}
          Please re-evaluate your entire wiring diagram and code to ensure it is correct and does not repeat these mistakes.
        ` : '';
        return `
          You are an expert ${boardName} embedded systems engineer creating a tutorial for a beginner student.
          The main board's code MUST be written in Python only.
          ${errorCorrectionPrompt}
          **Primary Requirement: Student's Idea**
          The student has described their project idea as: "${projectIdea}".
          The generated code's logic MUST strictly implement this idea. For example, if the idea is "blink an LED when I press a button", the code must reflect that exact button-press-to-LED-blink logic. This is the most important instruction.
          **CRITICAL NAMING RULE:**
          The component list below provides a 'Unique Name' for each component instance (e.g., 'LED 1'). You MUST use this exact 'Unique Name' for the \`ownerName\` field in connections, in variable names in the \`code\` (e.g., \`led_1_pin\`), and when referring to components in the \`explanation\`. This is essential for clarity when multiple components of the same type are present.
          **Components on Canvas:**
          A student has placed the following components on a canvas. Each has a unique name for you to use.
          ${componentList}
          Your task is to generate a complete, unified project based on the student's idea using the provided components.
          ${hasNodeMCU ? `
          **NodeMCU Co-Processor Rule (CRITICAL):**
          A 'NodeMCU (ESP8266)' component is present. This requires a multi-file code response.
          1. You MUST generate two separate, complete code files.
          2. The first file is for the main board (${boardName}) in Python. Its filename MUST be 'main.py'.
          3. The second file is for the NodeMCU in C++/Arduino. Its filename MUST be 'nodemcu.ino'.
          4. The two boards MUST communicate via a Serial (UART) connection. The main board's code should send commands, and the NodeMCU code should listen for them and perform Wi-Fi actions.
          5. In the 'explanation', you MUST include a section explaining this two-board setup and a sub-section titled "### How to Flash the NodeMCU" which instructs the user to use the Arduino IDE, select the correct board, and upload the 'nodemcu.ino' sketch.
          ` : ''}
          **Code Generation Rules:**
          - You MUST provide the code in the \`code\` field as an array of objects, where each object has a \`filename\` and \`content\` key.
          - The first object in the array MUST always be the code for the main board (${boardName}).
          - ${hasNodeMCU ? `The second object MUST be the code for the NodeMCU.` : `If only one board is used, this array will contain only one object.`}
          **Connection Rules:**
          1.  Each connection is an object \`{ from, to }\`, where \`from\` and \`to\` are objects \`{ ownerId, ownerName, pin }\`.
          2.  The \`ownerName\` MUST be the component's 'Unique Name' from the list above.
          3.  For the ${boardName} board itself, use the special \`ownerId\` '${boardId}' and \`ownerName\` '${boardName}'.
          4.  You MUST use one of the following exact, unique physical pin names for the ${boardName}: [${boardPinList}]. This is a critical instruction. Do not use generic names like 'Ground' if a more specific name like 'Ground (P9)' is available in the list.
          **ULTRA-CRITICAL PIN SELECTION RULE:** For every component, you MUST select one single, exact string from its provided pin list for the 'pin' field. For example, a Piezo Buzzer has pins \`['Positive (+)', 'Negative (-)']\`. A valid value for the 'pin' field is either the string \`'Positive (+)'\` OR the string \`'Negative (-)'\`. Combining pins like \`'+-'\`, \`'-+'\`, or using descriptive words is absolutely forbidden. The value must be a perfect match from the list. The 'pin' field MUST NOT be an empty string. This is the most important rule; breaking it makes the entire output useless.
          **CRITICAL WIRING LOGIC:**
          **MANDATORY POWER SUPPLY WIRING:**
          There is always a component with the name 'Power Supply' present on the canvas. This is the primary power source. You MUST find its unique 'instanceId' from the component list and use it to create these mandatory connections as the first step:
          1. Connect the 'Power Supply' 'V+' pin to the main board's '5V Power (P2)' pin.
          2. Connect the 'Power Supply' 'GND' pin to one of the main board's 'Ground' pins (e.g., 'Ground (P6)').
          All other components must receive power from the main board's output pins or a breadboard connected to it, NOT directly from the 'Power Supply'.
          1.  **Power to Power:** Connect component pins named 'VCC', '5V', '3.3V', '+', or 'Positive (+)' to a corresponding power source on the Pi (like '5V Power' or '3.3V Power') or the breadboard's positive rail.
          2.  **Ground to Ground:** Connect ALL component pins named 'GND', 'Ground', '-', or 'Negative (-)' to a 'Ground' pin on the Pi or the breadboard's negative rail. All grounds must be connected together.
          3.  **Digital/Analog Data:** Connect I/O pins (like 'DATA', 'OUT', 'Anode', 'IN1', 'PWM', 'Trig', 'Echo') to the Pi's GPIO pins. Analog-only pins from components (like 'AOUT' or 'VRx') must connect to an Analog-to-Digital Converter (ADC) if used with a Pi, but for this lab, you can connect them to any free GPIO and note in the code that an ADC would be needed in a real circuit.
          4.  **I2C Bus Rule:** Components with 'SDA' and 'SCL' pins are I2C devices. You MUST connect all 'SDA' pins to the Pi's 'GPIO 2 (SDA)' pin and all 'SCL' pins to the Pi's 'GPIO 3 (SCL)' pin. They share this bus.
          5.  **SPI Bus Rule:** Components with 'MOSI'/'DIN', 'MISO'/'DOUT', 'SCLK'/'CLK', and 'CS' pins are SPI devices. Connect them to the corresponding SPI pins on the Pi. Each SPI device MUST be connected to a UNIQUE 'CS' (Chip Select) pin on the Pi (e.g., 'GPIO 8 (CE0)', 'GPIO 7 (CE1)').
          6.  **Safety:** Never connect a power pin directly to a ground pin. Never connect a GPIO pin directly to a 5V or 3.3V power pin.
          ${hasBreadboard ? `
          **Breadboard Wiring Instructions:**
          5.  A breadboard IS present (\`instanceId\`: '${breadboardInstanceId}'). You MUST route component connections through it.
          6.  First, connect the ${boardName}'s power and ground pins (e.g., '5V Power (P2)', 'Ground (P6)') to the breadboard's power rails. Use breadboard pin names like '+' (positive rail) and '-' (negative rail).
          7.  **ULTRA-CRITICAL BREADBOARD CHANNEL RULE:** The breadboard has a central channel dividing each numbered row into two isolated sections. The pins in columns 'A' through 'E' of a row are connected. The pins in columns 'F' through 'J' of the same row are also connected. HOWEVER, the 'A-E' side is NOT connected to the 'F-J' side. To connect two points (e.g., a component pin and a board pin), they MUST be wired to the same half of the same row (e.g., connect one to pin 'E10' and the other to pin 'C10'). A connection from 'A1' to 'J1' is INVALID and will not work.
          8.  For each component (like an LED or button), create connections from the breadboard rows to the component's pins (e.g., from breadboard pin 'E10' to LED pin 'Anode').
          9.  Then, create connections from the ${boardName}'s GPIO pins to the corresponding rows on the breadboard (e.g., from 'GPIO17' to breadboard pin 'C10').
          10.  **Crucially, each unique signal from a ${boardName} GPIO pin must connect to a separate, unique row on the breadboard.** Do not connect two different GPIO pins to the same breadboard row. Power and Ground can share power rails.
          11. Use standard breadboard coordinates for pins: columns 'A'-'J' and rows '1'-'30'. Power rails are '+' and '-'.
          ` : `
          **Direct Wiring Instructions (No Breadboard):**
          5.  A breadboard IS NOT present. Connect component pins directly to the ${boardName} pins.
          `}
          **Intermediary Component Wiring Rule (VERY IMPORTANT):**
          Some components act as intermediaries (e.g., motor drivers like L298N, stepper motor drivers, display drivers like MAX7219). These components connect to both the main board (${boardName}) and to other "end-device" components (like DC motors, stepper motors, dot matrix displays).
          You MUST identify this hierarchy and generate connections in the correct sequence:
          1.  **Analyze Hierarchy:** First, determine which components are end-devices and which are their required intermediaries/drivers from the component list.
          2.  **End-Device to Intermediary:** Connect the end-device to its driver. For example, connect a DC Motor's terminals ('Positive (+)' and 'Negative (-)') to a motor driver's output pins (e.g., 'OUT1', 'OUT2').
          3.  **Intermediary to Main Board:** Then, connect the intermediary component's control pins (e.g., 'IN1', 'IN2', 'ENA') to the ${boardName}'s GPIO pins.
          4.  **Power Logic:** Connect the intermediary's logic power pins (e.g., '5V', 'VCC') to the ${boardName}'s power pins.
          5.  **External Power Warning:** If an intermediary component has a separate, high-power input pin (e.g., '12V' or 'VMOT' on a motor driver), you MUST explicitly state in the 'explanation' that this pin requires a separate, external power supply and must NOT be connected to the ${boardName}. This is a critical safety instruction.
          6.  **Distribution:** If there are multiple end-devices and multiple drivers, logically distribute the end-devices across the available drivers (e.g., up to two DC motors per L298N).
          **NodeMCU (ESP8266) Wiring Rule:**
          If a 'NodeMCU (ESP8266)' component is present, treat it as a secondary microcontroller, often used for Wi-Fi.
          1.  **Power:** Connect its 'VIN' pin to a 5V source (e.g., the Pi's '5V Power' pin or a breadboard rail connected to it). You MUST also connect one of its 'GND' pins to the common ground.
          2.  **Communication:** For communication with the Raspberry Pi, use the Pi's hardware serial (UART) pins. Connect the Pi's 'GPIO 14 (TXD)' to the NodeMCU's 'RX' pin, and the Pi's 'GPIO 15 (RXD)' to the NodeMCU's 'TX' pin.
          3.  **Pinout:** Use the exact pin names provided in the component list, such as 'VIN', 'GND', 'RX', 'TX', 'D0', 'D1', etc. The pins 'VCC', 'TXD', and 'RXD' are incorrect for this specific component.
          **General Instructions:**
          *   Ensure there are no pin conflicts on the ${boardName}.
          *   Provide a student-friendly explanation of the project. Format with newlines for paragraphs and '* ' for bullet points.
          *   **Resistor Requirement**: For any LEDs, you MUST:
              a. Explicitly state in the \`explanation\` that a current-limiting resistor (e.g., 220-330 Ohm) is required.
              b. Add a comment in the Python \`code\` indicating where the resistor should be placed. E.g., \`# GPIO 17 -> 220 Ohm Resistor -> LED Anode\`.
          **Final Connection Mandate (CRITICAL):**
          You MUST create connections for EVERY component listed in the 'Components on Canvas' section (except for the breadboard itself). Double-check your final \`connections\` array to ensure no component has been forgotten. Every device must be part of the circuit.
          **Simulation Plan Requirement**:
          *   Analyze the generated Python code. Based on its logic (e.g., \`time.sleep()\`, loops), create a detailed, time-sequenced plan of events.
          *   Provide this plan in the \`simulationSteps\` array. Each step is an object: \`{ timestamp, instanceId, action, value, line }\`.
          *   **Supported component actions**:
              *   LED/Buzzer/DC Motor: 'on', 'off'. For an RGB LED, the 'on' action can include a 'value' with a color name or hex code.
              *   Servo/Stepper Motor: 'rotate' (value is angle).
              *   LCD Display: 'display' (value is text, line is 1 or 2). To clear a line, use a 'display' action with an empty string as the value. To clear the entire display, you MUST provide two 'display' actions at the same timestamp, one for each line with an empty string.
              *   7-Segment Display: 'display' (value is a 7-bit string like "1111110" for segments a-g to display '0'). To clear, use a value like "0000000".
              *   8x8 Dot Matrix: 'display' (value is a simple icon name string like "heart", "smile", or "arrow"). To clear the display, use a 'display' action with an empty string as the value.
              *   Sensors (Temp, Pressure, etc.): 'setInput' (value is a reading like "25°C").
              *   Button/Keypad: 'setInput' (value is a state like "pressed", "released", or the key pressed "5").
          *   **Show cause and effect**: If a button press causes an LED to light up, create a 'setInput' step for the button, followed shortly by an 'on' step for the LED.
          *   The \`timestamp\` is the absolute time in milliseconds from the start when the event should occur.
          *   If the project is not simulatable, you MUST return an empty \`simulationSteps\` array.
          **Interactive Simulation Triggers Requirement**:
          *   Analyze the conditional logic in the generated code (e.g., if/else statements that read an input and control an output).
          *   Translate this logic into a set of triggers in the \`simulationTriggers\` array.
          *   Each trigger has a \`source\` (the input component, a condition like '>', and a value) and a list of \`actions\` (what the output components should do).
          *   For example, if the code says \`if temperature > 30: led.on()\`, the trigger would be: \`{ source: { instanceId: 'dht11-instance-id', condition: '>', value: 30 }, actions: [{ instanceId: 'led-instance-id', action: 'on' }] }\`. For an RGB LED, you can add a color value to the action, like \`{ instanceId: 'rgb-led-id', action: 'on', value: 'red' }\`.
          *   You MUST also generate the 'else' condition. For the example above, you must also generate: \`{ source: { instanceId: 'dht11-instance-id', condition: '<=', value: 30 }, actions: [{ instanceId: 'led-instance-id', action: 'off' }] }\`.
          *   This is crucial for making the simulation interactive. If there is no conditional logic, you MUST return an empty \`simulationTriggers\` array.
          The response MUST be a valid JSON object that strictly adheres to the provided schema. Do not include any markdown formatting.
        `;
    }

    createUnifiedArduinoPrompt(components: any, projectIdea: string, boardId: string, boardName: string, boardPinout: any, errors: any) {
        const componentList = components.map((c: any) => `- Unique Name: '${c.displayName}', instanceId: ${c.instanceId}, Type: ${c.name}, Pins: [${c.pinout.map((p: any) => `"${p.pin}"`).join(', ')}]`).join('\n');
        const hasBreadboard = components.some((c: any) => c.id.toLowerCase().includes('breadboard'));
        const breadboardInstanceId = components.find((c: any) => c.id.toLowerCase().includes('breadboard'))?.instanceId;
        const boardPinList = boardPinout.map((p: any) => `"${p.name}"`).join(', ');
        const errorCorrectionPrompt = (errors && errors.length > 0) ? `
          **CRITICAL CORRECTION REQUIRED:**
          Your previous attempt resulted in wiring errors. You MUST correct these mistakes.
          Errors to fix: ${errors.map((e: any) => `- ${e.type}: ${e.message}`).join('\n')}
          Re-evaluate your wiring and code to fix these specific issues.
        ` : '';
        return `
          You are an expert ${boardName} embedded systems engineer creating a tutorial for a beginner.
          The code MUST be written in C++/Arduino only.
          ${errorCorrectionPrompt}
          **Primary Requirement: Student's Idea**
          The student's idea is: "${projectIdea}". The generated code's logic MUST strictly implement this idea.
          **CRITICAL NAMING RULE:**
          Use the 'Unique Name' for each component (e.g., 'LED 1') for the \`ownerName\` in connections, in code variable names, and in the explanation.
          **Components on Canvas:**
          ${componentList}
          Your task is to generate a complete project.
          **Code Generation Rules:**
          - Provide the code in the \`code\` field as an array of objects. The first object MUST be for the main board.
          **Connection Rules:**
          1.  Connections use \`{ ownerId, ownerName, pin }\`.
          2.  For the ${boardName}, use \`ownerId\` '${boardId}' and \`ownerName\` '${boardName}'.
          3.  You MUST use an exact pin name for the ${boardName} from this list: [${boardPinList}].
          **ULTRA-CRITICAL PIN SELECTION RULE:** For every component, you MUST select one single, exact string from its provided pin list for the 'pin' field.
          **CRITICAL WIRING LOGIC:**
          **MANDATORY POWER SUPPLY WIRING:**
          There is always a component with the name 'Power Supply' present on the canvas. This is the primary power source. You MUST find its unique 'instanceId' from the component list and use it to create these mandatory connections as the first step:
          1. Connect its 'V+' pin to the main board's 'VIN' pin.
          2. Connect its 'GND' pin to one of the main board's 'GND' pins.
          All other components must receive power from the main board, not the Power Supply.
          1.  **Power to Power:** Connect 'VCC', '5V', etc. to the Arduino's '5V' or '3.3V' pins.
          2.  **Ground to Ground:** Connect ALL 'GND' pins to an Arduino 'GND' pin.
          3.  **Digital/Analog Data:** Connect I/O pins to Arduino Digital (D-pins) or Analog (A-pins). Use PWM pins (~) for analog output.
          4.  **I2C Bus Rule:** All 'SDA' pins go to Arduino's 'A4' (SDA). All 'SCL' pins go to 'A5' (SCL).
          5.  **SPI Bus Rule:** MOSI -> D11, MISO -> D12, SCK -> D13. Each SPI device needs a UNIQUE CS pin on the Arduino (e.g., D10, D9).
          6.  **Safety:** No power to ground. No GPIO to power.
          ${hasBreadboard ? `
          **Breadboard Wiring Instructions:**
          - A breadboard IS present (\`instanceId\`: '${breadboardInstanceId}'). You MUST route connections through it.
          - First, connect the Arduino's '5V' and 'GND' pins to the breadboard's power rails ('+' for positive and '-' for negative).
          - **ULTRA-CRITICAL BREADBOARD CHANNEL RULE:** The breadboard has a central channel dividing each numbered row into two isolated sections. The 'A' through 'E' columns of a row are connected, and the 'F' through 'J' columns are connected, but the two sides are NOT connected to each other. To link a component pin to an Arduino pin, they MUST be wired to the same half of the same row (e.g., one to pin 'E10' and the other to 'C10').
          - For each component, connect its pins to specific rows on the breadboard (e.g., 'Anode' to 'E10').
          - Then, connect the Arduino's pins to those same rows (e.g., 'D9' to 'C10').
          ` : `
          **Direct Wiring Instructions (No Breadboard):**
          - Connect component pins directly to the Arduino pins.
          `}
          **General Instructions:**
          - Provide a student-friendly explanation.
          - For LEDs, mention the need for a 220-330 Ohm resistor in the explanation and code comments.
          **Simulation and Trigger Requirements:**
          - Generate \`simulationSteps\` and \`simulationTriggers\` based on the C++ code logic, following the same detailed rules as the Python version.
          The response MUST be a valid JSON object.
        `;
    }

    createScaffoldPiPrompt(projectIdea: string, availableComponents: any, boardId: string, boardName: string, boardPinout: any, errors: any) {
        const componentsListString = availableComponents.map((c: any) => `- id: ${c.id}, name: "${c.name}", description: "${c.description}", pins: [${(c.pinout || []).map((p:any) => `"${p.pin}"`).join(', ')}]`).join('\n');
        const boardPinList = boardPinout.map((p: any) => `"${p.name}"`).join(', ');
        const errorCorrectionPrompt = (errors && errors.length > 0) ? `
          **CRITICAL CORRECTION REQUIRED:**
          Your previous attempt resulted in wiring errors. You MUST correct these mistakes.
          Errors to fix: ${errors.map((e: any) => `- ${e.type}: ${e.message}`).join('\n')}
          Re-evaluate your entire plan to fix these issues.
        ` : '';
        return `
            You are an expert Raspberry Pi 4 B systems engineer designing a project for a student.
            The main board's code MUST be written in Python only.
            ${errorCorrectionPrompt}
            **Student's Idea:** "${projectIdea}"
            Your task is to generate a complete project scaffold from scratch based on this idea. This includes selecting components, placing them, wiring them, and generating the code.
            **Available Components:**
            ${componentsListString}
            **CRITICAL INSTRUCTIONS:**
            1.  **Component Selection:** From the 'Available Components' list, select the MINIMUM number of components required to realize the student's idea.
            2.  **Mandatory Power Supply:** You MUST always include one 'power-supply' component in your selection and place it on the canvas.
            3.  **Component Placement (\`placedComponents\`):**
                - For each selected component, create a \`placedComponent\` object.
                - Assign a unique \`instanceId\` (e.g., 'led-12345') and a unique, user-facing \`displayName\` (e.g., 'LED 1').
                - Assign logical 'x' and 'y' coordinates for a 2000x1500 canvas. Place the main board at the center. Arrange other components neatly around it. Use a breadboard for complex circuits.
            4.  **Wiring, Code, Explanation, Simulation:** Follow all the detailed rules from the 'getUnifiedProjectInfo' prompt (power supply wiring, pin selection, breadboard logic including the ULTRA-CRITICAL channel rule, safety, etc.) to generate the rest of the response.
            The response MUST be a valid JSON object adhering to the schema.
        `;
    }

    createScaffoldArduinoPrompt(projectIdea: string, availableComponents: any, boardId: string, boardName: string, boardPinout: any, errors: any) {
        const componentsListString = availableComponents.map((c: any) => `- id: ${c.id}, name: "${c.name}", pins: [${(c.pinout || []).map((p:any) => `"${p.pin}"`).join(', ')}]`).join('\n');
        const boardPinList = boardPinout.map((p: any) => `"${p.name}"`).join(', ');
        const errorCorrectionPrompt = (errors && errors.length > 0) ? `
          **CRITICAL CORRECTION REQUIRED:**
          Your previous attempt had wiring errors: ${errors.map((e: any) => e.message).join(', ')}. Fix these.
        ` : '';
        return `
            You are an expert Arduino systems engineer designing a project.
            The code MUST be in C++/Arduino.
            ${errorCorrectionPrompt}
            **Student's Idea:** "${projectIdea}"
            **Available Components:**
            ${componentsListString}
            **CRITICAL INSTRUCTIONS:**
            1.  **Component Selection:** Select the MINIMUM components needed from the list.
            2.  **Mandatory Power Supply:** You MUST always include one 'power-supply' component in your selection and place it on the canvas.
            3.  **Component Placement (\`placedComponents\`):** Create a \`placedComponent\` object for each selection with unique IDs, names, and logical 'x'/'y' coordinates on a 2000x1500 canvas.
            4.  **Wiring, Code, Explanation, Simulation:** Follow all rules from the 'getArduinoUnifiedProjectInfo' prompt (power, pin selection, breadboard logic including the ULTRA-CRITICAL channel rule, etc.).
            The response MUST be a valid JSON object.
        `;
    }
    
    createComponentDetailsPrompt(componentName: string) {
        return `
            Provide technical details for the electronic component named "${componentName}".
            The response must be a JSON object adhering to the specified schema.
            - description: A brief, student-friendly description of the component.
            - voltage: The typical operating voltage range, e.g., '3.3V - 5V'.
            - pinout: An array of objects, each with a 'pin' name and its 'description'.
            - svgIconString: A complete, valid, single-color SVG string for the component's icon. It must be simple, clean, viewable on light and dark backgrounds, use 'currentColor' for fill/stroke, and have a viewBox='0 0 24 24'.
        `;
    }

    createBoardDetailsPrompt(boardName: string, additionalPrompt?: string) {
        return `
            Provide technical details and generate schematics for the board named "${boardName}".
            ${additionalPrompt ? `Apply this additional request: "${additionalPrompt}"` : ''}
            The response must be a JSON object.
            - description: A student-friendly description.
            - language: The primary language, either 'Python' or 'C++'.
            - svgSchematicStrings: An array of EXACTLY 3 distinct, valid, complete, single-color SVG strings for the board's simplified 2D schematic. They should be styled like a blueprint (e.g., using rects and circles to represent ports and chips). The SVG must have a viewBox='0 0 512 324'.
            - pinout: An array of all major pin objects, including name, x/y coordinates relative to the 512x324 SVG viewBox, and pin type.
        `;
    }

    createBoardNameSuggestionsPrompt(query: string) {
        return `The user searched for a board named "${query}", which was not found. Provide a JSON object with a 'suggestions' array containing 3-5 corrected or related board names.`;
    }

    createChallengeEvaluationPrompt(goal: string, successCondition: string, components: any, connections: any, code: string, boardName: string) {
        return `
            You are a teaching assistant for a hardware lab.
            A student has submitted a solution for a challenge.
            - **Board:** ${boardName}
            - **Challenge Goal:** ${goal}
            - **AI Success Condition:** ${successCondition}
            - **Student's Components:** ${JSON.stringify(components.map((c: any) => c.displayName))}
            - **Student's Wiring:** ${JSON.stringify(connections)}
            - **Student's Code:**
            \`\`\`
            ${code}
            \`\`\`
            Evaluate the student's entire solution (wiring and code) against the 'AI Success Condition'.
            Respond with a JSON object.
            - isCorrect: A boolean. True only if the solution is fully correct.
            - feedback: A concise, friendly explanation. If incorrect, explain what's wrong and provide a helpful pointer. If correct, congratulate them.
        `;
    }
    
    createHintPrompt(goal: string, components: any, connections: any, code: string, boardName: string) {
        return `
            You are a teaching assistant. A student is stuck on a challenge.
            - **Board:** ${boardName}
            - **Challenge Goal:** ${goal}
            - **Student's Current Attempt:**
              - **Components:** ${JSON.stringify(components.map((c: any) => c.displayName))}
              - **Wiring:** ${JSON.stringify(connections)}
              - **Code:** \`\`\`${code}\`\`\`
            Analyze their attempt and provide one single, small, specific hint to help them take the next step. Do not give away the whole answer. Focus on one error or one missing piece.
            Respond with a JSON object containing a single 'hint' string.
        `;
    }

    createCodeUpdatePrompt(userCode: any, components: any, connections: any, board: any) {
        return `
            You are a code analysis engine for an interactive hardware lab.
            A student has modified their code. Analyze it and update the project simulation and wiring if necessary.
            - **Board:** ${board.name} (${board.language})
            - **Components:** ${JSON.stringify(components.map((c: any) => ({ displayName: c.displayName, id: c.id, instanceId: c.instanceId })))}
            - **Current Wiring:** ${JSON.stringify(connections)}
            - **Student's New Code:**
            \`\`\`
            ${userCode[0].content}
            \`\`\`
            **Your Task:**
            1.  **Analyze the code:** Check for syntax errors, logical errors, or major deviations from standard library usage for the given board. If errors are found, populate the \`errors\` array with descriptions.
            2.  **If NO errors:**
                a.  **Update Simulation:** Re-generate the \`simulationSteps\` and \`simulationTriggers\` based on the new code logic.
                b.  **Update Wiring (if needed):** If the student changed a pin assignment in the code (e.g., \`led_pin = 22\` instead of \`17\`), you MUST generate a new, complete \`connections\` array reflecting this change. If the wiring is unaffected, OMIT the \`connections\` field.
                c.  **Update Explanation:** Write a new, brief explanation for what the modified code does.
                d.  **Code Correction (Optional):** If you see minor non-breaking errors or style issues, you may correct them in the returned \`code\` field. Otherwise, return the student's code as-is.
            Your response MUST be a valid JSON object.
        `;
    }
}