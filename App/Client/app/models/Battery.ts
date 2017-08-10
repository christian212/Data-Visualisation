import { BatteryStack } from './BatteryStack';
import { Measurement } from './Measurement';

enum CircuitType {
    Undefined,
    Reihenschaltung,
    Parallelschaltung,
    Sonstige
}

export interface Battery {
    id: number;
    name: string;
    description: string;
    stackCount: number;
    circuitType: CircuitType;

    batteryStacks: BatteryStack[];
    measurements: Measurement[];

    created: Date;
    modified: Date;
}
