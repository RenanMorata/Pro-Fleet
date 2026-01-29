export type FrontStatus = "TRABALHANDO" | "PARADA" | "CHUVA";

export type Allocation = {
  id: string;

  frontId: string; // "0" = SEM FRENTE
  frontName: string;

  farmCode: string;
  farmName: string;

  status: FrontStatus;
  rainMm?: number;

  operationCode: string;
  operationName: string;

  equipmentCodes: string[];
  equipmentNames: string[];

  collaborators?: number;
};


export const AllocationRuntime = {};
