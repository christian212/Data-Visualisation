enum CircuitType {
    Undefined = 0,
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
    created: Date;
    modified: Date;
}
