import { BondInfo } from "./bondInfo";


export interface BondOutput {
  id?: number;
  couponFrequency: number;
  capitalization: number;
  periodsPerYear: number;
  totalPeriods: number;
  annualEfectiveRate: number;
  couponEfectiveRate: number;
  couponCok: number; 
  initialEmmiterCosts: number;
  initialHolderCosts: number;
  currentPrice: number;
  bondInfo: BondInfo[];
  accumulatedBond?: number;
  irr?: number;
  modifiedDuration?: number;
}
