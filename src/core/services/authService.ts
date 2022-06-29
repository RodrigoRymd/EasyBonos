import { ResponseData } from "../models/dtos/responseData";
import { User } from "../models/dtos/user";
import { LegalPersonRegister } from "../models/legalPersonRegister";
import { NaturalPersonRegister } from "../models/naturalPersonRegister";
import httpClient from "../utils/httpClient";

export async function registerLegalPerson(
  legalPersonRegister: LegalPersonRegister
): Promise<ResponseData> {
  try {
    await httpClient.post("/users", {
      email: legalPersonRegister.email,
      password: legalPersonRegister.password,
      legalPerson: {
        bussinessName: legalPersonRegister.name,
        entity: legalPersonRegister.entityType,
        ruc: legalPersonRegister.ruc,
        registerYear: legalPersonRegister.registerYear,
        emmiterRating: "0",
      },
    });
    return {};
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function registerNaturalPerson(
  naturalPersonRegister: NaturalPersonRegister
): Promise<ResponseData> {
  try {
    await httpClient.post("/users", {
      email: naturalPersonRegister.email,
      password: naturalPersonRegister.password,
      naturalPerson: {
        firstName: naturalPersonRegister.name,
        lastName: naturalPersonRegister.lastName,
        dni: naturalPersonRegister.dni,
      },
    });
    return {};
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

export async function login(email: string, password: string): Promise<User> {
  try {
    const data = await httpClient
      .post("/users/login", {
        email: email,
        password: password,
      })
      .then((v) => v.data);
    return {
      email: data.email,
      userId: data.id,
      profileId: data.profile.id,
      role: data.role,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}
