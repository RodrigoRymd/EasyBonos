import { BondInput } from "./bondInput";
import { BondOutput } from "./bondOutput";

export interface Bond {
    id?: number;
    bondInput?: BondInput;
    bondOutput?: BondOutput;
}