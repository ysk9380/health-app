import { format } from "date-fns";
import {
  InsertPatientAddressRequestModel,
  InsertPatientEmailRequestModel,
  InsertPatientHealthVitalRequestModel,
  InsertPatientIdentityRequestModel,
  InsertPatientPhoneRequestModel,
  InsertPatientProfileRequestModel,
  PatientAddressState,
  PatientEmailState,
  PatientHealthVitalState,
  PatientIdentityState,
  PatientPhoneState,
  PatientProfileState,
  PatientSearchCriteria,
  PatientSearchResponseModel,
  UpdatePatientAddressRequestModel,
  UpdatePatientEmailRequestModel,
  UpdatePatientIdentityRequestModel,
  UpdatePatientPhoneRequestModel,
  UpdatePatientProfileRequestModel,
} from "../models/patient";
import { HttpService } from "./http-service";

export async function getPatientData(
  criteria: PatientSearchCriteria
): Promise<PatientSearchResponseModel[]> {
  try {
    const response = await HttpService.getHttpClientInstance().post<
      PatientSearchResponseModel[]
    >("api/patients/search", criteria);

    if (response.data) {
      const patients = response.data.map((patient) => ({
        ...patient,
        dateOfBirth: new Date(patient.dateOfBirth),
      }));
      return patients;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch patient data", error);
    throw error;
  }
}

export async function insertPatientProfile(
  data: InsertPatientProfileRequestModel
): Promise<PatientProfileState | null> {
  try {
    const response =
      await HttpService.getHttpClientInstance().post<PatientProfileState>(
        "api/patients",
        {
          ...data,
          dateOfBirth: data.dateOfBirth
            ? format(data.dateOfBirth, "yyyy-MM-dd")
            : null,
        }
      );

    if (response.status === 201) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to create patient profile", error);
    throw error;
  }
}

export async function updatePatientProfile(
  data: UpdatePatientProfileRequestModel
): Promise<PatientProfileState | null> {
  try {
    const response =
      await HttpService.getHttpClientInstance().put<PatientProfileState>(
        "api/patients",
        {
          ...data,
          dateOfBirth: data.dateOfBirth
            ? format(data.dateOfBirth, "yyyy-MM-dd")
            : null,
        }
      );

    if (response.status === 202) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to update patient profile", error);
    throw error;
  }
}

export async function insertPatientIdentity(
  data: InsertPatientIdentityRequestModel
): Promise<PatientIdentityState | null> {
  try {
    const response =
      await HttpService.getHttpClientInstance().post<PatientIdentityState>(
        "api/patients/identities",
        {
          ...data,
          dateOfBirth: data.expiry ? format(data.expiry, "yyyy-MM-dd") : null,
        }
      );

    if (response.status === 201) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to create patient profile", error);
    throw error;
  }
}

export async function updatePatientIdentity(
  data: UpdatePatientIdentityRequestModel
): Promise<PatientIdentityState | null> {
  try {
    const response =
      await HttpService.getHttpClientInstance().put<PatientIdentityState>(
        "api/patients/identities",
        {
          ...data,
          dateOfBirth: data.expiry ? format(data.expiry, "yyyy-MM-dd") : null,
        }
      );

    if (response.status === 202) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to update patient profile", error);
    throw error;
  }
}

export async function insertPatientAddress(
  data: InsertPatientAddressRequestModel
): Promise<PatientAddressState | null> {
  try {
    const response =
      await HttpService.getHttpClientInstance().post<PatientAddressState>(
        "api/patients/addresses",
        data
      );

    if (response.status === 201) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to create patient address", error);
    throw error;
  }
}

export async function updatePatientAddress(
  data: UpdatePatientAddressRequestModel
): Promise<PatientAddressState | null> {
  try {
    const response =
      await HttpService.getHttpClientInstance().put<PatientAddressState>(
        "api/patients/addresses",
        data
      );

    if (response.status === 202) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to update patient address", error);
    throw error;
  }
}

export async function insertPatientPhone(
  data: InsertPatientPhoneRequestModel
): Promise<PatientPhoneState | null> {
  try {
    const response =
      await HttpService.getHttpClientInstance().post<PatientPhoneState>(
        "api/patients/phones",
        data
      );

    if (response.status === 201) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to create patient phone", error);
    throw error;
  }
}

export async function updatePatientPhone(
  data: UpdatePatientPhoneRequestModel
): Promise<PatientPhoneState | null> {
  try {
    const response =
      await HttpService.getHttpClientInstance().put<PatientPhoneState>(
        "api/patients/phones",
        data
      );

    if (response.status === 202) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to update patient phone", error);
    throw error;
  }
}

export async function insertPatientEmail(
  data: InsertPatientEmailRequestModel
): Promise<PatientEmailState | null> {
  try {
    const response =
      await HttpService.getHttpClientInstance().post<PatientEmailState>(
        "api/patients/emails",
        data
      );

    if (response.status === 201) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to create patient email", error);
    throw error;
  }
}

export async function updatePatientEmail(
  data: UpdatePatientEmailRequestModel
): Promise<PatientEmailState | null> {
  try {
    const response =
      await HttpService.getHttpClientInstance().put<PatientEmailState>(
        "api/patients/emails",
        data
      );

    if (response.status === 202) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to update patient email", error);
    throw error;
  }
}

export async function insertPatientHealthVital(
  data: InsertPatientHealthVitalRequestModel
): Promise<PatientHealthVitalState | null> {
  try {
    const response =
      await HttpService.getHttpClientInstance().post<PatientHealthVitalState>(
        "api/patients/vitals",
        data
      );

    if (response.status === 201) {
      response.data.healthVitalTypeCode = data.healthVitalCode;
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to insert patient health vitals", error);
    throw error;
  }
}

export async function getPatientProfile(
  patientId: number
): Promise<PatientProfileState> {
  try {
    const response =
      await HttpService.getHttpClientInstance().get<PatientProfileState>(
        `/api/patients/${patientId}`
      );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch patient profile information.", error);
    throw error;
  }
}

export async function getPatientIdentities(
  patientId: number
): Promise<PatientIdentityState[]> {
  try {
    const response = await HttpService.getHttpClientInstance().get<
      PatientIdentityState[]
    >(`/api/patients/identities/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch patient identities", error);
    throw error;
  }
}

export async function getPatientAddresses(
  patientId: number
): Promise<PatientAddressState[]> {
  try {
    const response = await HttpService.getHttpClientInstance().get<
      PatientAddressState[]
    >(`/api/patients/addresses/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch patient addresses", error);
    throw error;
  }
}

export async function getPatientPhones(
  patientId: number
): Promise<PatientPhoneState[]> {
  try {
    const response = await HttpService.getHttpClientInstance().get<
      PatientPhoneState[]
    >(`/api/patients/phones/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch patient phones", error);
    throw error;
  }
}

export async function getPatientEmails(
  patientId: number
): Promise<PatientEmailState[]> {
  try {
    const response = await HttpService.getHttpClientInstance().get<
      PatientEmailState[]
    >(`/api/patients/emails/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch patient emails", error);
    throw error;
  }
}
