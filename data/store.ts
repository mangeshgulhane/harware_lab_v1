import React from 'react';
import type { FC, SVGProps } from 'react';
import type { AdminData, Board, Component, StoredComponent, Connection, DroppedComponent, PinIdentifier, PinType, WiringError, BoardPin } from '../types';
import { DEFAULT_BOARDS, DEFAULT_COMPONENTS } from '../constants';
import { iconMap } from '../utils/iconMap';
import { LedIcon } from '../components/icons'; // Fallback icon

const ADMIN_DATA_KEY = 'hardware_lab_admin_data';

function seedData(): AdminData {
  const data: AdminData = {
    boards: DEFAULT_BOARDS,
    components: DEFAULT_COMPONENTS,
  };
  try {
      localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(data));
  } catch (e) {
      console.error("Could not write to local storage.", e);
  }
  return data;
}

export function getAdminData(): AdminData {
  try {
    const data = localStorage.getItem(ADMIN_DATA_KEY);
    if (!data) return seedData();
    const parsedData = JSON.parse(data) as AdminData;
    // Basic validation
    if (Array.isArray(parsedData.boards) && Array.isArray(parsedData.components)) {
      return parsedData;
    }
    return seedData();
  } catch (error) {
    console.error("Failed to load admin data, seeding default data.", error);
    return seedData();
  }
}

export function saveAdminData(data: AdminData): void {
  try {
    localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save admin data.", error);
  }
}

const SvgStringToComponent = (svgString: string): FC<SVGProps<SVGSVGElement>> => {
  const SvgComponent: FC<SVGProps<SVGSVGElement>> = (props) => {
    // The props (like className for sizing) are passed to the wrapper div.
    return React.createElement('div', { ...props, dangerouslySetInnerHTML: { __html: svgString } });
  };
  return SvgComponent;
};

function transformComponent(stored: StoredComponent): Component {
  let IconComponent: FC<SVGProps<SVGSVGElement>>;

  if (stored.Icon && stored.Icon.trim().startsWith('<svg')) {
    IconComponent = SvgStringToComponent(stored.Icon);
  } else {
    IconComponent = iconMap[stored.Icon];
  }

  if (!IconComponent) {
    console.warn(`Icon "${stored.Icon}" not found for component "${stored.name}". Using fallback.`);
    IconComponent = LedIcon;
  }
  
  return {
    ...stored,
    Icon: IconComponent,
  };
}


export function getComponentsForBoard(boardId: string): Component[] {
  const { components } = getAdminData();
  return components
    .filter(c => c.supportedBoards.includes(boardId))
    .map(transformComponent);
}

export function getAllBoards(): Board[] {
    return getAdminData().boards;
}

export function getBoardById(id: string): Board | undefined {
    return getAllBoards().find(b => b.id === id);
}

// --- WIRING VALIDATION SERVICE ---

const getPinTypeFromComponent = (pinName: string): PinType => {
    const upperPin = pinName.toUpperCase();
    if (upperPin.includes('VCC') || upperPin.includes('5V') || upperPin.includes('3.3V') || upperPin.includes('VIN') || upperPin.includes('POSITIVE') || upperPin === '+') return 'power-5v'; // Default to 5V power for components
    if (upperPin.includes('GND') || upperPin.includes('NEGATIVE') || upperPin === '-') return 'gnd';
    if (upperPin.includes('SDA')) return 'i2c-sda';
    if (upperPin.includes('SCL')) return 'i2c-scl';
    if (upperPin.includes('ANODE') || upperPin.includes('CATHODE') || upperPin.includes('DATA') || upperPin.includes('OUT') || upperPin.includes('IN') || upperPin.includes('PWM') || upperPin.includes('TRIG') || upperPin.includes('ECHO')) return 'gpio';
    return 'unknown';
};

const getPinDetails = (pinId: PinIdentifier, components: DroppedComponent[], board: Board): { type: PinType; voltage?: number } | null => {
    if (pinId.ownerId.endsWith('-board')) {
        const boardPin = board.pinout?.find(p => p.name === pinId.pin || p.name.split('_')[0] === pinId.pin);
        if (!boardPin) return null;
        let voltage: number | undefined;
        if (boardPin.type === 'power-5v') voltage = 5;
        if (boardPin.type === 'power-3.3v') voltage = 3.3;
        return { type: boardPin.type, voltage };
    }
    const component = components.find(c => c.instanceId === pinId.ownerId);
    if (!component) return null;
    const type = getPinTypeFromComponent(pinId.pin);
    const voltageMatch = component.voltage?.match(/(\d+(\.\d+)?)/);
    const voltage = voltageMatch ? parseFloat(voltageMatch[1]) : undefined;
    return { type, voltage };
};

const parseVoltage = (voltageString?: string): { min: number; max: number } | null => {
    if (!voltageString) return null;
    const numbers = voltageString.match(/\d+(\.\d+)?/g)?.map(parseFloat);
    if (!numbers || numbers.length === 0) return null;
    if (numbers.length === 1) return { min: numbers[0], max: numbers[0] };
    return { min: Math.min(...numbers), max: Math.max(...numbers) };
};

const getBreadboardConnectedPins = (pinName: string): string[] => {
    const upperPin = pinName.toUpperCase();

    // Handle simple aliases and legacy 'A' rail format
    const aliases: { [key: string]: string } = {
        '+': '+T0', '-': '-T0',
        '+A': '+T0', '-A': '-T0' // Legacy support for old format
    };

    // Normalize legacy A/B names to T/B. e.g. +A5 -> +T5
    const legacyMatch = upperPin.match(/^([+-])([AB])(\d*)$/);
    if (legacyMatch) {
        const sign = legacyMatch[1];
        const letter = legacyMatch[2] === 'A' ? 'T' : 'B';
        const number = legacyMatch[3] || '0';
        const normalizedPin = `${sign}${letter}${number}`;
        if (normalizedPin !== upperPin) {
          return getBreadboardConnectedPins(normalizedPin); // Recurse with normalized name
        }
    }
    if (aliases[upperPin]) {
        return getBreadboardConnectedPins(aliases[upperPin]);
    }

    // Power Rails (e.g., +T5, -B12)
    const railMatch = upperPin.match(/^([+-])([TB])(\d*)$/);
    if (railMatch) {
        const sign = railMatch[1];
        const railLetter = railMatch[2];
        const railPrefix = `${sign}${railLetter}`;
        const connected = [];
        for (let i = 0; i < 30; i++) {
            connected.push(`${railPrefix}${i}`);
        }
        return connected;
    }

    // Terminal Strips (e.g., A1, J30)
    const stripMatch = upperPin.match(/^([A-J])(\d+)$/);
    if (stripMatch) {
        const col = stripMatch[1];
        const row = stripMatch[2];
        const connected = [];
        if ('ABCDE'.includes(col)) {
            for (const c of 'ABCDE') { connected.push(`${c}${row}`); }
        } else { // F G H I J
            for (const c of 'FGHIJ') { connected.push(`${c}${row}`); }
        }
        return connected;
    }
    return [pinName];
};

const traceConnections = (
    connections: Connection[],
    board: Board,
    droppedComponents: DroppedComponent[],
    initialPinType: 'gnd' | 'power'
): Map<string, PinType> => {
    const tracedPins = new Map<string, PinType>();
    const boardId = `${board.id}-board`;

    // 1. Initialize with all relevant board pins
    board.pinout?.forEach(pin => {
        if ((initialPinType === 'gnd' && pin.type === 'gnd') || (initialPinType === 'power' && pin.type.startsWith('power'))) {
            tracedPins.set(`${boardId}:${pin.name}`, pin.type);
        }
    });

    // 2. Iteratively expand the set until no new pins are added
    let lastSize = -1;
    while (tracedPins.size > lastSize) {
        lastSize = tracedPins.size;
        
        // Expand based on external wire connections
        for (const conn of connections) {
            const fromId = `${conn.from.ownerId}:${conn.from.pin}`;
            const toId = `${conn.to.ownerId}:${conn.to.pin}`;
            
            const fromType = tracedPins.get(fromId);
            const toType = tracedPins.get(toId);

            if (fromType && !toType) {
                tracedPins.set(toId, fromType);
            }
            if (toType && !fromType) {
                tracedPins.set(fromId, toType);
            }
        }
        
        // Expand based on breadboard internal connections
        const breadboards = droppedComponents.filter(c => c.id === 'breadboard');
        for (const breadboard of breadboards) {
            const newlyTracedOnBreadboard = new Map<string, PinType>();
            tracedPins.forEach((type, pinId) => {
                const [ownerId, pinName] = pinId.split(':', 2);
                if (ownerId === breadboard.instanceId) {
                    newlyTracedOnBreadboard.set(pinName, type);
                }
            });

            for (const [pinName, type] of newlyTracedOnBreadboard.entries()) {
                const connectedPins = getBreadboardConnectedPins(pinName);
                for (const connectedPin of connectedPins) {
                    if (!tracedPins.has(`${breadboard.instanceId}:${connectedPin}`)) {
                        tracedPins.set(`${breadboard.instanceId}:${connectedPin}`, type);
                    }
                }
            }
        }
    }
    return tracedPins;
};


export function validateConnections(connections: Connection[], components: DroppedComponent[], board: Board): WiringError[] {
    if (connections.length === 0) return [];
    const errors: WiringError[] = [];

    const poweredPinMap = traceConnections(connections, board, components, 'power');
    const groundedSet = new Set(traceConnections(connections, board, components, 'gnd').keys());

    // Rule 1: Short circuits (any pin connected to both power and ground)
    const shortedPins = new Set([...poweredPinMap.keys()].filter(pinId => groundedSet.has(pinId)));
    if (shortedPins.size > 0) {
        const faultyConnections = connections.filter(conn => {
            const fromId = `${conn.from.ownerId}:${conn.from.pin}`;
            const toId = `${conn.to.ownerId}:${conn.to.pin}`;
            return shortedPins.has(fromId) || shortedPins.has(toId);
        });
        errors.push({ type: 'Short Circuit', message: `A direct or indirect path from power to ground was detected.`, faultyConnections });
    }

    // Rule 2: GPIO to Power
    for (const conn of connections) {
        const fromDetails = getPinDetails(conn.from, components, board);
        const toDetails = getPinDetails(conn.to, components, board);
        if (!fromDetails || !toDetails) continue;

        const fromIsGpio = fromDetails.type === 'gpio' || fromDetails.type === 'analog';
        const toIsGpio = toDetails.type === 'gpio' || toDetails.type === 'analog';
        const fromIsPowered = poweredPinMap.has(`${conn.from.ownerId}:${conn.from.pin}`);
        const toIsPowered = poweredPinMap.has(`${conn.to.ownerId}:${conn.to.pin}`);

        if ((fromIsGpio && toIsPowered) || (toIsGpio && fromIsPowered)) {
            errors.push({ type: 'GPIO to Power', message: `A GPIO pin should not be connected to a power line.`, faultyConnections: [conn] });
        }
    }

    // Rule 3: Voltage Mismatch
    const checkedComponents = new Set<string>();
    for (const [pinId, powerType] of poweredPinMap.entries()) {
        const [ownerId, pinName] = pinId.split(':', 2);
        if (checkedComponents.has(ownerId)) continue;
        const component = components.find(c => c.instanceId === ownerId);
        if (!component || !component.voltage || component.voltage === 'N/A') continue;

        const boardVoltage = powerType === 'power-5v' ? 5 : 3.3;
        const compVoltageRange = parseVoltage(component.voltage);

        if (compVoltageRange && (boardVoltage < compVoltageRange.min || boardVoltage > compVoltageRange.max)) {
            const faultyConnection = connections.find(c => c.from.ownerId === ownerId || c.to.ownerId === ownerId);
            errors.push({ type: 'Voltage Mismatch', message: `${component.name} expects ${component.voltage}, but is connected to a ${boardVoltage}V line.`, faultyConnections: faultyConnection ? [faultyConnection] : [] });
        }
        checkedComponents.add(ownerId);
    }
    
    // Rule 4: Missing Ground
    const poweredComponents = new Set<string>();
    poweredPinMap.forEach((_, pinId) => {
        const [ownerId] = pinId.split(':', 2);
        if (!ownerId.endsWith('-board')) { poweredComponents.add(ownerId); }
    });
    
    for(const comp of components) {
        if (!poweredComponents.has(comp.instanceId)) continue;
        
        const hasGroundPin = comp.pinout?.some(p => getPinTypeFromComponent(p.pin) === 'gnd');
        if (!hasGroundPin) continue;

        const isGrounded = comp.pinout.some(p => groundedSet.has(`${comp.instanceId}:${p.pin}`));
        if (!isGrounded) {
            errors.push({ type: 'Missing Ground', message: `The ${comp.name} is powered but not connected to ground.`, faultyConnections: [] });
        }
    }

    // Remove duplicate errors
    const uniqueErrors: WiringError[] = [];
    const seenMessages = new Set<string>();
    for (const error of errors) {
        if (!seenMessages.has(error.message)) {
            uniqueErrors.push(error);
            seenMessages.add(error.message);
        }
    }
    return uniqueErrors;
}