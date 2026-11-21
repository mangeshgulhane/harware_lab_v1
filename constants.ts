

import type { Board, BoardPin, StoredComponent } from './types';
import { RASPBERRY_PI_PIN_INFO, ARDUINO_PIN_INFO } from './data/boardData';

const piPinout: BoardPin[] = RASPBERRY_PI_PIN_INFO.map(p => ({
    name: p.name,
    x: p.x,
    y: p.y,
    type: p.type
}));

const arduinoPinout: BoardPin[] = ARDUINO_PIN_INFO.map(p => ({
    name: p.name,
    x: p.coords.x,
    y: p.coords.y,
    type: p.type
}));

export const DEFAULT_BOARDS: Board[] = [
  {
    id: 'raspberry-pi',
    name: 'Raspberry Pi 4 B',
    description: 'A versatile single-board computer for Python-based projects, from home automation to robotics.',
    boardComponent: 'RaspberryPiBoard',
    language: 'Python',
    pinout: piPinout,
  },
  {
    id: 'arduino',
    name: 'Arduino R3',
    description: 'A popular microcontroller for electronics projects, ideal for learning C++ and hardware interaction.',
    boardComponent: 'ArduinoBoard',
    language: 'C++',
    pinout: arduinoPinout,
  },
];

export const DEFAULT_COMPONENTS: StoredComponent[] = [
  {
    id: 'breadboard',
    name: 'Breadboard',
    Icon: 'BreadboardIcon',
    description: 'A solderless board for prototyping circuits. Rows are electrically connected.',
    voltage: 'N/A',
    category: 'Power',
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'power-supply',
    name: 'Power Supply',
    Icon: 'PowerSupplyIcon',
    description: 'Provides power to the circuit. Connect V+ to the board\'s power input (e.g., 5V or VIN) and GND to a ground pin.',
    voltage: '5V-12V',
    category: 'Power',
    pinout: [
      { pin: 'V+', description: 'Positive Voltage Output' },
      { pin: 'GND', description: 'Ground' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'led',
    name: 'LED',
    Icon: 'LedIcon',
    description: 'A Light Emitting Diode. Lights up when current flows through it. Requires a current-limiting resistor.',
    voltage: '2.0V - 3.3V',
    category: 'Output Devices',
    pinout: [
      { pin: 'Anode', description: 'Positive (+), Long leg' },
      { pin: 'Cathode', description: 'Negative (-), Short leg' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'rgb-led',
    name: 'RGB LED',
    Icon: 'RgbLedIcon',
    description: 'A combination of three LEDs (Red, Green, Blue) in one package. Can produce a wide range of colors.',
    voltage: 'R: 2.0V, G: 3.2V, B: 3.2V',
    category: 'Output Devices',
    pinout: [
      { pin: 'Red', description: 'Red Color Anode (+)' },
      { pin: 'Green', description: 'Green Color Anode (+)' },
      { pin: 'Blue', description: 'Blue Color Anode (+)' },
      { pin: 'Cathode', description: 'Common Ground (-)' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'button',
    name: 'Push Button',
    Icon: 'ButtonIcon',
    description: 'A simple switch that completes a circuit when pressed. Often used with a pull-up or pull-down resistor.',
    voltage: 'N/A',
    category: 'Input Devices',
    pinout: [
        { pin: '1A', description: 'Terminal 1' },
        { pin: '1B', description: 'Terminal 1' },
        { pin: '2A', description: 'Terminal 2' },
        { pin: '2B', description: 'Terminal 2' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'regex',
        pattern: '^(0|1)$',
        errorMessage: 'Enter 0 (released) or 1 (pressed).'
      }
    }
  },
  {
    id: 'potentiometer',
    name: 'Potentiometer',
    Icon: 'PotentiometerIcon',
    description: 'A variable resistor with a rotating knob. Used for analog input, like controlling volume or brightness.',
    voltage: '3.3V / 5V',
    category: 'Input Devices',
    pinout: [
        { pin: 'VCC', description: 'Positive Power' },
        { pin: 'GND', description: 'Ground' },
        { pin: 'OUT', description: 'Analog Output' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'number',
        min: 0,
        max: 1023,
        errorMessage: 'Enter a number between 0 and 1023.'
      }
    }
  },
  {
    id: 'photoresistor',
    name: 'Photoresistor (LDR)',
    Icon: 'PhotoresistorIcon',
    description: 'A Light Dependent Resistor. Its resistance decreases as the intensity of light increases. Used for detecting light levels.',
    voltage: '3.3V / 5V',
    category: 'Sensors',
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'number',
        min: 0,
        max: 1023,
        errorMessage: 'Enter a light level between 0 and 1023.'
      }
    }
  },
  {
    id: 'buzzer',
    name: 'Piezo Buzzer',
    Icon: 'BuzzerIcon',
    description: 'An electronic device that produces a tone or beep when a voltage is applied. Can be active (with internal oscillator) or passive.',
    voltage: '3.3V / 5V',
    category: 'Actuators',
    pinout: [
      { pin: 'Positive (+)', description: 'Positive (+)' },
      { pin: 'Negative (-)', description: 'Negative (-)' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'hc-sr04',
    name: 'HC-SR04 Ultrasonic Sensor',
    Icon: 'UltrasonicSensorIcon',
    description: 'A sensor that measures distance by sending out a sound wave and timing how long it takes to return.',
    voltage: '5V',
    category: 'Sensors',
    pinout: [
      { pin: 'VCC', description: '5V Power' },
      { pin: 'Trig', description: 'Trigger Pulse Input' },
      { pin: 'Echo', description: 'Echo Pulse Output' },
      { pin: 'GND', description: 'Ground' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'number',
        min: 2,
        max: 400,
        errorMessage: 'Enter a distance in cm (2-400).'
      }
    }
  },
  {
    id: 'dht11',
    name: 'DHT11 Temp & Humidity Sensor',
    Icon: 'TempSensorIcon',
    description: 'A basic, low-cost digital sensor for measuring temperature and humidity.',
    voltage: '3.3V - 5V',
    category: 'Sensors',
     pinout: [
      { pin: 'VCC', description: 'Power (3.3-5V)' },
      { pin: 'DATA', description: 'Digital Data Output' },
      { pin: 'GND', description: 'Ground' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'regex',
        pattern: '^-?\\d+(\\.\\d+)?\\s*C,\\s*\\d+(\\.\\d+)?\\s*%$',
        errorMessage: 'Format: "25 C, 40 %"'
      }
    }
  },
  {
    id: 'bmp280',
    name: 'BMP280 Barometric Pressure Sensor',
    Icon: 'PressureSensorIcon',
    description: 'A digital sensor that measures barometric pressure and temperature. Often used for weather monitoring or altitude sensing.',
    voltage: '3.3V',
    category: 'Sensors',
     pinout: [
      { pin: 'VCC', description: 'Power (3.3V)' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'SCL', description: 'I2C Clock' },
      { pin: 'SDA', description: 'I2C Data' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
     simulation: {
      isInput: true,
      validationRule: {
        type: 'regex',
        pattern: '^\\d+(\\.\\d+)?\\s*hPa$',
        errorMessage: 'Format: "1013.25 hPa"'
      }
    }
  },
  {
    id: 'hc-sr501',
    name: 'HC-SR501 PIR Motion Sensor',
    Icon: 'PirSensorIcon',
    description: 'A Passive Infrared (PIR) sensor that detects motion by measuring changes in infrared light.',
    voltage: '5V - 20V',
    category: 'Sensors',
    pinout: [
      { pin: 'VCC', description: 'Power (5-20V)' },
      { pin: 'OUT', description: 'Digital Output (High/Low)' },
      { pin: 'GND', description: 'Ground' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'regex',
        pattern: '^(0|1)$',
        errorMessage: 'Enter 0 (no motion) or 1 (motion).'
      }
    }
  },
  {
    id: 'sg90-servo',
    name: 'SG90 Servo Motor',
    Icon: 'ServoIcon',
    description: 'A small, lightweight motor that can be positioned to specific angular positions, typically between 0 and 180 degrees.',
    voltage: '4.8V - 6V',
    category: 'Actuators',
    pinout: [
      { pin: 'PWM', description: 'Control Signal (Orange)' },
      { pin: 'VCC', description: 'Power (Red)' },
      { pin: 'GND', description: 'Ground (Brown)' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'joystick',
    name: 'Joystick Module',
    Icon: 'JoystickIcon',
    description: 'A two-axis analog joystick with a push-button. Provides X/Y analog values and a digital signal for the button.',
    voltage: '3.3V / 5V',
    category: 'Input Devices',
    pinout: [
      { pin: 'VCC', description: 'Power' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'VRx', description: 'X-axis Analog Output' },
      { pin: 'VRy', description: 'Y-axis Analog Output' },
      { pin: 'SW', description: 'Switch Digital Output' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'relay-module',
    name: '5V Relay Module',
    Icon: 'RelayIcon',
    description: 'An electrically operated switch that allows a low-power signal to control a high-power circuit, isolating it from the switched (high-voltage) side.',
    voltage: '5V',
    category: 'Drivers',
    pinout: [
      { pin: 'VCC', description: '5V Power for control circuit' },
      { pin: 'GND', description: 'Ground for control circuit' },
      { pin: 'SIGNAL', description: 'Control Signal Input (IN)' },
      { pin: 'C', description: 'Common Terminal' },
      { pin: 'NO', description: 'Normally Open Terminal' },
      { pin: 'NC', description: 'Normally Closed Terminal' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'relay-module-2-channel',
    name: '5V 2-channel Relay Module',
    Icon: 'TwoChannelRelayIcon',
    description: 'A module with two electrically operated switches. Allows low-power signals to control two independent high-power circuits.',
    voltage: '5V',
    category: 'Drivers',
    pinout: [
      { pin: 'VCC', description: '5V Power for control circuit' },
      { pin: 'GND', description: 'Ground for control circuit' },
      { pin: 'IN1', description: 'Control Signal for Relay 1' },
      { pin: 'IN2', description: 'Control Signal for Relay 2' },
      { pin: 'C1', description: 'Common Terminal for Relay 1' },
      { pin: 'NO1', description: 'Normally Open for Relay 1' },
      { pin: 'NC1', description: 'Normally Closed for Relay 1' },
      { pin: 'C2', description: 'Common Terminal for Relay 2' },
      { pin: 'NO2', description: 'Normally Open for Relay 2' },
      { pin: 'NC2', description: 'Normally Closed for Relay 2' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'lcd-1602',
    name: '16x2 I2C LCD Display',
    Icon: 'LcdIcon',
    description: 'A 16-character by 2-line liquid-crystal display with an I2C interface for easy wiring.',
    voltage: '5V',
    category: 'Output Devices',
    pinout: [
      { pin: 'VCC', description: '5V Power' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'SCL', description: 'I2C Clock' },
      { pin: 'SDA', description: 'I2C Data' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'dc-motor',
    name: 'DC Motor',
    Icon: 'DcMotorIcon',
    description: 'A standard motor that provides continuous rotation. Speed is controlled by voltage.',
    voltage: '3V - 6V',
    category: 'Actuators',
    pinout: [
        { pin: 'Positive (+)', description: 'Positive Terminal' },
        { pin: 'Negative (-)', description: 'Negative Terminal' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'l298n',
    name: 'L298N Motor Driver',
    Icon: 'MotorDriverIcon',
    description: 'A module to control the speed and direction of up to two DC motors or one stepper motor.',
    voltage: '5V (Logic), 5V-35V (Motor)',
    category: 'Drivers',
    pinout: [
        { pin: '12V', description: 'Motor Power (5-35V)' },
        { pin: 'GND', description: 'Ground' },
        { pin: '5V', description: '5V Logic Power' },
        { pin: 'ENA', description: 'Enable Motor A (PWM Speed)' },
        { pin: 'IN1', description: 'Motor A Direction 1' },
        { pin: 'IN2', description: 'Motor A Direction 2' },
        { pin: 'IN3', description: 'Motor B Direction 1' },
        { pin: 'IN4', description: 'Motor B Direction 2' },
        { pin: 'ENB', description: 'Enable Motor B (PWM Speed)' },
        { pin: 'OUT1', description: 'Motor A Terminal 1' },
        { pin: 'OUT2', description: 'Motor A Terminal 2' },
        { pin: 'OUT3', description: 'Motor B Terminal 1' },
        { pin: 'OUT4', description: 'Motor B Terminal 2' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: '28byj-48',
    name: '28BYJ-48 Stepper Motor',
    Icon: 'StepperMotorIcon',
    description: 'A geared stepper motor for precise rotational control, often used with a ULN2003 driver board.',
    voltage: '5V',
    category: 'Actuators',
    pinout: [
        { pin: 'IN1/2/3/4', description: 'Control Pins' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
   {
    id: 'keypad-4x4',
    name: '4x4 Matrix Keypad',
    Icon: 'KeypadIcon',
    description: 'A 16-button keypad arranged in a 4x4 grid. Requires scanning rows and columns to read input.',
    voltage: '3.3V / 5V',
    category: 'Input Devices',
    pinout: [
        { pin: 'R1', description: 'Row 1' },
        { pin: 'R2', description: 'Row 2' },
        { pin: 'R3', description: 'Row 3' },
        { pin: 'R4', description: 'Row 4' },
        { pin: 'C1', description: 'Column 1' },
        { pin: 'C2', description: 'Column 2' },
        { pin: 'C3', description: 'Column 3' },
        { pin: 'C4', description: 'Column 4' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: '7-segment',
    name: '7-Segment Display',
    Icon: 'SevenSegmentIcon',
    description: 'An 8-LED package (7 segments + decimal point) for displaying numbers and some letters. Common Anode or Cathode.',
    voltage: '3.3V / 5V',
    category: 'Output Devices',
     pinout: [
        { pin: 'A-G, DP', description: 'Segment Control' },
        { pin: 'COM', description: 'Common Anode/Cathode' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'dot-matrix-8x8',
    name: '8x8 Dot Matrix (MAX7219)',
    Icon: 'DotMatrixIcon',
    description: 'A 64-LED matrix for displaying characters, symbols, and simple animations. Often controlled via a MAX7219 driver using SPI.',
    voltage: '5V',
    category: 'Output Devices',
    pinout: [
        { pin: 'VCC', description: '5V Power' },
        { pin: 'GND', description: 'Ground' },
        { pin: 'DIN', description: 'Data In (MOSI)' },
        { pin: 'CS', description: 'Chip Select' },
        { pin: 'CLK', description: 'Clock (SCLK)' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'soil-moisture-sensor',
    name: 'Soil Moisture Sensor',
    Icon: 'SoilMoistureIcon',
    description: 'A sensor that measures the volumetric water content in soil. Returns an analog value.',
    voltage: '3.3V - 5V',
    category: 'Sensors',
    pinout: [
        { pin: 'VCC', description: 'Power' },
        { pin: 'GND', description: 'Ground' },
        { pin: 'AOUT', description: 'Analog Output' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'number',
        min: 0,
        max: 1023,
        errorMessage: 'Enter a value between 0 (dry) and 1023 (wet).'
      }
    }
  },
  {
    id: 'sound-sensor',
    name: 'Sound Sensor Module',
    Icon: 'SoundSensorIcon',
    description: 'A module with a microphone that detects sound levels. Provides both analog and digital outputs.',
    voltage: '3.3V - 5V',
    category: 'Sensors',
     pinout: [
        { pin: 'VCC', description: 'Power' },
        { pin: 'GND', description: 'Ground' },
        { pin: 'AOUT', description: 'Analog Output' },
        { pin: 'DOUT', description: 'Digital Output' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
     simulation: {
      isInput: true,
      validationRule: {
        type: 'number',
        min: 0,
        max: 1023,
        errorMessage: 'Enter a sound level between 0 and 1023.'
      }
    }
  },
  {
    id: 'oled-ssd1306',
    name: 'OLED Display (SSD1306)',
    Icon: 'OledDisplayIcon',
    description: 'A small, crisp I2C graphical display for showing text and icons.',
    voltage: '3.3V - 5V',
    category: 'Output Devices',
    pinout: [
      { pin: 'VCC', description: 'Power (3.3V-5V)' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'SCL', description: 'I2C Clock' },
      { pin: 'SDA', description: 'I2C Data' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'tft-touchscreen',
    name: 'TFT Touchscreen',
    Icon: 'TftTouchscreenIcon',
    description: 'A full-color graphical display with touch input, typically using the SPI protocol.',
    voltage: '3.3V / 5V',
    category: 'Output Devices',
    pinout: [
      { pin: 'VCC', description: 'Power' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'CS', description: 'Chip Select' },
      { pin: 'RESET', description: 'Reset' },
      { pin: 'DC', description: 'Data/Command' },
      { pin: 'SDI(MOSI)', description: 'Data In (MOSI)' },
      { pin: 'SCK', description: 'Clock' },
      { pin: 'LED', description: 'Backlight Control' },
      { pin: 'SDO(MISO)', description: 'Data Out (MISO)' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'regex',
        pattern: '^\\d+,\\d+$',
        errorMessage: 'Enter coordinates as "x,y".'
      }
    }
  },
  {
    id: 'mpu-6050',
    name: 'Accelerometer & Gyroscope (MPU-6050)',
    Icon: 'AccelerometerIcon',
    description: 'A 6-axis motion tracking sensor that measures acceleration and rotation. Uses I2C.',
    voltage: '3.3V - 5V',
    category: 'Sensors',
    pinout: [
      { pin: 'VCC', description: 'Power' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'SCL', description: 'I2C Clock' },
      { pin: 'SDA', description: 'I2C Data' },
      { pin: 'INT', description: 'Interrupt' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'regex',
        pattern: '^-?\\d+(\\.\\d+)?(,-?\\d+(\\.\\d+)?){2,5}$',
        errorMessage: 'Enter numbers like "ax,ay,az" or "ax,ay,az,gx,gy,gz"'
      }
    }
  },
  {
    id: 'tcs34725',
    name: 'Color Sensor (TCS34725)',
    Icon: 'ColorSensorIcon',
    description: 'An I2C sensor that detects the color of an object.',
    voltage: '3.3V',
    category: 'Sensors',
    pinout: [
      { pin: 'VIN', description: 'Power' },
      { pin: '3V3', description: '3.3V Output' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'SCL', description: 'I2C Clock' },
      { pin: 'SDA', description: 'I2C Data' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'regex',
        pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
        errorMessage: 'Enter a hex color code, e.g., #FF0000.'
      }
    }
  },
  {
    id: 'mq-sensor',
    name: 'Gas/Smoke Sensor (MQ series)',
    Icon: 'GasSensorIcon',
    description: 'An analog sensor that detects the presence of various gases like smoke, CO, or alcohol.',
    voltage: '5V',
    category: 'Sensors',
    pinout: [
      { pin: 'VCC', description: 'Power' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'AOUT', description: 'Analog Output' },
      { pin: 'DOUT', description: 'Digital Output' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'number',
        min: 0,
        max: 1023,
        errorMessage: 'Enter a value between 0 and 1023.'
      }
    }
  },
  {
    id: 'rotary-encoder',
    name: 'Rotary Encoder',
    Icon: 'RotaryEncoderIcon',
    description: 'A knob for digital input that can be turned infinitely and has a push-button.',
    voltage: '3.3V / 5V',
    category: 'Input Devices',
    pinout: [
      { pin: 'CLK', description: 'Clock Signal' },
      { pin: 'DT', description: 'Data Signal' },
      { pin: 'SW', description: 'Switch' },
      { pin: '+', description: 'Power' },
      { pin: 'GND', description: 'Ground' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'regex',
        pattern: '^(CW|CCW|PRESS)$',
        errorMessage: 'Enter CW, CCW, or PRESS.'
      }
    }
  },
  {
    id: 'rfid-mfrc522',
    name: 'RFID Reader (MFRC522)',
    Icon: 'RfidReaderIcon',
    description: 'An SPI module for reading data from RFID cards and key fobs.',
    voltage: '3.3V',
    category: 'Sensors',
    pinout: [
      { pin: 'SDA(CS)', description: 'Chip Select' },
      { pin: 'SCK', description: 'Clock' },
      { pin: 'MOSI', description: 'MOSI' },
      { pin: 'MISO', description: 'MISO' },
      { pin: 'IRQ', description: 'Interrupt' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'RST', description: 'Reset' },
      { pin: '3.3V', description: '3.3V Power' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'regex',
        pattern: '^([0-9A-Fa-f]{2}:){3}[0-9A-Fa-f]{2}$',
        errorMessage: 'Enter a UID like "A1:B2:C3:D4".'
      }
    }
  },
  {
    id: 'ws2812b-strip',
    name: 'LED Strip (WS2812B)',
    Icon: 'LedStripIcon',
    description: 'A strip of individually addressable RGB LEDs (Neopixels) controlled by a single data line.',
    voltage: '5V',
    category: 'Output Devices',
    pinout: [
      { pin: '5V', description: '5V Power' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'DIN', description: 'Data In' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'bluetooth-hc05',
    name: 'Bluetooth Module (HC-05)',
    Icon: 'BluetoothModuleIcon',
    description: 'Enables wireless serial (UART) communication with other devices like phones or computers.',
    voltage: '3.3V (Logic), 5V (Power)',
    category: 'Communication',
    pinout: [
      { pin: 'VCC', description: 'Power (5V)' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'TXD', description: 'Transmit' },
      { pin: 'RXD', description: 'Receive' },
      { pin: 'KEY', description: 'Mode Select' },
      { pin: 'STATE', description: 'State' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'gps-neo-6m',
    name: 'GPS Module (NEO-6M)',
    Icon: 'GpsModuleIcon',
    description: 'Determines geographic location using satellite signals. Communicates location data via UART (Serial).',
    voltage: '3.3V - 5V',
    category: 'Sensors',
    pinout: [
      { pin: 'VCC', description: 'Power' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'TX', description: 'Transmit' },
      { pin: 'RX', description: 'Receive' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'regex',
        pattern: '^-?\\d+(\\.\\d+)?,-?\\d+(\\.\\d+)?$',
        errorMessage: 'Enter coordinates as "lat,lon".'
      }
    }
  },
  {
    id: 'sd-card-module',
    name: 'Micro SD Card Module',
    Icon: 'SdCardModuleIcon',
    description: 'Allows reading from and writing to a Micro SD card for data logging. Uses the SPI protocol.',
    voltage: '3.3V / 5V',
    category: 'Storage',
    pinout: [
      { pin: 'CS', description: 'Chip Select' },
      { pin: 'SCK', description: 'Clock' },
      { pin: 'MOSI', description: 'MOSI' },
      { pin: 'MISO', description: 'MISO' },
      { pin: 'VCC', description: 'Power' },
      { pin: 'GND', description: 'Ground' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'regex',
        pattern: '.*',
        errorMessage: 'Enter file content to read/write.'
      }
    }
  },
  {
    id: 'rtc-ds3231',
    name: 'RTC Module (DS3231)',
    Icon: 'RtcModuleIcon',
    description: 'Keeps accurate time and date using a backup battery. Uses the I2C protocol.',
    voltage: '3.3V - 5V',
    category: 'Sensors',
    pinout: [
      { pin: 'VCC', description: 'Power' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'SDA', description: 'I2C Data' },
      { pin: 'SCL', description: 'I2C Clock' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'regex',
        pattern: '^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$',
        errorMessage: 'Enter date as "YYYY-MM-DD HH:MM:SS".'
      }
    }
  },
  {
    id: 'fingerprint-sensor',
    name: 'Fingerprint Sensor',
    Icon: 'FingerprintSensorIcon',
    description: 'Scans and identifies fingerprints for biometric security. Communicates via UART (Serial).',
    voltage: '3.3V',
    category: 'Sensors',
    pinout: [
      { pin: 'VCC', description: 'Power (3.3V)' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'TX', description: 'Transmit' },
      { pin: 'RX', description: 'Receive' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'regex',
        pattern: '^ID:\\d+$',
        errorMessage: 'Enter a user ID like "ID:5".'
      }
    }
  },
  {
    id: 'e-ink-display',
    name: 'E-Ink / E-Paper Display',
    Icon: 'EInkDisplayIcon',
    description: 'A low-power display that retains its image without electricity. Uses the SPI protocol.',
    voltage: '3.3V',
    category: 'Output Devices',
    pinout: [
      { pin: 'VCC', description: 'Power (3.3V)' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'DIN', description: 'Data In (MOSI)' },
      { pin: 'CLK', description: 'Clock (SCK)' },
      { pin: 'CS', description: 'Chip Select' },
      { pin: 'DC', description: 'Data/Command' },
      { pin: 'RST', description: 'Reset' },
      { pin: 'BUSY', description: 'Busy Status' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'ir-receiver',
    name: 'IR Receiver',
    Icon: 'IrReceiverIcon',
    description: 'A sensor that detects infrared light, commonly used for receiving signals from remote controls.',
    voltage: '3.3V - 5V',
    category: 'Sensors',
    pinout: [
      { pin: 'VCC', description: 'Power' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'OUT', description: 'Signal Output' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'regex',
        pattern: '.*',
        errorMessage: 'Enter a remote code string.'
      }
    }
  },
  {
    id: 'ir-emitter',
    name: 'IR Emitter LED',
    Icon: 'IrEmitterIcon',
    description: 'A special LED that emits infrared light, used for sending signals like a remote control.',
    voltage: '1.2V - 1.5V',
    category: 'Output Devices',
    pinout: [
      { pin: 'Anode', description: 'Positive (+)' },
      { pin: 'Cathode', description: 'Negative (-)' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'max30102',
    name: 'Heart Rate Sensor (MAX30102)',
    Icon: 'HeartRateSensorIcon',
    description: 'A biometric I2C sensor that measures heart rate and blood oxygen saturation (SpO2).',
    voltage: '3.3V',
    category: 'Sensors',
    pinout: [
      { pin: 'VIN', description: 'Power Input' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'SCL', description: 'I2C Clock' },
      { pin: 'SDA', description: 'I2C Data' },
      { pin: 'INT', description: 'Interrupt' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'regex',
        pattern: '^\\d+\\s*BPM,\\s*\\d+\\s*%\\s*SpO2$',
        errorMessage: 'Format: "80 BPM, 98% SpO2"'
      }
    }
  },
  {
    id: 'fsr',
    name: 'Force-Sensitive Resistor (FSR)',
    Icon: 'FsrIcon',
    description: 'A sensor whose resistance changes based on applied force, pressure, or weight.',
    voltage: '3.3V / 5V',
    category: 'Sensors',
    pinout: [
      { pin: 'Terminal 1', description: 'Terminal 1' },
      { pin: 'Terminal 2', description: 'Terminal 2' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'number',
        min: 0,
        max: 1023,
        errorMessage: 'Enter a force value (0-1023).'
      }
    }
  },
  {
    id: 'lora-rfm9x',
    name: 'LoRa Module (RFM9x)',
    Icon: 'LoraModuleIcon',
    description: 'Enables long-range, low-power wireless communication using the LoRa protocol via SPI.',
    voltage: '3.3V',
    category: 'Communication',
    pinout: [
      { pin: 'VIN', description: '3.3V Power' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'MISO', description: 'SPI MISO' },
      { pin: 'MOSI', description: 'SPI MOSI' },
      { pin: 'SCK', description: 'SPI Clock' },
      { pin: 'CS', description: 'Chip Select' },
      { pin: 'RST', description: 'Reset' },
      { pin: 'DIO0', description: 'Digital I/O 0 (Interrupt)' },
      { pin: 'DIO1', description: 'Digital I/O 1' },
      { pin: 'DIO2', description: 'Digital I/O 2' },
      { pin: 'DIO3', description: 'Digital I/O 3' },
      { pin: 'DIO4', description: 'Digital I/O 4' },
      { pin: 'DIO5', description: 'Digital I/O 5' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'regex',
        pattern: '.*',
        errorMessage: 'Enter data to send/receive.'
      }
    }
  },
  {
    id: 'nfc-pn532',
    name: 'NFC/RFID Module (PN532)',
    Icon: 'NfcModuleIcon',
    description: 'An advanced module for reading/writing RFID/NFC tags using SPI or I2C.',
    voltage: '3.3V - 5V',
    category: 'Sensors',
    pinout: [
      { pin: 'VCC', description: 'Power' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'SS', description: 'SPI Chip Select' },
      { pin: 'MOSI', description: 'SPI MOSI' },
      { pin: 'MISO', description: 'SPI MISO' },
      { pin: 'SCK', description: 'SPI Clock' },
      { pin: 'RST', description: 'Reset' },
      { pin: 'IRQ', description: 'Interrupt' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: true,
      validationRule: {
        type: 'regex',
        pattern: '^([0-9A-Fa-f]{2}:){3,}[0-9A-Fa-f]{2}$',
        errorMessage: 'Enter a tag UID, e.g., "A1:B2:C3:D4".'
      }
    }
  },
  {
    id: 'nodemcu-esp8266',
    name: 'NodeMCU (ESP8266)',
    Icon: 'NodeMcuIcon',
    description: 'A standalone Wi-Fi enabled microcontroller board based on the ESP8266. Can be programmed directly for IoT projects.',
    voltage: '5V (VIN), 3.3V (Logic)',
    category: 'Boards',
    pinout: [
        { pin: 'A0', description: 'Analog Input' },
        { pin: 'GND', description: 'Ground' },
        { pin: '3V3', description: '3.3V Power' },
        { pin: 'D0', description: 'GPIO 16' },
        { pin: 'D1', description: 'GPIO 5 (SCL)' },
        { pin: 'D2', description: 'GPIO 4 (SDA)' },
        { pin: 'D3', description: 'GPIO 0' },
        { pin: 'D4', description: 'GPIO 2' },
        { pin: '3V3_2', description: '3.3V Power' },
        { pin: 'GND_2', description: 'Ground' },
        { pin: 'D5', description: 'GPIO 14' },
        { pin: 'D6', description: 'GPIO 12' },
        { pin: 'D7', description: 'GPIO 13' },
        { pin: 'D8', description: 'GPIO 15' },
        { pin: 'RX', description: 'GPIO 3 (RXD)' },
        { pin: 'TX', description: 'GPIO 1 (TXD)' },
        { pin: 'GND_3', description: 'Ground' },
        { pin: '3V3_3', description: '3.3V Power' },
        { pin: 'EN', description: 'Enable' },
        { pin: 'RST', description: 'Reset' },
        { pin: 'GND_4', description: 'Ground' },
        { pin: '3V3_4', description: '3.3V Power' },
        { pin: 'SD_CLK', description: 'GPIO 6' },
        { pin: 'SD_D0', description: 'GPIO 7' },
        { pin: 'SD_D1', description: 'GPIO 8' },
        { pin: 'SD_D2', description: 'GPIO 9' },
        { pin: 'SD_D3', description: 'GPIO 10' },
        { pin: 'SD_CMD', description: 'GPIO 11' },
        { pin: '3V3_5', description: '3.3V Power' },
        { pin: 'VIN', description: '5V Power In' }
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
    simulation: {
      isInput: false,
    }
  },
  {
    id: 'mux-74hc4051',
    name: '74HC4051 8-Ch Mux/Demux',
    Icon: 'MultiplexerIcon',
    description: 'An IC that connects one common pin (Z) to one of 8 selectable I/O pins (Y0-Y7). Used for expanding analog inputs or digital I/O.',
    voltage: '2V - 10V',
    category: 'I/O Expansion',
    pinout: [
      { pin: 'Y1', description: 'I/O Channel 1' },
      { pin: 'Y2', description: 'I/O Channel 2' },
      { pin: 'Z', description: 'Common I/O' },
      { pin: 'Y3', description: 'I/O Channel 3' },
      { pin: 'Y4', description: 'I/O Channel 4' },
      { pin: 'E', description: 'Enable (Active LOW)' },
      { pin: 'VEE', description: 'Negative Supply (GND)' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'S0', description: 'Select 0' },
      { pin: 'S1', description: 'Select 1' },
      { pin: 'S2', description: 'Select 2' },
      { pin: 'Y5', description: 'I/O Channel 5' },
      { pin: 'Y0', description: 'I/O Channel 0' },
      { pin: 'Y6', description: 'I/O Channel 6' },
      { pin: 'Y7', description: 'I/O Channel 7' },
      { pin: 'VCC', description: 'Positive Supply' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'decoder-74hc138',
    name: '74HC138 3-to-8 Decoder',
    Icon: 'DecoderIcon',
    description: 'An IC that takes a 3-bit binary input (A0-A2) and activates one of its 8 outputs (Y0-Y7) by setting it LOW. Useful for selecting one of many devices.',
    voltage: '2V - 6V',
    category: 'I/O Expansion',
    pinout: [
      { pin: 'A0', description: 'Address Input 0' },
      { pin: 'A1', description: 'Address Input 1' },
      { pin: 'A2', description: 'Address Input 2' },
      { pin: 'E1', description: 'Enable Input (Active LOW)' },
      { pin: 'E2', description: 'Enable Input (Active LOW)' },
      { pin: 'E3', description: 'Enable Input (Active HIGH)' },
      { pin: 'Y7', description: 'Output 7 (Active LOW)' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'Y6', description: 'Output 6 (Active LOW)' },
      { pin: 'Y5', description: 'Output 5 (Active LOW)' },
      { pin: 'Y4', description: 'Output 4 (Active LOW)' },
      { pin: 'Y3', description: 'Output 3 (Active LOW)' },
      { pin: 'Y2', description: 'Output 2 (Active LOW)' },
      { pin: 'Y1', description: 'Output 1 (Active LOW)' },
      { pin: 'Y0', description: 'Output 0 (Active LOW)' },
      { pin: 'VCC', description: 'Positive Supply' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'shift-register-74hc595',
    name: '74HC595 Shift Register (SIPO)',
    Icon: 'ShiftRegisterSipoIcon',
    description: 'A Serial-In, Parallel-Out (SIPO) shift register used to expand digital outputs. Data is shifted in one bit at a time.',
    voltage: '2V - 6V',
    category: 'I/O Expansion',
    pinout: [
      { pin: 'QB', description: 'Output B' },
      { pin: 'QC', description: 'Output C' },
      { pin: 'QD', description: 'Output D' },
      { pin: 'QE', description: 'Output E' },
      { pin: 'QF', description: 'Output F' },
      { pin: 'QG', description: 'Output G' },
      { pin: 'QH', description: 'Output H' },
      { pin: 'GND', description: 'Ground' },
      { pin: "QH'", description: 'Serial Out (Daisy-chain)' },
      { pin: 'SRCLR', description: 'Shift Clear (Active LOW)' },
      { pin: 'SRCK', description: 'Shift Register Clock' },
      { pin: 'RCK', description: 'Register Clock (Latch)' },
      { pin: 'OE', description: 'Output Enable (Active LOW)' },
      { pin: 'SER', description: 'Serial Data In' },
      { pin: 'QA', description: 'Output A' },
      { pin: 'VCC', description: 'Positive Supply' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'shift-register-74hc165',
    name: '74HC165 Shift Register (PISO)',
    Icon: 'ShiftRegisterPisoIcon',
    description: 'A Parallel-In, Serial-Out (PISO) shift register used to expand digital inputs. Reads 8 inputs at once and shifts them out one bit at a time.',
    voltage: '2V - 6V',
    category: 'I/O Expansion',
    pinout: [
      { pin: 'PL', description: 'Parallel Load (Active LOW)' },
      { pin: 'CP', description: 'Clock Pulse' },
      { pin: 'D4', description: 'Parallel Data 4' },
      { pin: 'D5', description: 'Parallel Data 5' },
      { pin: 'D6', description: 'Parallel Data 6' },
      { pin: 'D7', description: 'Parallel Data 7' },
      { pin: 'Q7', description: 'Serial Data Out' },
      { pin: 'GND', description: 'Ground' },
      { pin: '!Q7', description: 'Inverted Serial Out' },
      { pin: 'DS', description: 'Serial In (Daisy-chain)' },
      { pin: 'D0', description: 'Parallel Data 0' },
      { pin: 'D1', description: 'Parallel Data 1' },
      { pin: 'D2', description: 'Parallel Data 2' },
      { pin: 'D3', description: 'Parallel Data 3' },
      { pin: 'CE', description: 'Clock Enable (Active LOW)' },
      { pin: 'VCC', description: 'Positive Supply' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  },
  {
    id: 'io-expander-mcp23017',
    name: 'MCP23017 16-Bit I2C I/O Expander',
    Icon: 'IoExpanderMcp23017Icon',
    description: 'An I2C device that adds 16 general-purpose I/O pins (in two banks, GPA and GPB) controlled via the I2C bus.',
    voltage: '1.8V - 5.5V',
    category: 'I/O Expansion',
    pinout: [
      { pin: 'GPB0', description: 'Port B, Pin 0' },
      { pin: 'GPB1', description: 'Port B, Pin 1' },
      { pin: 'GPB2', description: 'Port B, Pin 2' },
      { pin: 'GPB3', description: 'Port B, Pin 3' },
      { pin: 'GPB4', description: 'Port B, Pin 4' },
      { pin: 'GPB5', description: 'Port B, Pin 5' },
      { pin: 'GPB6', description: 'Port B, Pin 6' },
      { pin: 'GPB7', description: 'Port B, Pin 7' },
      { pin: 'VCC', description: 'Positive Supply' },
      { pin: 'GND', description: 'Ground' },
      { pin: 'SCL', description: 'I2C Clock' },
      { pin: 'SDA', description: 'I2C Data' },
      { pin: 'A0', description: 'Address Select 0' },
      { pin: 'A1', description: 'Address Select 1' },
      { pin: 'A2', description: 'Address Select 2' },
      { pin: 'RESET', description: 'Reset (Active LOW)' },
      { pin: 'INTB', description: 'Interrupt Port B' },
      { pin: 'INTA', description: 'Interrupt Port A' },
      { pin: 'GPA7', description: 'Port A, Pin 7' },
      { pin: 'GPA6', description: 'Port A, Pin 6' },
      { pin: 'GPA5', description: 'Port A, Pin 5' },
      { pin: 'GPA4', description: 'Port A, Pin 4' },
      { pin: 'GPA3', description: 'Port A, Pin 3' },
      { pin: 'GPA2', description: 'Port A, Pin 2' },
      { pin: 'GPA1', description: 'Port A, Pin 1' },
      { pin: 'GPA0', description: 'Port A, Pin 0' },
    ],
    supportedBoards: ['raspberry-pi', 'arduino'],
  }
];