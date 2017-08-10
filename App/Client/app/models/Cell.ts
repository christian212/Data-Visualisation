import { StackCell } from './StackCell';
import { Measurement } from './Measurement';

export interface Cell {
    id: number;
    name: string;
    description: string;
    measurementCount: number;

    stackCells: StackCell[];
    measurements: Measurement[];

    created: Date;
    modified: Date;
}
