import { npv, pmt } from "financial";
import { BondCalculatorInfo } from "../models/bondCalculatorInfo";
import { BondCalculatorInput } from "../models/bondCalculatorInput";
import { BondCalculatorOutput } from "../models/bondCalculatorOutput";
import { Frequency } from "../models/enums/frequency";
import { GracePeriod } from "../models/enums/gracePeriod";
import { PaymentMethod } from "../models/enums/paymentMethod";
import { Rate } from "../models/enums/rate";
import { frequencyToDay } from "../utils/enumUtils";

export function calculateData(data: BondCalculatorInput): BondCalculatorOutput {
  let output = {} as BondCalculatorOutput;
  console.log(data);

  const couponFrequency = frequencyToDay(data.couponFrequency);
  console.log(couponFrequency);

  const capitalization = frequencyToDay(data.capitalization);

  output.couponFrequency = couponFrequency;
  output.capitalization = capitalization;
  output.periodsPerYear = Math.floor(data.daysPerYear / couponFrequency);
  output.totalPeriods = output.periodsPerYear * data.years;

  if (data.interestRateType === Rate.Efectiva) {
    output.annualEfectiveRate = data.interestRate;
  } else {
    output.annualEfectiveRate = Math.pow(
      (1 + data.interestRate) / (data.daysPerYear / capitalization),
      data.daysPerYear / capitalization - 1
    );
  }

  output.couponEfectiveRate =
    Math.pow(
      1 + output.annualEfectiveRate,
      couponFrequency / data.daysPerYear
    ) - 1;
  output.couponEfectiveRate = parseFloat(output.couponEfectiveRate.toFixed(2));

  output.couponCok =
    Math.pow(1 + data.annualDiscountRate, couponFrequency / data.daysPerYear) -
    1;

  output.couponCok = parseFloat(output.couponCok.toFixed(3));

  const costs =
    (data.cavali + data.flotacion + data.estructuracion + data.colocacion) *
    data.commercialValue;

  output.initialHolderCosts = costs;
  output.initialEmmiterCosts = costs;

  switch (data.paymentMethod) {
    case PaymentMethod.Aleman:
      output.calculatorInfo = germanMethod(data, output);
      break;
    case PaymentMethod.Frances:
      output.calculatorInfo = frenchMethod(data, output);
      break;
    case PaymentMethod.Ingles:
      output.calculatorInfo = englishMethod(data, output);
      break;
    default:
      output.calculatorInfo = [];
      break;
  }

  let flows = output.calculatorInfo.slice(1).map((v) => v.holderFlow);
  flows.splice(0,0,0);

  output.currentPrice = npv(output.couponCok, flows);
  return output;
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy;
}

function germanMethod(
  inputData: BondCalculatorInput,
  outputData: BondCalculatorOutput
): BondCalculatorInfo[] {
  let info: BondCalculatorInfo[] = [];
  const initialValues = {
    index: 0,
    emmiterFlow: inputData.commercialValue - outputData.initialEmmiterCosts,
    emmiterShieldFlow:
      inputData.commercialValue - outputData.initialEmmiterCosts,
    holderFlow: -inputData.commercialValue - outputData.initialHolderCosts,
    bond: 0,
    coupon: 0,
    amortization: 0,
    gracePeriod: "",
  } as BondCalculatorInfo;

  const couponFrequency = frequencyToDay(inputData.couponFrequency);
  info.push(initialValues);

  let lastDate = inputData.emmitionDate;
  for (let i = 1; i <= outputData.totalPeriods; ++i) {
    const date = addDays(lastDate, couponFrequency);
    const gracePeriod = inputData.gracePeriod;

    lastDate = new Date(date.getTime());

    let bondValue = inputData.nominalValue;
    const lastBond = info[i - 1];
    if (i > 1) {
      if (inputData.gracePeriod === GracePeriod.Total) {
        bondValue = lastBond.bond - lastBond.coupon;
      } else {
        bondValue = lastBond.bond + lastBond.amortization;
      }
    }

    const coupon = -bondValue * outputData.couponEfectiveRate;
    let amortization = 0;
    if (gracePeriod === GracePeriod.Sin) {
      amortization = -bondValue / (outputData.totalPeriods - i + 1);
    }

    let fee = 0;
    if (gracePeriod === GracePeriod.Parcial) {
      fee = coupon;
    } else if (gracePeriod === GracePeriod.Sin) {
      fee = coupon + amortization;
    }

    let prima = 0;
    if (i === outputData.totalPeriods) {
      prima = -inputData.prima * inputData.nominalValue;
    }

    const shield = -coupon * inputData.incomeTax;
    const emmiterFlow = fee + prima;
    const emmiterShieldFlow = emmiterFlow + shield;
    const holderFlow = -emmiterFlow;

    info.push({
      index: i,
      date: date.toLocaleDateString(),
      bond: parseFloat(bondValue.toFixed(2)),
      coupon: parseFloat(coupon.toFixed(2)),
      fee: parseFloat(fee.toFixed(2)),
      amortization: parseFloat(amortization.toFixed(2)),
      prima: parseFloat(prima.toFixed(2)),
      shield: parseFloat(shield.toFixed(2)),
      emmiterFlow: parseFloat(emmiterFlow.toFixed(2)),
      emmiterShieldFlow: parseFloat(emmiterShieldFlow.toFixed(2)),
      holderFlow: parseFloat(holderFlow.toFixed(2)),
      gracePeriod: GracePeriod[gracePeriod],
    } as BondCalculatorInfo);
  }
  return info;
}

function frenchMethod(
  inputData: BondCalculatorInput,
  outputData: BondCalculatorOutput
) {
  let info: BondCalculatorInfo[] = [];
  const initialValues = {
    index: 0,
    emmiterFlow: inputData.commercialValue - outputData.initialEmmiterCosts,
    emmiterShieldFlow:
      inputData.commercialValue - outputData.initialEmmiterCosts,
    holderFlow: -inputData.commercialValue - outputData.initialHolderCosts,
    bond: 0,
    coupon: 0,
    amortization: 0,
    gracePeriod: "",
  } as BondCalculatorInfo;

  const couponFrequency = frequencyToDay(inputData.couponFrequency);
  info.push(initialValues);

  let lastDate = inputData.emmitionDate;
  for (let i = 1; i <= outputData.totalPeriods; ++i) {
    const date = addDays(lastDate, couponFrequency);
    const gracePeriod = inputData.gracePeriod;

    lastDate = new Date(date.getTime());

    let bondValue = inputData.nominalValue;
    const lastBond = info[i - 1];
    if (i > 1) {
      if (inputData.gracePeriod === GracePeriod.Total) {
        bondValue = lastBond.bond - lastBond.coupon;
      } else {
        bondValue = lastBond.bond + lastBond.amortization;
      }
    }
    const coupon = -bondValue * outputData.couponEfectiveRate;

    let fee = 0;
    if (gracePeriod === GracePeriod.Parcial) {
      fee = coupon;
    } else if (gracePeriod === GracePeriod.Sin) {
      fee = pmt(
        inputData.interestRate,
        outputData.totalPeriods,
        inputData.nominalValue
      );
    }

    let amortization = 0;
    if (gracePeriod === GracePeriod.Sin) {
      amortization = fee - coupon;
    }

    let prima = 0;
    if (i === outputData.totalPeriods) {
      prima = -inputData.prima * inputData.nominalValue;
    }

    const shield = -coupon * inputData.incomeTax;
    const emmiterFlow = fee + prima;
    const emmiterShieldFlow = emmiterFlow + shield;
    const holderFlow = -emmiterFlow;

    info.push({
      index: i,
      date: date.toLocaleDateString(),
      bond: parseFloat(bondValue.toFixed(2)),
      coupon: parseFloat(coupon.toFixed(2)),
      fee: parseFloat(fee.toFixed(2)),
      amortization: parseFloat(amortization.toFixed(2)),
      prima: parseFloat(prima.toFixed(2)),
      shield: parseFloat(shield.toFixed(2)),
      emmiterFlow: parseFloat(emmiterFlow.toFixed(2)),
      emmiterShieldFlow: parseFloat(emmiterShieldFlow.toFixed(2)),
      holderFlow: parseFloat(holderFlow.toFixed(2)),
      gracePeriod: GracePeriod[gracePeriod],
    } as BondCalculatorInfo);
  }
  return info;
}

function englishMethod(
  inputData: BondCalculatorInput,
  outputData: BondCalculatorOutput
) {
  let info: BondCalculatorInfo[] = [];
  const initialValues = {
    index: 0,
    emmiterFlow: inputData.commercialValue - outputData.initialEmmiterCosts,
    emmiterShieldFlow:
      inputData.commercialValue - outputData.initialEmmiterCosts,
    holderFlow: -inputData.commercialValue - outputData.initialHolderCosts,
    bond: 0,
    coupon: 0,
    amortization: 0,
    gracePeriod: "",
  } as BondCalculatorInfo;

  const couponFrequency = frequencyToDay(inputData.couponFrequency);
  info.push(initialValues);

  let lastDate = inputData.emmitionDate;
  for (let i = 1; i <= outputData.totalPeriods; ++i) {
    const date = addDays(lastDate, couponFrequency);
    const gracePeriod = inputData.gracePeriod;

    lastDate = new Date(date.getTime());

    let bondValue = inputData.nominalValue;
    const lastBond = info[i - 1];
    if (i > 1) {
      if (inputData.gracePeriod === GracePeriod.Total) {
        bondValue = lastBond.bond - lastBond.coupon;
      } else {
        bondValue = lastBond.bond + lastBond.amortization;
      }
    }

    const coupon = -bondValue * outputData.couponEfectiveRate;
    let amortization = 0;
    if (i === outputData.totalPeriods) {
      amortization = -bondValue;
    }

    let fee = 0;
    if (gracePeriod === GracePeriod.Parcial) {
      fee = coupon;
    } else if (gracePeriod === GracePeriod.Sin) {
      fee = coupon + amortization;
    }

    let prima = 0;
    if (i === outputData.totalPeriods) {
      prima = -inputData.prima * inputData.nominalValue;
    }

    const shield = -coupon * inputData.incomeTax;
    const emmiterFlow = fee + prima;
    const emmiterShieldFlow = emmiterFlow + shield;
    const holderFlow = -emmiterFlow;

    info.push({
      index: i,
      date: date.toLocaleDateString(),
      bond: parseFloat(bondValue.toFixed(2)),
      coupon: parseFloat(coupon.toFixed(2)),
      fee: parseFloat(fee.toFixed(2)),
      amortization: parseFloat(amortization.toFixed(2)),
      prima: parseFloat(prima.toFixed(2)),
      shield: parseFloat(shield.toFixed(2)),
      emmiterFlow: parseFloat(emmiterFlow.toFixed(2)),
      emmiterShieldFlow: parseFloat(emmiterShieldFlow.toFixed(2)),
      holderFlow: parseFloat(holderFlow.toFixed(2)),
      gracePeriod: GracePeriod[gracePeriod],
    } as BondCalculatorInfo);
  }
  return info;
}
