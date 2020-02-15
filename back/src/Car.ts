export type CarData = {
    model: string,
    battery: number,
    range: number,
    maxPower: number,
    connectors: number[],
    id?: string, // id is autoflied
}

const zoe: CarData = {
    model: "Renault Zoe R75",
    battery: 41,
    range: 290,
    maxPower: 22,
    connectors: [25, 1036],
};

const teslaModel3: CarData = {
    model: "Tesla Model 3",
    battery: 57,
    range: 485,
    maxPower: 170,
    connectors: [27],
};

export const cars = {
    zoe,
    teslaModel3
};
