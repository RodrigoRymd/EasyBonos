import { ResponseData } from "./responseData";

export interface BondSummary extends ResponseData {
    id?: number;
    name?: string;
    issuer?: string;
    nominalValue?: number;
    commercialValue?: number;
    irr?: number;
    modifiedDuration?: number;
    emmitionDate?: string;
    saleDate?: string;
    lastPaymentDate?: string;
    nextPaymentDate?: string;
    interestRate?: number;
}