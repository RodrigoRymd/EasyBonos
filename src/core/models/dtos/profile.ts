import { LegalPerson } from "./legalPerson";
import { NaturalPerson } from "./naturalPerson";

export interface Profile {
    id: number;
    naturalPerson: NaturalPerson;
    legalPerson: LegalPerson;   
}