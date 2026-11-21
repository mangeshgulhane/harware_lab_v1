import type { Challenge } from '../types';

export const CHALLENGES: Challenge[] = [
  {
    id: 'pi-blink-led',
    title: 'Blinking an LED',
    difficulty: 'Beginner',
    boardId: 'raspberry-pi',
    goal: 'Connect a single LED to the Raspberry Pi through a breadboard and write Python code to make it blink on and off once every second (500ms on, 500ms off).',
    availableComponentIds: ['led', 'breadboard'],
    successConditionPrompt: 'The user has correctly connected an LED to a GPIO pin and ground via a breadboard. The Python code uses a loop and time.sleep(0.5) to toggle the LED state, creating a 1Hz blink.',
    mcq: {
      question: 'In Python, which function from the `time` library is used to pause the program for a specific number of seconds?',
      options: ['time.wait()', 'time.sleep()', 'time.pause()', 'time.stop()'],
      correctAnswerIndex: 1,
    },
  },
  {
    id: 'pi-button-led',
    title: 'Button-Controlled LED',
    difficulty: 'Beginner',
    boardId: 'raspberry-pi',
    goal: 'Using a breadboard, connect an LED and a push button to the Raspberry Pi. Write Python code so that the LED turns on only when the button is pressed and turns off when it is released.',
    availableComponentIds: ['led', 'button', 'breadboard'],
    successConditionPrompt: 'The user has correctly wired an LED to one GPIO pin and a button to another GPIO pin. The Python code correctly reads the button state and sets the LED state accordingly inside a loop.',
    mcq: {
      question: 'When reading a button connected to a GPIO pin, what electrical concept helps prevent a "floating" state where the input is undefined?',
      options: ['A capacitor', 'A pull-up or pull-down resistor', 'A diode', 'An inductor'],
      correctAnswerIndex: 1,
    },
  },
  {
    id: 'arduino-fade-led',
    title: 'Fading an LED',
    difficulty: 'Beginner',
    boardId: 'arduino',
    goal: 'Connect an LED to a PWM-capable pin on the Arduino. Write a C++ sketch to make the LED smoothly fade in and out.',
    availableComponentIds: ['led', 'breadboard'],
    successConditionPrompt: 'The user has connected an LED to a PWM pin (like D3, D5, D6, D9, D10, or D11). The C++ code uses analogWrite() and two for-loops (one counting up, one counting down) with a small delay() inside to create the fading effect.',
    mcq: {
      question: 'Which Arduino function is used to output a PWM signal to smoothly control an LED\'s brightness?',
      options: ['digitalWrite()', 'analogRead()', 'analogWrite()', 'setBrightness()'],
      correctAnswerIndex: 2,
    },
  },
];