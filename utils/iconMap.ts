import type { FC, SVGProps } from 'react';
import {
  LedIcon, ButtonIcon, UltrasonicSensorIcon, TempSensorIcon, PressureSensorIcon,
  PirSensorIcon, ServoIcon, LcdIcon, PotentiometerIcon, BuzzerIcon, RgbLedIcon,
  PhotoresistorIcon, RelayIcon, JoystickIcon, BreadboardIcon, DcMotorIcon,
  MotorDriverIcon, StepperMotorIcon, KeypadIcon, SevenSegmentIcon, DotMatrixIcon,
  SoilMoistureIcon, SoundSensorIcon, OledDisplayIcon, TftTouchscreenIcon,
  AccelerometerIcon, ColorSensorIcon, GasSensorIcon, RotaryEncoderIcon,
  RfidReaderIcon, LedStripIcon, BluetoothModuleIcon, GpsModuleIcon,
  SdCardModuleIcon, RtcModuleIcon, FingerprintSensorIcon, EInkDisplayIcon,
  NodeMcuIcon, PowerSupplyIcon, IrReceiverIcon, IrEmitterIcon, HeartRateSensorIcon,
  FsrIcon, LoraModuleIcon, NfcModuleIcon, TwoChannelRelayIcon,
  MultiplexerIcon, DecoderIcon, ShiftRegisterSipoIcon, ShiftRegisterPisoIcon, IoExpanderMcp23017Icon
} from '../components/icons';

export const iconMap: { [key: string]: FC<SVGProps<SVGSVGElement>> } = {
  LedIcon, ButtonIcon, UltrasonicSensorIcon, TempSensorIcon, PressureSensorIcon,
  PirSensorIcon, ServoIcon, LcdIcon, PotentiometerIcon, BuzzerIcon, RgbLedIcon,
  PhotoresistorIcon, RelayIcon, JoystickIcon, BreadboardIcon, DcMotorIcon,
  MotorDriverIcon, StepperMotorIcon, KeypadIcon, SevenSegmentIcon, DotMatrixIcon,
  SoilMoistureIcon, SoundSensorIcon, OledDisplayIcon, TftTouchscreenIcon,
  AccelerometerIcon, ColorSensorIcon, GasSensorIcon, RotaryEncoderIcon,
  RfidReaderIcon, LedStripIcon, BluetoothModuleIcon, GpsModuleIcon,
  SdCardModuleIcon, RtcModuleIcon, FingerprintSensorIcon, EInkDisplayIcon,
  NodeMcuIcon, PowerSupplyIcon, IrReceiverIcon, IrEmitterIcon, HeartRateSensorIcon,
  FsrIcon, LoraModuleIcon, NfcModuleIcon, TwoChannelRelayIcon,
  MultiplexerIcon, DecoderIcon, ShiftRegisterSipoIcon, ShiftRegisterPisoIcon, IoExpanderMcp23017Icon
};