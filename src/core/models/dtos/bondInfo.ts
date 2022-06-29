export interface BondInfo {
  id: number;
  index: number;
  date?: string;
  bond: number;
  coupon: number;
  fee?: number;
  amortization: number;
  prima?: number;
  shield?: number;
  emmiterFlow: number;
  emmiterShieldFlow: number;
  holderFlow: number;
  gracePeriod: string;
}
