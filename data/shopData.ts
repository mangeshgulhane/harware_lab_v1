import type { ProductKit } from '../types';

export const PRODUCT_KITS: ProductKit[] = [
  {
    id: 'kit-1-beginner',
    name: 'Beginner "Core Skills" Kit',
    goal: 'To introduce the fundamental concepts of electronic circuits, digital and analog I/O (Input/Output), and basic programming logic.',
    imagePlaceholder: 'Beginner Kit',
    sensors: [
      { type: 'Digital Input', name: 'Push Button', purpose: 'The most basic digital input: reading a simple "on/off" or HIGH/LOW state.' },
      { type: 'Analog Input', name: 'Potentiometer (10kΩ)', purpose: 'The most basic analog input: reading a variable voltage (0-5V) to control things like brightness or speed.' },
      { type: 'Ambient Light', name: 'Photoresistor (LDR)', purpose: 'Analog sensing of environmental light levels. Introduces concepts like "if light > X, then do Y."' },
      { type: 'Temperature', name: 'Thermistor (e.g., NTC 10k)', purpose: 'Analog sensing of temperature. Teaches how to convert a changing resistance value into a meaningful unit (°C/°F).' },
      { type: 'Simple Motion', name: 'Tilt Sensor (Ball Switch)', purpose: 'A simple digital sensor that detects orientation or "is it tilted?"' },
      { type: 'Distance', name: 'Ultrasonic Sensor (HC-SR04)', purpose: 'Introduces digital signaling (Trig/Echo) to measure distance. A classic first "robot" sensor.' }
    ]
  },
  {
    id: 'kit-2-intermediate',
    name: 'Intermediate "Environmental" Kit',
    goal: 'To expand on core skills by interfacing with more capable sensors, reading complex environmental data, and controlling external circuits.',
    imagePlaceholder: 'Environmental Kit',
    sensors: [
        { type: 'Temp. & Humidity', name: 'DHT11 / DHT22', purpose: 'Reading two values (temperature & humidity) from a single digital sensor using a specific data protocol.' },
        { type: 'Atm. Pressure', name: 'BMP280 / BME280', purpose: 'Introduces the I2C communication protocol. Can be used as an altimeter and weather station.' },
        { type: 'Sound', name: 'Sound Sensor Module', purpose: 'Has both an analog output (sound volume) and a digital output (sound detected above a threshold).' },
        { type: 'Motion', name: 'PIR Motion Sensor (HC-SR501)', purpose: 'A "smart" digital sensor that detects human/animal motion. Ideal for automation projects (e.g., security lights).' },
        { type: 'Gas / Smoke', name: 'MQ-2 Gas Sensor', purpose: 'Analog sensing for smoke, LPG, and other combustible gases. Introduces sensor calibration and air quality concepts.' },
        { type: 'User Input', name: 'IR Receiver + Remote', purpose: 'Introduces decoding signals, a key concept for wireless control and robotics.' },
        { type: 'Actuator/Control', name: 'Relay Module (5V)', purpose: 'Not a sensor, but crucial at this level. Teaches how to use a low-voltage Arduino to safely control high-voltage AC devices.' }
    ]
  },
  {
    id: 'kit-3-advanced',
    name: 'Advanced "Data & Robotics" Kit',
    goal: 'To build complex, interactive projects using data logging, advanced motion sensing, and user identification systems. This kit moves beyond simple environmental reading to complex data gathering.',
    imagePlaceholder: 'Robotics Kit',
    sensors: [
        { type: 'Orientation', name: 'MPU-6050 (Gyro + Accelerometer)', purpose: 'Advanced I2C use. Measures 6-axis motion (roll, pitch, yaw, and X/Y/Z acceleration) for projects like self-balancing robots or gesture controllers.' },
        { type: 'Identification', name: 'RFID Reader (RC522)', purpose: 'Introduces SPI communication. Used for security, access control, and identification projects using RFID cards and keyfobs.' },
        { type: 'User Input', name: 'Joystick Module (PS2-style)', purpose: 'Two analog inputs (X/Y axis) and one digital input (button) in a single component. Essential for robot/game control.' },
        { type: 'User Input', name: '4x4 Membrane Keypad', purpose: 'Teaches multiplexing—reading 16 buttons using only 8 Arduino pins.' },
        { type: 'Environmental', name: 'Liquid Level Sensor', purpose: 'A simple analog sensor to detect water levels, perfect for automatic plant watering or tank monitoring projects.' },
        { type: 'Data Logging', name: 'MicroSD Card Module', purpose: 'Not a sensor, but essential for logging data from all the other sensors over time. Teaches file I/O on the Arduino.' },
        { type: 'Timekeeping', name: 'Real-Time Clock (RTC) (DS3231)', purpose: 'A separate I2C chip with a battery that keeps perfect time, even when the Arduino is off. Critical for data logging and scheduling.' }
    ]
  },
  {
    id: 'kit-4-expert',
    name: 'Expert / IoT Kit',
    goal: 'To build professional-grade, specialized prototypes focused on the Internet of Things (IoT), biometric feedback, and advanced environmental/AI analysis.',
    imagePlaceholder: 'IoT Kit',
    sensors: [
        { type: 'Connectivity', name: 'ESP8266 (WiFi Module) or ESP32', purpose: 'The core of an IoT kit. Allows the Arduino to connect to WiFi to send/receive data from the internet, APIs, or cloud dashboards.' },
        { type: 'Positioning', name: 'GPS Module (NEO-6M)', purpose: 'Teaches how to use serial communication (UART) to parse NMEA sentences and get precise global position, time, and speed.' },
        { type: 'Biometrics', name: 'Pulse Oximeter (MAX30100) or ECG (AD8232)', purpose: 'I2C sensor for measuring heart rate and blood oxygen. Introduces biometric data collection and filtering.' },
        { type: 'Biometrics', name: 'EMG Sensor (Muscle Sensor)', purpose: 'Analog sensor that measures electrical activity from muscles, allowing for gesture-based control or biomedical projects.' },
        { type: 'AI Vision', name: 'AI Vision Sensor (e.g., HuskyLens)', purpose: 'An advanced sensor that connects via I2C/UART to perform tasks like face, object, color, and line recognition, bringing AI to your projects.' },
        { type: 'Water Quality', name: 'TDS (Total Dissolved Solids) Sensor', purpose: 'Analog sensor for measuring water purity. Part of a suite for building a complete water quality monitoring station.' },
        { type: 'Water Quality', name: 'pH Sensor', purpose: 'A more complex analog sensor that requires calibration to measure the acidity or alkalinity of a liquid.' },
        { type: 'Precise Current', name: 'Current Sensor (ACS712)', purpose: 'Measures both AC and DC current. Essential for building power monitors, measuring energy consumption, or protecting motors.' },
        { type: 'Connectivity', name: 'LoRa Transceiver Module (e.g., RFM95)', purpose: 'For long-range, low-power data transmission (IoT) in areas without WiFi. Teaches principles of radio communication.' }
    ]
  }
];
