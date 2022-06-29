import { BondPublication } from "../models/dtos/bondPublication";
import { BondSummary } from "../models/dtos/bondSummary";
import { ResponseData } from "../models/dtos/responseData";
import httpClient from "../utils/httpClient";

export async function publishBond(
  bondPublication: BondPublication
): Promise<BondPublication> {
  try {
    return httpClient
      .post<BondPublication>("/bonds", bondPublication)
      .then((v) => v.data);
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function getPublicationSummaries(): Promise<Array<BondSummary>> {
  try {
    const data = await httpClient
      .get<Array<any>>("/bonds/selling")
      .then((v) => v.data);

    return data.map<BondSummary>((value) => {
      const emmitionDate = new Date(value.bond.bondInput.emmitionDate);

      return {
        id: value.id,
        name: value.name,
        issuer: value.issuerProfile.legalPerson.name,
        commercialValue: value.bond.bondInput.commercialValue,
        irr: value.tir,
        modifiedDuration: value.duracionmod,
        emmitionDate: emmitionDate.toLocaleDateString(),
        interestRate: value.bond.bondInput.interestRate,
      };
    });
  } catch (error) {
    return [
      {
        error: error.message,
      },
    ];
  }
}

export async function getPublication(
  bondPublicationId: number
): Promise<BondPublication> {
  try {
    const data = await httpClient
      .get<any>(`/bonds/${bondPublicationId}`)
      .then((v) => v.data);

    const lastPaymentDate = new Date(data.lastPaymentDate);
    const nextPaymentDate = new Date(data.nextPaymentDate);
    const saleDate = new Date(data.saleDate);


    console.log(data);

    return {
      id: data.id,
      name: data.name,
      expectedRate: data.expectedRate,
      description: data.description,
      issuerId: data.issuerProfile?.id,
      holderId: data.holderProfile?.id,
      state: data.state,
      lastPaymentDate: lastPaymentDate,
      nextPaymentDate: nextPaymentDate,
      saleDate: saleDate,
      bond: data.bond,
    };



  } catch (error) {
    console.log(error);

    return {
      error: error.message,
    };
  }
}

export async function buyBond(
  bondId: number,
  buyerId: number
): Promise<ResponseData> {
  try {
    await httpClient.post<BondPublication>(`/bonds/sell/${bondId}`, {
      buyerId: buyerId,
    });
    return {};
  } catch (error) {
    console.log(error);
    return {
      error: error.message,
    };
  }
}

export async function boughtBonds(profileId: number) {
  try {
    const data = await httpClient
      .get<any>(`/bonds/holder/${profileId}`)
      .then((v) => v.data);

    let bonds: BondSummary[] = [];

    for (const value in data) {
      const issuer = await httpClient.get("/profile").then((v) => v.data);
    }

    const bondSummary = {
      id: data.id,
    };
  } catch (error) {
    console.log(error);
  }
  return null;
}
