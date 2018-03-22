import { Battery } from './Battery';
import { Stack } from './Stack';
import { Cell } from './Cell';
import { RawMeasurement } from './RawMeasurement';

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
    rawMeasurements: RawMeasurement[];

    battery: Battery;
    stack: Stack;
    cell: Cell;

    created: Date;
    modified: Date;
    measured: Date;
}
