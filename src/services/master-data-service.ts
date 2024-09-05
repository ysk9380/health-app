import {
  Language,
  IdentityType,
  State,
  AddressType,
  HealthVital,
  Gender,
  PhoneType,
} from "../models/master";
import { HttpService } from "./http-service";

export const getLanguages = async (): Promise<Language[]> => {
  try {
    const response = await HttpService.getHttpClientInstance().get<Language[]>(
      "/api/master/languages"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch languages", error);
    throw error;
  }
};

export const getGenders = async (): Promise<Gender[]> => {
  try {
    const response = await HttpService.getHttpClientInstance().get<Gender[]>(
      "/api/master/genders"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch genders", error);
    throw error;
  }
};

export const getIdentityTypes = async (): Promise<IdentityType[]> => {
  try {
    const response = await HttpService.getHttpClientInstance().get<
      IdentityType[]
    >("/api/master/identitytypes");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch identity types", error);
    throw error;
  }
};

export const getAddressTypes = async (): Promise<AddressType[]> => {
  try {
    const response = await HttpService.getHttpClientInstance().get<
      AddressType[]
    >("/api/master/addresstypes");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch address types", error);
    throw error;
  }
};

export const getPhoneTypes = async (): Promise<PhoneType[]> => {
  try {
    const response = await HttpService.getHttpClientInstance().get<PhoneType[]>(
      "/api/master/phonetypes"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch phone types", error);
    throw error;
  }
};

export const getStates = async (): Promise<State[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { stateId: 1, stateCode: "AP", stateName: "Andhra Pradesh" },
        { stateId: 2, stateCode: "AR", stateName: "Arunachal Pradesh" },
        { stateId: 3, stateCode: "AS", stateName: "Assam" },
        { stateId: 4, stateCode: "BR", stateName: "Bihar" },
        { stateId: 5, stateCode: "CG", stateName: "Chhattisgarh" },
        { stateId: 6, stateCode: "GA", stateName: "Goa" },
        { stateId: 7, stateCode: "GJ", stateName: "Gujarat" },
        { stateId: 8, stateCode: "HR", stateName: "Haryana" },
        { stateId: 9, stateCode: "HP", stateName: "Himachal Pradesh" },
        { stateId: 10, stateCode: "JH", stateName: "Jharkhand" },
        { stateId: 11, stateCode: "KA", stateName: "Karnataka" },
        { stateId: 12, stateCode: "KL", stateName: "Kerala" },
        { stateId: 13, stateCode: "MP", stateName: "Madhya Pradesh" },
        { stateId: 14, stateCode: "MH", stateName: "Maharashtra" },
        { stateId: 15, stateCode: "MN", stateName: "Manipur" },
        { stateId: 16, stateCode: "ML", stateName: "Meghalaya" },
        { stateId: 17, stateCode: "MZ", stateName: "Mizoram" },
        { stateId: 18, stateCode: "NL", stateName: "Nagaland" },
        { stateId: 19, stateCode: "OD", stateName: "Odisha" },
        { stateId: 20, stateCode: "PB", stateName: "Punjab" },
        { stateId: 21, stateCode: "RJ", stateName: "Rajasthan" },
        { stateId: 22, stateCode: "SK", stateName: "Sikkim" },
        { stateId: 23, stateCode: "TN", stateName: "Tamil Nadu" },
        { stateId: 24, stateCode: "TS", stateName: "Telangana" },
        { stateId: 25, stateCode: "TR", stateName: "Tripura" },
        { stateId: 26, stateCode: "UP", stateName: "Uttar Pradesh" },
        { stateId: 27, stateCode: "UK", stateName: "Uttarakhand" },
        { stateId: 28, stateCode: "WB", stateName: "West Bengal" },
      ]);
    }, 1000);
  });
};

export const getHealthVitalParameters = async (): Promise<HealthVital[]> => {
  try {
    const response = await HttpService.getHttpClientInstance().get<
      HealthVital[]
    >("/api/master/healthvitals");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch phone types", error);
    throw error;
  }
};
