import type { FC, SVGProps } from 'react';

export const LedIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <path d="M14.5 13.08V21.5" stroke="#757575"/>
        <path d="M9.5 13.08V21.5" stroke="#757575"/>
        <path d="M14.5 16.5h-5" stroke="#616161"/>
        <path d="M12 2.5a4.5 4.5 0 0 1 4.5 4.5v3.2a2.88 2.88 0 0 1-2.88 2.88h-3.24a2.88 2.88 0 0 1-2.88-2.88V7a4.5 4.5 0 0 1 4.5-4.5Z" fill="#F44336" stroke="#E53935"/>
        <path d="m8.5 8.5 3.5 3.5m-1-3.5 1-1" stroke="#FFCDD2" strokeWidth="1"/>
    </g>
  </svg>
);

export const ButtonIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="none">
        <path d="M3.5 8.5h17v7H3.5z" fill="#616161"/>
        <path d="M4 8v8h16V8" fill="#757575"/>
        <path d="M12 5.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" fill="#424242"/>
        <path d="M12 7.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#212121"/>
        <path d="M6 15.5v4m12-4v4" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  </svg>
);

export const UltrasonicSensorIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M2 7h20v13H2z" fill="#29B6F6"/>
    <path d="M7 3a3 3 0 0 1 3 3v2H4V6a3 3 0 0 1 3-3z" fill="#BDBDBD"/>
    <path d="M7 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#757575"/>
    <path d="M17 3a3 3 0 0 1 3 3v2h-6V6a3 3 0 0 1 3-3z" fill="#BDBDBD"/>
    <path d="M17 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#757575"/>
    <path d="M5 18h2v2H5zm4 0h2v2H9zm4 0h2v2h-2zm4 0h2v2h-2z" fill="#FFC107"/>
  </svg>
);

export const TempSensorIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 4h16v16H4z" fill="#29B6F6"/>
      <path d="M8 7h8v10H8z" fill="#EEEEEE"/>
      <path d="M8 11h8m-8-2h8m-8 4h8m-8 2h8" stroke="#BDBDBD" strokeWidth=".5"/>
      <path d="M6 20h2v2H6zm4 0h2v2h-2zm4 0h2v2h-2z" fill="#FFC107"/>
    </svg>
);

export const PressureSensorIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 7h16v10H4z" fill="#00695C"/>
      <rect x="9" y="9" width="6" height="6" rx="1" fill="#78909C"/>
      <rect x="9.5" y="9.5" width="5" height="5" rx=".5" fill="#B0BEC5"/>
      <path d="M5 17h2v2H5zm3 0h2v2H8zm8 0h2v2h-2zm3 0h2v2h-2z" fill="#FFC107"/>
    </svg>
);

export const PirSensorIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 10h16v10H4z" fill="#4CAF50"/>
      <path d="M12 10a8 8 0 0 1 8 8H4a8 8 0 0 1 8-8z" fill="#FFF"/>
      <path opacity=".2" d="M12 2a8 8 0 0 0-8 8h16a8 8 0 0 0-8-8z"/>
      <path d="M8 18h2v2H8zm4 0h2v2h-2z" fill="#FFC107"/>
    </svg>
);

export const ServoIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 8h18v10H3z" fill="#03A9F4"/>
      <path d="M11 3h2v5h-2z" fill="#E0E0E0"/>
      <path d="M12 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="#BDBDBD"/>
      <path d="M7 3h10v1H7zm-2 2h14v1H5z" fill="#FAFAFA"/>
      <path d="M4 18h2v2H4zm5 0h2v2H9zm5 0h2v2h-2z" fill="#FFC107"/>
    </svg>
);

export const LcdIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2 5h20v14H2z" fill="#4CAF50"/>
      <path d="M4 7h16v10H4z" fill="#00695C"/>
      <path d="M4 17h2v2H4zm4 0h2v2H8zm8 0h2v2h-2zm4 0h2v2h-2z" fill="#FFC107"/>
    </svg>
);

export const PotentiometerIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7 7h10v10H7z" fill="#03A9F4"/>
      <path d="M12 4a5 5 0 0 1 5 5v1h-10V9a5 5 0 0 1 5-5z" fill="#424242"/>
      <path d="M12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill="#616161"/>
      <path d="M11 5v2h2V5z" fill="#fff"/>
      <path d="M8 17h2v3H8zm4 0h2v3h-2zm4 0h2v3h-2z" fill="#9E9E9E"/>
    </svg>
);

export const BuzzerIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="8" fill="#212121"/>
      <circle cx="12" cy="12" r="7" fill="#424242"/>
      <circle cx="12" cy="12" r="2" fill="#212121"/>
      <path d="M10 20h2v2h-2zm4-2h-2v2h2z" fill="#9E9E9E"/>
    </svg>
);

export const RgbLedIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2a5 5 0 0 1 5 5v4a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V7a5 5 0 0 1 5-5z" fill="#fff" opacity=".8"/>
    <g strokeLinecap="round" strokeWidth="1.5">
        <path d="M15.5 13v9" stroke="#757575"/>
        <path d="M12.5 13v9" stroke="#616161"/>
        <path d="M8.5 13v9" stroke="#757575"/>
        <path d="M5.5 13v9" stroke="#757575"/>
    </g>
    <circle cx="9" cy="9" r="1.5" fill="#F44336"/>
    <circle cx="15" cy="9" r="1.5" fill="#4CAF50"/>
    <circle cx="12" cy="6" r="1.5" fill="#2196F3"/>
  </svg>
);

export const PhotoresistorIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="8" fill="#FFC107"/>
    <path d="M8 12h8m-7-2 2 4 2-4 2 4" stroke="#E65100" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 20h2v2H9zm4 0h2v2h-2z" fill="#9E9E9E"/>
  </svg>
);

export const RelayIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="2" y="4" width="20" height="16" rx="2" fill="#29B6F6"/>
        <rect x="7" y="6" width="10" height="8" rx="1" fill="#FFFFFF" stroke="#BDBDBD"/>
        
        {/* Control Pins (VCC, GND, IN) */}
        <rect x="4" y="18" width="2" height="4" fill="#FFC107" />
        <rect x="8" y="18" width="2" height="4" fill="#FFC107" />
        <rect x="12" y="18" width="2" height="4" fill="#FFC107" />

        {/* Switched Pins (NC, C, NO) - as screw terminals */}
        <rect x="17" y="5" width="6" height="4" rx="1" fill="#616161"/>
        <circle cx="20" cy="7" r="1" fill="#BDBDBD"/>
        
        <rect x="17" y="10" width="6" height="4" rx="1" fill="#616161"/>
        <circle cx="20" cy="12" r="1" fill="#BDBDBD"/>
        
        <rect x="17" y="15" width="6" height="4" rx="1" fill="#616161"/>
        <circle cx="20" cy="17" r="1" fill="#BDBDBD"/>
    </svg>
);

export const TwoChannelRelayIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 32 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Main Board */}
        <rect x="1" y="1" width="30" height="22" rx="2" fill="#D32F2F"/>
        
        {/* Relay 1 */}
        <rect x="3" y="3" width="12" height="18" rx="1" fill="#29B6F6"/>
        <rect x="5" y="8" width="8" height="8" rx="1" fill="#FFFFFF" stroke="#BDBDBD"/>
        
        {/* Relay 2 */}
        <rect x="17" y="3" width="12" height="18" rx="1" fill="#29B6F6"/>
        <rect x="19" y="8" width="8" height="8" rx="1" fill="#FFFFFF" stroke="#BDBDBD"/>
        
        {/* Control Pins (bottom) - VCC, GND, IN1, IN2 */}
        <g>
            <rect x="18" y="21" width="2" height="3" fill="#FFC107"/>
            <rect x="21" y="21" width="2" height="3" fill="#FFC107"/>
            <rect x="24" y="21" width="2" height="3" fill="#FFC107"/>
            <rect x="27" y="21" width="2" height="3" fill="#FFC107"/>
        </g>
        
        {/* Switched Pins (top) */}
        {/* Relay 1 Terminals */}
        <g>
            <rect x="4" y="0" width="3" height="3" rx=".5" fill="#616161"/>
            <circle cx="5.5" cy="1.5" r=".75" fill="#BDBDBD"/>
            <rect x="8" y="0" width="3" height="3" rx=".5" fill="#616161"/>
            <circle cx="9.5" cy="1.5" r=".75" fill="#BDBDBD"/>
            <rect x="12" y="0" width="3" height="3" rx=".5" fill="#616161"/>
            <circle cx="13.5" cy="1.5" r=".75" fill="#BDBDBD"/>
        </g>
        
        {/* Relay 2 Terminals */}
        <g>
            <rect x="18" y="0" width="3" height="3" rx=".5" fill="#616161"/>
            <circle cx="19.5" cy="1.5" r=".75" fill="#BDBDBD"/>
            <rect x="22" y="0" width="3" height="3" rx=".5" fill="#616161"/>
            <circle cx="23.5" cy="1.5" r=".75" fill="#BDBDBD"/>
            <rect x="26" y="0" width="3" height="3" rx=".5" fill="#616161"/>
            <circle cx="27.5" cy="1.5" r=".75" fill="#BDBDBD"/>
        </g>
    </svg>
);

export const JoystickIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 4h16v16H4z" fill="#F44336"/>
      <path d="M12 9a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6z" fill="#424242"/>
      <circle cx="12" cy="9" r="3" fill="#212121"/>
      <path d="M6 20h2v2H6zm3 0h2v2H9zm4 0h2v2h-2zm3 0h2v2h-2zm3 0h2v2h-2z" fill="#FFC107"/>
    </svg>
);

export const BreadboardIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="24" height="24" rx="2" fill="#FAFAFA"/>
        <path d="M2 7h20m-20 10h20" stroke="#EF5350" strokeWidth="2"/>
        <path d="M2 9h20m-20 6h20" stroke="#42A5F5" strokeWidth="2"/>
        <path fill="#CFD8DC" d="M5 11h14v2H5z"/>
    </svg>
);

export const PowerSupplyIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="4" y="4" width="16" height="16" rx="2" fill="#424242"/>
        <rect x="6" y="6" width="12" height="12" rx="1" fill="#616161"/>
        <path d="M10 10h4M12 8v4" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 16h4" stroke="#F44336" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

export const DcMotorIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="12" cy="14" r="8" fill="#BDBDBD"/>
        <circle cx="12" cy="14" r="7" fill="#E0E0E0"/>
        <path d="M11 2h2v4h-2z" fill="#757575"/>
        <path d="M15 14a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" fill="#9E9E9E"/>
        <path d="M18 20h2v2h-2zm-14 0h2v2H4z" fill="#FFC107"/>
    </svg>
);

export const MotorDriverIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="2" y="2" width="20" height="20" rx="1" fill="#D32F2F"/>
        <rect x="7" y="5" width="10" height="14" fill="#424242"/>
        <path d="M8 6h2m2 0h2M8 8h2m2 0h2M8 10h2m2 0h2" stroke="#616161" strokeWidth="1" strokeLinecap="round"/>
    </svg>
);

export const StepperMotorIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="12" cy="12" r="9" fill="#90A4AE"/>
        <circle cx="12" cy="12" r="8" fill="#B0BEC5"/>
        <circle cx="12" cy="12" r="4" fill="#78909C"/>
        <rect x="10.5" y="2" width="3" height="4" rx="1" fill="#CFD8DC"/>
    </svg>
);

export const KeypadIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" fill="#E0E0E0"/>
        <rect x="5" y="5" width="3" height="3" rx=".5" fill="#BDBDBD"/>
        <rect x="9" y="5" width="3" height="3" rx=".5" fill="#BDBDBD"/>
        <rect x="13" y="5" width="3" height="3" rx=".5" fill="#BDBDBD"/>
        <rect x="5" y="9" width="3" height="3" rx=".5" fill="#BDBDBD"/>
        <rect x="9" y="9" width="3" height="3" rx=".5" fill="#BDBDBD"/>
        <rect x="13" y="9" width="3" height="3" rx=".5" fill="#BDBDBD"/>
        <rect x="5" y="13" width="3" height="3" rx=".5" fill="#BDBDBD"/>
        <rect x="9" y="13" width="3" height="3" rx=".5" fill="#BDBDBD"/>
        <rect x="13" y="13" width="3" height="3" rx=".5" fill="#BDBDBD"/>
    </svg>
);

export const SevenSegmentIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="4" y="4" width="16" height="16" rx="1" fill="#212121"/>
        <g fill="#F44336" opacity=".3">
            <path d="M9 7h6v1H9z"/>
            <path d="M8 8v4h1V8z"/>
            <path d="M15 8v4h1V8z"/>
            <path d="M9 12h6v1H9z"/>
            <path d="M8 13v4h1v-4z"/>
            <path d="M15 13v4h1v-4z"/>
            <path d="M9 17h6v1H9z"/>
        </g>
    </svg>
);

export const DotMatrixIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="1" fill="#212121"/>
        <circle cx="6" cy="6" r="1" fill="#F44336" opacity=".3"/>
        <circle cx="9" cy="6" r="1" fill="#F44336" opacity=".3"/>
        <circle cx="12" cy="6" r="1" fill="#F44336" opacity=".3"/>
        <circle cx="15" cy="6" r="1" fill="#F44336" opacity=".3"/>
        <circle cx="6" cy="9" r="1" fill="#F44336" opacity=".3"/>
        <circle cx="9" cy="9" r="1" fill="#F44336" opacity=".3"/>
        <circle cx="12" cy="9" r="1" fill="#F44336" opacity=".3"/>
        <circle cx="15" cy="9" r="1" fill="#F44336" opacity=".3"/>
        <circle cx="6" cy="12" r="1" fill="#F44336" opacity=".3"/>
        <circle cx="9" cy="12" r="1" fill="#F44336" opacity=".3"/>
        <circle cx="12" cy="12" r="1" fill="#F44336" opacity=".3"/>
        <circle cx="15" cy="12" r="1" fill="#F44336" opacity=".3"/>
        <circle cx="6" cy="15" r="1" fill="#F44336" opacity=".3"/>
        <circle cx="9" cy="15" r="1" fill="#F44336" opacity=".3"/>
        <circle cx="12" cy="15" r="1" fill="#F44336" opacity=".3"/>
        <circle cx="15" cy="15" r="1" fill="#F44336" opacity=".3"/>
    </svg>
);

export const SoilMoistureIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M15 2v20h-2V2zM9 2v20H7V2z" fill="#AED581"/>
        <path d="M14 2v20h-1V2zm-5 0v20H8V2z" fill="#7CB342"/>
    </svg>
);

export const SoundSensorIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="4" y="7" width="16" height="10" rx="1" fill="#29B6F6"/>
        <circle cx="12" cy="12" r="5" fill="#BDBDBD"/>
        <circle cx="12" cy="12" r="4" fill="#E0E0E0"/>
        <path d="M12 9a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-1-1z" fill="#757575"/>
    </svg>
);

export const OledDisplayIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="2" y="5" width="20" height="14" rx="1" fill="#212121"/>
    <rect x="4" y="7" width="16" height="10" fill="#00BCD4"/>
  </svg>
);

export const TftTouchscreenIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="1" fill="#4CAF50"/>
    <rect x="4" y="4" width="16" height="12" fill="#81C784"/>
    <path d="M10 18 h4 v2 h-4 z m-4 0 h2 v2 h-2 z m 10 0 h2 v2 h-2 z" fill="#FFC107"/>
  </svg>
);

export const AccelerometerIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" fill="#607D8B"/>
    <rect x="7" y="7" width="10" height="10" rx="1" fill="#455A64"/>
    <path d="M12 8 v8 m-4 -4 h8" stroke="#CFD8DC" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 8 l-2 2 m2 -2 l2 2 M12 16 l-2 -2 m2 2 l2 -2" stroke="#CFD8DC" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const ColorSensorIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" fill="#424242"/>
    <circle cx="12" cy="12" r="6" fill="#212121"/>
    <circle cx="10" cy="10" r="1.5" fill="#F44336"/>
    <circle cx="14" cy="10" r="1.5" fill="#4CAF50"/>
    <circle cx="12" cy="14" r="1.5" fill="#2196F3"/>
  </svg>
);

export const GasSensorIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="8" width="16" height="12" rx="1" fill="#009688"/>
    <path d="M4 10 h16 v-4 a8 8 0 0 0 -16 0 z" fill="#BDBDBD"/>
    <path d="M6 8 h2 v2 h-2 z m3 0 h2 v2 h-2 z m3 0 h2 v2 h-2 z m3 0 h2 v2 h-2 z" fill="#9E9E9E"/>
  </svg>
);

export const RotaryEncoderIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="6" y="10" width="12" height="8" rx="1" fill="#03A9F4"/>
    <circle cx="12" cy="8" r="6" fill="#424242"/>
    <circle cx="12" cy="8" r="5" fill="#616161"/>
    <rect x="11" y="4" width="2" height="3" fill="#BDBDBD"/>
    <path d="M8 18 v4 m4 -4 v4 m4 -4 v4" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const RfidReaderIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" fill="#FF9800"/>
    <circle cx="12" cy="12" r="6" stroke="#FFF" strokeWidth="1.5" fill="none" strokeDasharray="3 3"/>
    <circle cx="12" cy="12" r="3" stroke="#FFF" strokeWidth="1.5" fill="none"/>
  </svg>
);

export const LedStripIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="2" y="10" width="20" height="4" rx="1" fill="#212121"/>
    <rect x="4" y="11" width="2" height="2" fill="#F44336"/>
    <rect x="8" y="11" width="2" height="2" fill="#4CAF50"/>
    <rect x="12" y="11" width="2" height="2" fill="#2196F3"/>
    <rect x="16" y="11" width="2" height="2" fill="#FFEB3B"/>
  </svg>
);

export const BluetoothModuleIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" fill="#2196F3"/>
    <path d="M10.5 6 v12 l4 -3 l-4 -3 l4 -3 l-4 -3" stroke="#FFF" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const GpsModuleIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" fill="#8BC34A"/>
    <path d="M12 7 C9.24 7 7 9.24 7 12 C7 15.5 12 20 12 20 C12 20 17 15.5 17 12 C17 9.24 14.76 7 12 7 Z" stroke="#FFF" strokeWidth="1.5" fill="none"/>
    <circle cx="12" cy="12" r="2" fill="#FFF"/>
  </svg>
);

export const SdCardModuleIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="5" y="3" width="14" height="18" rx="2" fill="#FFC107"/>
    <path d="M8 4 h2 v4 h-2 z m3 0 h2 v4 h-2 z m3 0 h2 v4 h-2 z" fill="#E65100"/>
  </svg>
);

export const RtcModuleIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" fill="#78909C"/>
    <circle cx="16" cy="16" r="4" fill="#BDBDBD"/>
    <circle cx="16" cy="16" r="3" fill="#E0E0E0"/>
    <path d="M12 7 h5 m-5 3 h3 m-3 3 h5" stroke="#FFF" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

export const FingerprintSensorIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" fill="#00BCD4"/>
    <path d="M12 7 a3 3 0 0 1 0 6 M10 8 a5 5 0 0 1 0 10 M14 9 a3 3 0 0 0 0 6" stroke="#FFF" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M12 11 v4" stroke="#FFF" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </svg>
);

export const EInkDisplayIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="1" fill="#424242"/>
    <rect x="5" y="7" width="14" height="10" fill="#E0E0E0"/>
    <text x="12" y="14" textAnchor="middle" dominantBaseline="middle" fontFamily="serif" fontSize="8" fill="#212121">A</text>
    <path d="M19 5 h2 v2 l-2 -2 z" fill="#757575"/>
  </svg>
);

export const IrReceiverIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="12" width="16" height="8" rx="1" fill="#4CAF50"/>
    <circle cx="12" cy="8" r="5" fill="#212121" />
    <path d="M6 20h2v2H6zm5 0h2v2h-2zm5 0h2v2h-2z" fill="#FFC107"/>
  </svg>
);

export const IrEmitterIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <path d="M14.5 13.08V21.5" stroke="#757575"/>
        <path d="M9.5 13.08V21.5" stroke="#757575"/>
        <path d="M12 2.5a4.5 4.5 0 0 1 4.5 4.5v3.2a2.88 2.88 0 0 1-2.88 2.88h-3.24a2.88 2.88 0 0 1-2.88-2.88V7a4.5 4.5 0 0 1 4.5-4.5Z" stroke="#BDBDBD" fill="#FAFAFA"/>
        <path d="M5 6 a4 4 0 0 1 4 -4 M15 2 a4 4 0 0 1 4 4" stroke="#9E9E9E" strokeDasharray="2 2" />
    </g>
  </svg>
);

export const HeartRateSensorIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" fill="#D32F2F"/>
    <rect x="7" y="7" width="10" height="10" rx="1" fill="#212121"/>
    <path d="M12 9 a 1.5 1.5 0 0 1 0 3 a 1.5 1.5 0 0 1 0 -3" fill="#F44336"/>
    <path d="M12 13 a 1.5 1.5 0 0 1 0 3 a 1.5 1.5 0 0 1 0 -3" fill="#2196F3"/>
  </svg>
);

export const FsrIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="10" r="8" fill="#9E9E9E"/>
    <circle cx="12" cy="10" r="7" fill="#BDBDBD"/>
    <path d="M9 18 v4 M15 18 v4" stroke="#757575" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 7 l-2 2.5 l2 2.5 l2-2.5z" fill="#757575"/>
  </svg>
);

export const LoraModuleIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Main board */}
    <rect x="4" y="2" width="16" height="20" rx="1" fill="#4A90E2"/>
    
    {/* Pin Headers (plastic part) */}
    <rect x="3" y="6" width="2" height="15" rx=".5" fill="#212121"/>
    <rect x="19" y="6" width="2" height="15" rx=".5" fill="#212121"/>
    
    {/* Left Pins */}
    <rect x="3" y="7" width="2" height="1.5" fill="#FFC107"/>
    <rect x="3" y="9.5" width="2" height="1.5" fill="#FFC107"/>
    <rect x="3" y="12" width="2" height="1.5" fill="#FFC107"/>
    <rect x="3" y="14.5" width="2" height="1.5" fill="#FFC107"/>
    <rect x="3" y="17" width="2" height="1.5" fill="#FFC107"/>
    <rect x="3" y="19.5" width="2" height="1.5" fill="#FFC107"/>

    {/* Right Pins */}
    <rect x="19" y="7" width="2" height="1.5" fill="#FFC107"/>
    <rect x="19" y="9.5" width="2" height="1.5" fill="#FFC107"/>
    <rect x="19" y="12" width="2" height="1.5" fill="#FFC107"/>
    <rect x="19" y="14.5" width="2" height="1.5" fill="#FFC107"/>
    <rect x="19" y="17" width="2" height="1.5" fill="#FFC107"/>
    <rect x="19" y="19.5" width="2" height="1.5" fill="#FFC107"/>
    
    {/* RFM9x chip module (the silver can) */}
    <rect x="7" y="7" width="10" height="9" rx="1" fill="#BDBDBD"/>
    <rect x="7.5" y="7.5" width="9" height="8" rx="0.5" stroke="#757575" strokeWidth="0.5" fill="none"/>
    
    {/* Antenna Connector (SMA style) */}
    <rect x="11" y="3" width="2" height="3" rx=".5" fill="#FFC107"/>
    <path d="M12 6 V 7" stroke="#FFF" strokeWidth="0.5"/>
    
    {/* Crystal Oscillator */}
    <rect x="8" y="17" width="4" height="2" rx=".5" fill="#E0E0E0"/>
  </svg>
);

export const NfcModuleIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" fill="#F44336"/>
    <rect x="4" y="6" width="16" height="12" rx="1" stroke="#FFF" strokeWidth="1.5" fill="none" strokeDasharray="3 3"/>
    <rect x="7" y="9" width="10" height="6" rx="1" stroke="#FFF" strokeWidth="1.5" fill="none"/>
  </svg>
);

export const NodeMcuIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 256 512" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="256" height="512" rx="16" fill="#212121" />
    <rect x="20" y="20" width="216" height="472" fill="#424242" />
    {/* USB Port */}
    <rect x="88" y="40" width="80" height="50" rx="6" fill="#BDBDBD" />
    {/* ESP Chip */}
    <rect x="68" y="120" width="120" height="100" rx="6" fill="#757575" />
    <text x="128" y="175" fill="#212121" fontSize="20" textAnchor="middle">ESP8266</text>
    {/* Other chips */}
    <rect x="68" y="240" width="50" height="40" fill="#616161" />
    <rect x="138" y="240" width="50" height="40" fill="#616161" />
    {/* Pin Headers */}
    <rect x="20" y="20" width="20" height="472" fill="#212121" />
    <rect x="216" y="20" width="20" height="472" fill="#212121" />
  </svg>
);

// A generic IC icon for the sidebar
const GenericIcIcon: React.FC<{ label: string } & SVGProps<SVGSVGElement>> = ({ label, ...props }) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="5" y="3" width="14" height="18" rx="1.5" fill="#424242"/>
        <path d="M12 3 A 2 2 0 0 0 10 5 H 14 A 2 2 0 0 0 12 3 Z" fill="#616161"/>
        <path d="M3 6h2v2H3z m0 4h2v2H3z m0 4h2v2H3z m16-8h2v2h-2z m0 4h2v2h-2z m0 4h2v2h-2z" fill="#9E9E9E"/>
        <text x="12" y="13.5" textAnchor="middle" dominantBaseline="central" fill="#BDBDBD" fontSize="5" fontFamily="monospace">{label}</text>
    </svg>
);

export const MultiplexerIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <GenericIcIcon label="4051" {...props} />
);

export const DecoderIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <GenericIcIcon label="138" {...props} />
);

export const ShiftRegisterSipoIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <GenericIcIcon label="595" {...props} />
);

export const ShiftRegisterPisoIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <GenericIcIcon label="165" {...props} />
);

export const IoExpanderMcp23017Icon: FC<SVGProps<SVGSVGElement>> = (props) => (
     <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="4" y="2" width="16" height="20" rx="1.5" fill="#424242"/>
        <path d="M12 2 A 2 2 0 0 0 10 4 H 14 A 2 2 0 0 0 12 2 Z" fill="#616161"/>
        <path d="M2 5h2v2H2z m0 3h2v2H2z m0 3h2v2H2z m0 3h2v2H2z m0 3h2v2H2z" fill="#9E9E9E"/>
        <path d="M20 5h2v2h-2z m0 3h2v2h-2z m0 3h2v2h-2z m0 3h2v2h-2z m0 3h2v2h-2z" fill="#9E9E9E"/>
        <text x="12" y="13" textAnchor="middle" dominantBaseline="central" fill="#BDBDBD" fontSize="4" fontFamily="monospace">MCP23017</text>
    </svg>
);


// --- UTILITY ICONS --- (Unchanged)
export const LayoutIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
);

export const FullScreenEnterIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
);

export const FullScreenExitIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9V4.5M15 9h4.5M15 9l5.25-5.25M15 15v4.5M15 15h4.5M15 15l5.25 5.25" />
    </svg>
);

export const DownloadIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const PlayIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M8 5v14l11-7z" />
    </svg>
);

export const StopIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M6 6h12v12H6z" />
    </svg>
);

export const SunIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
);

export const MoonIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
);

export const PlusIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const MinusIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </svg>
);

export const ArrowPathIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691v4.992m0 0h-4.992m4.992 0-3.181-3.183a8.25 8.25 0 0 0-11.667 0L2.985 16.953Z" />
    </svg>
);

export const FloppyDiskIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h14l4 4v14H3V3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v6H8V3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 14h8" />
    </svg>
);

export const FolderOpenIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
  </svg>
);

export const PdfFileIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM9.5 18H7v-5h2.5c.83 0 1.5.67 1.5 1.5v2c0 .83-.67 1.5-1.5 1.5zm-1-3.5h-1.5v2h1.5v-2zm3.5-1H11v4h1v-1.5h1c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5zm.5 1.5h-1v-1h1v1zm4.5-1.5h-2.5V13H15v5h1.5v-1.5h1V15h-1v-1.5h1.5v-1zM13 9V3.5L18.5 9H13z"/>
    </svg>
);