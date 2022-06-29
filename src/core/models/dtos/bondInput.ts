import { Frequency } from "../enums/frequency";
import { GracePeriod } from "../enums/gracePeriod";
import { PaymentMethod } from "../enums/paymentMethod";
import { Rate } from "../enums/rate";


export interface BondInput {
  id?: number;
  nominalValue: number;
  commercialValue: number;
  years: number;
  couponFrequency: Frequency;
  daysPerYear: number;
  interestRateType: Rate;
  capitalization: Frequency;
  interestRate: number;
  annualDiscountRate: number;
  incomeTax: number;
  emmitionDate: Date;
  prima: number;
  flotacion: number;
  cavali: number;
  colocacion: number;
  estructuracion: number;
  paymentMethod: PaymentMethod;
  gracePeriod: GracePeriod;
}
