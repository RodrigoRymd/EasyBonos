import { Entity } from "./enums/entity";

export interface LegalPersonRegister {
    name: string;
    registerYear: number;
    entityType: Entity;
    email: string;
    password: string;
    ruc: string;
}