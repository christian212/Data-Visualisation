enum MeasurementType {
    Undefined,
    Zeitreihe,
    Ortskurve,
    Sonstige
}

export interface Measurement {
    id: number;
    name: string;
    description: string;
    measurementType: MeasurementType;
    created: Date;
    modified: Date;
}
