import { BondState } from "../enums/bondState";
import { Bond } from "./bond";
import { ResponseData } from "./responseData";

export interface BondPublication extends ResponseData {
  id?: number;
  bond?: Bond;
  expectedRate?: number;
  description?: string;
  issuerId?: number;
  holderId?: number;
  state?: BondState;
  lastPaymentDate?: Date | string;
  nextPaymentDate?: Date | string;
  name?: string;
  saleDate?: Date | string;
}
