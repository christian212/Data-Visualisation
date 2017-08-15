import { Measurement } from './Measurement';
export interface RawMeasurement {
    id: number;
    index: number;
    frequency: number;
    measurement: Measurement;

    active: Boolean;
}
