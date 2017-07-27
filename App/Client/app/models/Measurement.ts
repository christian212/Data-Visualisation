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

    fileName: string;
    fileSize: number;
    measurementType: MeasurementType;

    created: Date;
    modified: Date;
}
