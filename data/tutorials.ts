import type { LearningPath } from '../types';

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'pi-basics',
    title: 'Raspberry Pi Basics',
    description: 'Learn the fundamentals of electronics and start building your first projects with the Raspberry Pi.',
    boardId: 'raspberry-pi',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Electronics 101',
        lessons: [
          {
            id: 'l1-1',
            title: 'The Flow of Electricity',
            steps: [
              {
                type: 'concept',
                title: 'What is a Circuit?',
                content: "Think of electricity like water flowing through pipes. For it to do any work, like spinning a water wheel, it needs a complete, unbroken path. This is called a **circuit**.\n\nElectricity flows from a high energy point (like the positive terminal of a battery) to a low energy point (the negative terminal). If there's a break anywhere in the path, the flow stops completely.",
                illustration: `<svg viewBox="0 0 100 60"><path d="M10 30 H 90" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4" /><rect x="5" y="20" width="10" height="20" fill="currentColor" /><text x="10" y="15" fill="currentColor" font-size="8">+</text><text x="10" y="55" fill="currentColor" font-size="8">-</text><path d="M 45 30 l 5 -5 l 5 10 l 5 -10 l 5 5" stroke="currentColor" stroke-width="2" fill="none" /><text x="50" y="15" fill="currentColor" font-size="6">Load</text></svg>`,
              },
              {
                type: 'concept',
                title: 'Voltage, Current, and Resistance',
                content: "Let's stick with the water analogy:\n\n* **Voltage (V)** is like the water pressure. More pressure means the water wants to flow with more force.\n\n* **Current (I)** is the actual amount of water flowing through the pipe. It's the rate of flow.\n\n* **Resistance (R)** is like a narrow section in the pipe that slows the water down. It controls how much current can flow.\n\nThese three are related by a simple rule called Ohm's Law: **Voltage = Current × Resistance**.",
              },
               {
                type: 'task',
                title: 'Your First Action',
                content: "Let's get comfortable with the lab. The panel on the left contains all the components you can use.",
                task: {
                  instruction: "Find the **Breadboard** in the component list and drag it onto the main canvas area.",
                  validation: {
                    type: 'placeComponent',
                    params: { componentId: 'breadboard' },
                    errorMessage: 'Not quite. Drag a breadboard component from the list on the left onto the canvas.',
                  },
                },
              },
            ],
          },
          {
            id: 'l1-2',
            title: 'Meet the Breadboard',
            steps: [
                {
                    type: 'concept',
                    title: 'Prototyping Made Easy',
                    content: "A breadboard is a special board that lets you build and test circuits without any soldering. It has lots of little holes that are connected internally in a specific way.",
                },
                {
                    type: 'concept',
                    title: 'Terminal Strips (Rows)',
                    content: "The main area is divided by a central channel. On each side, the five holes in each numbered row are electrically connected. For example, pin A1 is connected to B1, C1, D1, and E1. However, row 1 is NOT connected to row 2.",
                    illustration: "BREADBOARD_ROWS",
                },
                {
                    type: 'concept',
                    title: 'Power Rails (Columns)',
                    content: "The long lines on the top and bottom are called power rails. All the holes in the red (+) rail are connected together, and all the holes in the blue (-) rail are connected. This is very useful for supplying power and ground to many components at once.",
                    illustration: "BREADBOARD_RAILS",
                },
                {
                    type: 'task',
                    title: "Powering the Rails",
                    content: "It's standard practice to connect your main power source to the breadboard's power rails. This makes it easy to power all your other components.",
                    highlight: { type: 'pin', ownerId: 'raspberry-pi-board', pin: '5V Power (P2)' },
                    task: {
                        instruction: "Connect the Raspberry Pi's `5V Power` pin to the breadboard's top positive (+) rail.",
                        validation: {
                            type: 'createConnection',
                            params: { from: { owner: 'board', pin: '5V' }, to: { owner: 'breadboard', pin: '+' } },
                            errorMessage: "That's not it. Create a wire from a 5V pin on the Pi to the top positive (+) rail on the breadboard.",
                        }
                    }
                },
                {
                    type: 'task',
                    title: "Creating a Ground Connection",
                    content: "Every circuit needs a common ground reference. Let's connect the Pi's ground to the breadboard's ground rail.",
                    highlight: { type: 'pin', ownerId: 'raspberry-pi-board', pin: 'Ground (P6)' },
                    task: {
                        instruction: "Connect one of the Raspberry Pi's `Ground` pins to the breadboard's top negative (-) rail.",
                        validation: {
                            type: 'createConnection',
                            params: { from: { owner: 'board', pin: 'Ground' }, to: { owner: 'breadboard', pin: '-' } },
                            errorMessage: "Try again. Create a wire from a Ground (GND) pin on the Pi to the top negative (-) rail on the breadboard.",
                        }
                    }
                }
            ]
          },
           {
            id: 'l1-3',
            title: 'Your First Circuit',
            steps: [
                {
                    type: 'concept',
                    title: 'The LED',
                    content: "An LED (Light Emitting Diode) is a tiny light bulb that is very efficient. Crucially, it's a **diode**, which means electricity can only flow through it in one direction.\n\n* **Anode (+):** The longer leg. This connects towards the power source.\n* **Cathode (-):** The shorter leg. This connects towards the ground.",
                },
                {
                    type: 'concept',
                    title: 'The Resistor',
                    content: "An LED can't handle the full power from the Pi's pins directly. It would burn out! We must use a **current-limiting resistor** to reduce the flow of electricity to a safe level. Think of it as a bottleneck in the pipe that protects the fragile water wheel.",
                },
                {
                    type: 'task',
                    title: 'Place the LED',
                    content: "Let's start building.",
                    task: {
                        instruction: "Drag an **LED** from the component list and place it on the breadboard, with its two legs in two different rows.",
                        validation: {
                            type: 'placeComponent',
                            params: { componentId: 'led' },
                            errorMessage: "Drag an LED component from the list onto the breadboard.",
                        }
                    }
                },
                {
                    type: 'task',
                    title: 'Connect to Power',
                    content: "Now, let's connect the positive leg (Anode) to our power rail. We will imagine a resistor is in place for this simulation.",
                    task: {
                        instruction: "Connect the breadboard's positive (+) rail to the row containing the LED's **Anode**.",
                        validation: {
                            type: 'createConnection',
                            params: { from: { owner: 'breadboard', pin: '+' }, to: { owner: 'led', pin: 'Anode' } },
                            errorMessage: "Connect a wire from the positive power rail to the same breadboard row as the LED's Anode.",
                        }
                    }
                },
                 {
                    type: 'task',
                    title: 'Complete the Circuit',
                    content: "Finally, connect the negative leg (Cathode) back to the ground rail to complete the circuit.",
                    task: {
                        instruction: "Connect the row containing the LED's **Cathode** to the breadboard's negative (-) rail.",
                        validation: {
                            type: 'createConnection',
                            params: { from: { owner: 'led', pin: 'Cathode' }, to: { owner: 'breadboard', pin: '-' } },
                            errorMessage: "Connect a wire from the LED's Cathode row to the negative ground rail.",
                        }
                    }
                }
            ]
          },
          {
            id: 'l1-4',
            title: 'Thinking in Binary',
            steps: [
              {
                type: 'concept',
                title: 'Digital Logic',
                content: "Computers don't think in shades of gray; they think in black and white. Everything is either **ON** or **OFF**, **True** or **False**, **1** or **0**. This is called digital logic.\n\nA GPIO pin can be set to **HIGH** (outputting voltage, a '1') or **LOW** (connected to ground, a '0').",
              },
              {
                type: 'concept',
                title: 'The AND Gate',
                content: "A logic gate is like a tiny decision-maker. An **AND** gate has two inputs and one output. The output is **1** only if **both** Input A AND Input B are **1**.",
                illustration: `<svg viewBox="0 0 100 60"><path d="M20 20 H 40 C 60 20, 60 40, 40 40 H 20 Z" stroke="currentColor" stroke-width="2" fill="none" /><path d="M10 20 H 20 M10 40 H 20 M60 30 H 70" stroke="currentColor" stroke-width="2" fill="none" /><text x="5" y="20" fill="currentColor">A</text><text x="5" y="40" fill="currentColor">B</text><text x="75" y="30" fill="currentColor">Out</text></svg>`,
              },
              {
                type: 'concept',
                title: 'The OR Gate',
                content: "An **OR** gate's output is **1** if Input A OR Input B (or both) are **1**. It's only **0** if both inputs are **0**.",
                 illustration: `<svg viewBox="0 0 100 60"><path d="M20 15 C 30 20, 30 40, 20 45 Q 40 30, 60 30 Q 40 30, 20 15 Z" stroke="currentColor" stroke-width="2" fill="none" /><path d="M10 18 H 22 M10 42 H 22 M60 30 H 70" stroke="currentColor" stroke-width="2" fill="none" /><text x="5" y="18" fill="currentColor">A</text><text x="5" y="42" fill="currentColor">B</text><text x="75" y="30" fill="currentColor">Out</text></svg>`,
              },
              {
                type: 'task',
                title: 'Test Your Knowledge',
                content: 'Let\'s see if you\'ve got it.',
                task: {
                  instruction: 'Answer the question below.',
                  validation: {
                    type: 'mcq',
                    params: {
                      mcq: {
                        question: 'If an AND gate has Input A = 1 and Input B = 0, what is the output?',
                        options: ['1 (HIGH)', '0 (LOW)'],
                        correctAnswerIndex: 1,
                      },
                    },
                    errorMessage: 'Not quite. Remember, an AND gate requires BOTH inputs to be 1 for the output to be 1.',
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
