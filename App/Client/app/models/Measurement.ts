import { Battery } from './Battery';
import { Stack } from './Stack';
import { Cell } from './Cell';

export enum MeasurementType {
    Undefined,
    Zeitreihe,
    Ortskurve,
    Sonstige
}

export interface Measurement {
    id: number;
    name: string;
    description: string;

    fileName: string;
    fileSize: number;
    measurementType: MeasurementType;

    battery: Battery;
    stack: Stack;
    cell: Cell;

    created: Date;
    modified: Date;
}
