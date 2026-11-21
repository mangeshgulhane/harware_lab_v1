import type { BoardPin } from '../types';

// Raspberry Pi
export const RASPBERRY_PI_PIN_INFO: (BoardPin & { num: number })[] = [
  { num: 1, name: "3.3V (P1)", x: 434, y: 36, type: 'power-3.3v' }, { num: 2, name: "5V (P2)", x: 446, y: 36, type: 'power-5v' },
  { num: 3, name: "GPIO2 (SDA)", x: 434, y: 46, type: 'i2c-sda' }, { num: 4, name: "5V (P4)", x: 446, y: 46, type: 'power-5v' },
  { num: 5, name: "GPIO3 (SCL)", x: 434, y: 56, type: 'i2c-scl' }, { num: 6, name: "GND (P6)", x: 446, y: 56, type: 'gnd' },
  { num: 7, name: "GPIO4", x: 434, y: 66, type: 'gpio' }, { num: 8, name: "GPIO14 (TXD)", x: 446, y: 66, type: 'uart-tx' },
  { num: 9, name: "GND (P9)", x: 434, y: 76, type: 'gnd' }, { num: 10, name: "GPIO15 (RXD)", x: 446, y: 76, type: 'uart-rx' },
  { num: 11, name: "GPIO17", x: 434, y: 86, type: 'gpio' }, { num: 12, name: "GPIO18", x: 446, y: 86, type: 'gpio' },
  { num: 13, name: "GPIO27", x: 434, y: 96, type: 'gpio' }, { num: 14, name: "GND (P14)", x: 446, y: 96, type: 'gnd' },
  { num: 15, name: "GPIO22", x: 434, y: 106, type: 'gpio' }, { num: 16, name: "GPIO23", x: 446, y: 106, type: 'gpio' },
  { num: 17, name: "3.3V (P17)", x: 434, y: 116, type: 'power-3.3v' }, { num: 18, name: "GPIO24", x: 446, y: 116, type: 'gpio' },
  { num: 19, name: "GPIO10 (MOSI)", x: 434, y: 126, type: 'spi-mosi' }, { num: 20, name: "GND (P20)", x: 446, y: 126, type: 'gnd' },
  { num: 21, name: "GPIO9 (MISO)", x: 434, y: 136, type: 'spi-miso' }, { num: 22, name: "GPIO25", x: 446, y: 136, type: 'gpio' },
  { num: 23, name: "GPIO11 (SCLK)", x: 434, y: 146, type: 'spi-sclk' }, { num: 24, name: "GPIO8 (CE0)", x: 446, y: 146, type: 'spi-cs' },
  { num: 25, name: "GND (P25)", x: 434, y: 156, type: 'gnd' }, { num: 26, name: "GPIO7 (CE1)", x: 446, y: 156, type: 'spi-cs' },
  { num: 27, name: "ID_SD (for HATs)", x: 434, y: 166, type: 'id' }, { num: 28, name: "ID_SC (for HATs)", x: 446, y: 166, type: 'id' },
  { num: 29, name: "GPIO5", x: 434, y: 176, type: 'gpio' }, { num: 30, name: "GND (P30)", x: 446, y: 176, type: 'gnd' },
  { num: 31, name: "GPIO6", x: 434, y: 186, type: 'gpio' }, { num: 32, name: "GPIO12", x: 446, y: 186, type: 'gpio' },
  { num: 33, name: "GPIO13", x: 434, y: 196, type: 'gpio' }, { num: 34, name: "GND (P34)", x: 446, y: 196, type: 'gnd' },
  { num: 35, name: "GPIO19", x: 434, y: 206, type: 'gpio' }, { num: 36, name: "GPIO16", x: 446, y: 206, type: 'gpio' },
  { num: 37, name: "GPIO26", x: 434, y: 216, type: 'gpio' }, { num: 38, name: "GPIO20", x: 446, y: 216, type: 'gpio' },
  { num: 39, name: "GND (P39)", x: 434, y: 226, type: 'gnd' }, { num: 40, name: "GPIO21", x: 446, y: 226, type: 'gpio' },
];

// Arduino
export const ARDUINO_PIN_INFO: { name: string; description: string; coords: { x: number, y: number }, type: any }[] = [
    { name: 'AREF', description: 'Analog Reference', coords: { x: 236, y: 38 }, type: 'aref' }, { name: 'GND_TOP', description: 'Ground', coords: { x: 252, y: 38 }, type: 'gnd' },
    { name: 'D13', description: 'Digital Pin 13 (SPI SCK)', coords: { x: 268, y: 38 }, type: 'gpio' }, { name: 'D12', description: 'Digital Pin 12 (SPI MISO)', coords: { x: 284, y: 38 }, type: 'gpio' },
    { name: 'D11', description: 'Digital Pin 11 (PWM, SPI MOSI)', coords: { x: 300, y: 38 }, type: 'gpio' }, { name: 'D10', description: 'Digital Pin 10 (PWM, SPI SS)', coords: { x: 316, y: 38 }, type: 'gpio' },
    { name: 'D9', description: 'Digital Pin 9 (PWM)', coords: { x: 332, y: 38 }, type: 'gpio' }, { name: 'D8', description: 'Digital Pin 8', coords: { x: 348, y: 38 }, type: 'gpio' },
    { name: 'D7', description: 'Digital Pin 7', coords: { x: 380, y: 38 }, type: 'gpio' }, { name: 'D6', description: 'Digital Pin 6 (PWM)', coords: { x: 396, y: 38 }, type: 'gpio' },
    { name: 'D5', description: 'Digital Pin 5 (PWM)', coords: { x: 412, y: 38 }, type: 'gpio' }, { name: 'D4', description: 'Digital Pin 4', coords: { x: 428, y: 38 }, type: 'gpio' },
    { name: 'D3', description: 'Digital Pin 3 (PWM)', coords: { x: 444, y: 38 }, type: 'gpio' }, { name: 'D2', description: 'Digital Pin 2', coords: { x: 460, y: 38 }, type: 'gpio' },
    { name: 'D1', description: 'Digital Pin 1 (UART TX)', coords: { x: 476, y: 38 }, type: 'gpio' }, { name: 'D0', description: 'Digital Pin 0 (UART RX)', coords: { x: 492, y: 38 }, type: 'gpio' },
    { name: 'VIN', description: 'Voltage In', coords: { x: 186, y: 298 }, type: 'vin' }, { name: 'GND_2', description: 'Ground', coords: { x: 202, y: 298 }, type: 'gnd' },
    { name: 'GND_1', description: 'Ground', coords: { x: 218, y: 298 }, type: 'gnd' }, { name: '5V', description: '5V Power', coords: { x: 234, y: 298 }, type: 'power-5v' },
    { name: '3.3V', description: '3.3V Power', coords: { x: 250, y: 298 }, type: 'power-3.3v' }, { name: 'A5', description: 'Analog Pin 5 (I2C SCL)', coords: { x: 282, y: 298 }, type: 'analog' },
    { name: 'A4', description: 'Analog Pin 4 (I2C SDA)', coords: { x: 298, y: 298 }, type: 'analog' }, { name: 'A3', description: 'Analog Pin 3', coords: { x: 314, y: 298 }, type: 'analog' },
    { name: 'A2', description: 'Analog Pin 2', coords: { x: 330, y: 298 }, type: 'analog' }, { name: 'A1', description: 'Analog Pin 1', coords: { x: 346, y: 298 }, type: 'analog' },
    { name: 'A0', description: 'Analog Pin 0', coords: { x: 362, y: 298 }, type: 'analog' },
];

// Breadboard
export const BREADBOARD_WIDTH = 506;
export const BREADBOARD_HEIGHT = 215;
const generateBreadboardPins = () => {
    const pins: { [key: string]: { x: number; y: number } } = {};
    const numRows = 30;
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const rowSpacing = 12.7;
    const colSpacing = 12.7;
    const pinAreaWidth = (numRows - 1) * rowSpacing;
    const startX = (BREADBOARD_WIDTH - pinAreaWidth) / 2;
    const vMargin = 20;
    const railToBlockGap = 15;
    const pinBlockHeight = 4 * colSpacing;
    const gutterHeight = 18;
    const railTopY1 = vMargin;
    const railTopY2 = vMargin + colSpacing;
    const topBlockStartY = railTopY2 + railToBlockGap;
    const topBlockEndY = topBlockStartY + pinBlockHeight;
    const bottomBlockStartY = topBlockEndY + gutterHeight;
    const bottomBlockEndY = bottomBlockStartY + pinBlockHeight;
    const railBottomY1 = bottomBlockEndY + railToBlockGap;
    const railBottomY2 = railBottomY1 + colSpacing;
    for (let row = 1; row <= numRows; row++) {
        const x = startX + (row - 1) * rowSpacing;
        for (let c = 0; c < 5; c++) pins[`${cols[c]}${row}`] = { x, y: topBlockStartY + c * colSpacing };
        for (let c = 0; c < 5; c++) pins[`${cols[c+5]}${row}`] = { x, y: bottomBlockStartY + c * colSpacing };
    }
    for (let i = 0; i < numRows; i++) {
        const x = startX + i * rowSpacing;
        pins[`+T${i}`] = { x, y: railTopY1 }; pins[`-T${i}`] = { x, y: railTopY2 };
        pins[`+B${i}`] = { x, y: railBottomY1 }; pins[`-B${i}`] = { x, y: railBottomY2 };
    }
    pins['+'] = pins['+T0']; pins['-'] = pins['-T0'];
    return pins;
};
export const BREADBOARD_PIN_INFO = generateBreadboardPins();

// L298N
export const L298N_PIN_INFO: { [key: string]: { x: number; y: number } } = {
    '12V': { x: 20, y: 8 }, 'GND': { x: 55, y: 8 }, '5V':  { x: 90, y: 8 },
    'OUT1': { x: 138, y: 122 }, 'OUT2': { x: 162, y: 122 }, 'OUT3': { x: 18, y: 122 }, 'OUT4': { x: 42, y: 122 },
    'ENA': { x: 172, y: 40 }, 'IN1': { x: 172, y: 55 }, 'IN2': { x: 172, y: 70 },
    'IN3': { x: 172, y: 85 }, 'IN4': { x: 172, y: 100 }, 'ENB': { x: 172, y: 115 },
};

// Lora
export const LORA_PIN_INFO: { [key: string]: { x: number; y: number } } = {
    'VIN':  { x: 8, y: 50 }, 'GND':  { x: 8, y: 70 }, 'RST':  { x: 8, y: 90 },
    'DIO0': { x: 8, y: 110 }, 'DIO1': { x: 8, y: 130 }, 'DIO2': { x: 8, y: 150 }, 'DIO3': { x: 8, y: 170 },
    'MISO': { x: 172, y: 50 }, 'MOSI': { x: 172, y: 70 }, 'SCK':  { x: 172, y: 90 },
    'CS':   { x: 172, y: 110 }, 'DIO4': { x: 172, y: 130 }, 'DIO5': { x: 172, y: 150 },
};

// NodeMCU
export const NODEMCU_PIN_INFO: { [key: string]: { x: number; y: number } } = {
    'A0':      { x: 18, y: 90 }, 'GND':     { x: 18, y: 118 }, '3V3':     { x: 18, y: 146 },
    'D0':      { x: 18, y: 174 }, 'D1':      { x: 18, y: 202 }, 'D2':      { x: 18, y: 230 },
    'D3':      { x: 18, y: 258 }, 'D4':      { x: 18, y: 286 }, '3V3_2':   { x: 18, y: 314 },
    'GND_2':   { x: 18, y: 342 }, 'D5':      { x: 18, y: 370 }, 'D6':      { x: 18, y: 398 },
    'D7':      { x: 18, y: 426 }, 'D8':      { x: 18, y: 454 }, 'RX':      { x: 18, y: 482 },
    'TX':      { x: 238, y: 90 }, 'GND_3':   { x: 238, y: 118 }, '3V3_3':   { x: 238, y: 146 },
    'EN':      { x: 238, y: 174 }, 'RST':     { x: 238, y: 202 }, 'GND_4':   { x: 238, y: 230 },
    '3V3_4':   { x: 238, y: 258 }, 'SD_CLK':  { x: 238, y: 286 }, 'SD_D0':   { x: 238, y: 314 },
    'SD_D1':   { x: 238, y: 342 }, 'SD_D2':   { x: 238, y: 370 }, 'SD_D3':   { x: 238, y: 398 },
    'SD_CMD':  { x: 238, y: 426 }, '3V3_5':   { x: 238, y: 454 }, 'VIN':     { x: 238, y: 482 },
};


// General layout
export const DROPPED_ITEM_WIDTHS: {[key: string]: number} = {
  'breadboard': BREADBOARD_WIDTH,
  'l298n': 180, 
  'lora-rfm9x': 180,
  'nodemcu-esp8266': 128,
  'default': 192,
};