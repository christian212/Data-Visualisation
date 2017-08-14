import { BatteryStack } from './BatteryStack';
import { StackCell } from './StackCell';
import { CircuitType } from './Battery';
import { Measurement } from './Measurement';

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
