import { Frequency } from "../models/enums/frequency";

export interface EnumData {
  label: string;
  value: number;
}

export function getEnumData(enumType: any): EnumData[] {
  let arr: EnumData[] = [];
  for (const value in Object.keys(enumType)) {
    if (typeof enumType[value] !== "string") {
      continue;
    }

    arr.push({
      label: enumType[Number(value)],
      value: Number(value),
    });
  }
  return arr;
}


export function frequencyToDay(frequency: Frequency): number {
  switch (frequency) {
    case Frequency.Diaria:
      return 1;
    case Frequency.Mensual:
      return 30;
    case Frequency.Bimestral:
      return 60;
    case Frequency.Trimestral:
      return 90;
    case Frequency.Cuatrimestral:
      return 120;
    case Frequency.Semestral:
      return 180;
    case Frequency.Anual:
      return 360;
    default:
      return 1;
  }
}