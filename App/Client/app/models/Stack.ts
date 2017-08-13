import { BatteryStack } from './BatteryStack';
import { StackCell } from './StackCell';
import { Measurement } from './Measurement';

enum CircuitType {
    Undefined,
    Reihenschaltung,
    Parallelschaltung,
    Sonstige
}

export interface Stack {
    id: number;
    name: string;
    description: string;
    cellCount: number;
    circuitType: CircuitType;

    batteryStacks: BatteryStack[];
    stackCells: StackCell[];
    measurements: Measurement[];

    created: Date;
    modified: Date;

    active: Boolean;
}
