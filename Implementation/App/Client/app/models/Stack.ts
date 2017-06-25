enum circuitType {
    Undefined = 0,
    Reihenschaltung,
    Parallelschaltung,
    Sonstige
}

export interface IStack {
    id: number;
    name: string;
    description: string;
    cellCount: number;
    circuitType: circuitType;
    created: Date;
    modified: Date;
}