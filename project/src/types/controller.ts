export interface ControllerStatus {
  isHeatingOn: boolean;
  temperature: number | null;
  lastUpdated: Date | null;
}

export interface SMSConfig {
  phoneNumber: string;
  commands: {
    turnOn: string;
    turnOff: string;
    status: string;
  };
}

export interface CommandHistoryEntry {
  command: string;
  timestamp: Date;
  success: boolean;
}

export type HeatingMode = 'off' | 'on' | 'frost-protection';