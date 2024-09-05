export interface PatientSearchCriteria {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  identityNumber?: string;
  email?: string;
  dateOfBirth?: Date;
}

export interface PatientSearchResponseModel {
  patientId: number;
  patientCode: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  gender: string;
  dateOfBirth: Date;
  phoneNumber: string;
  phoneNumbersString: string;
  emailAddress: string;
  emailAddressesString: string;
  identityNumber: string;
  identityNumbersString: string;
}

export interface PatientProfileState {
  patientId: number;
  patientCode: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  genderCode?: string;
  genderName: string;
  dateOfBirth: string;
}

export interface PatientIdentityState {
  patientIdentityId: number;
  patientId: number;
  identityTypeCode: string;
  identityTypeName?: string;
  identityNumber: string;
  issuedBy: string;
  placeIssued: string;
  expiry?: string;
}

export interface PatientAddressState {
  patientAddressId: number;
  patientId: number;
  addressTypeCode: string;
  addressTypeName: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  city: string;
  pincode: string;
  stateCode: string;
  stateName: string;
}

export interface PatientPhoneState {
  patientPhoneId: number;
  patientId: number;
  phoneNumber: string;
  phoneTypeCode: string;
  phoneTypeName: string;
  listedAs: string;
}

export interface PatientEmailState {
  patientEmailId: number;
  patientId: number;
  emailAddress: string;
}

export interface PatientHealthVitalState {
  patientHealthVitalId: number;
  patientId: number;
  healthVitalTypeCode: string;
  healthVitalValue: string;
}

export interface InsertPatientProfileRequestModel {
  firstname: string;
  middlename: string;
  lastname: string;
  genderCode: string;
  dateOfBirth: Date | null;
  forceCreate: boolean;
}

export interface UpdatePatientProfileRequestModel {
  patientId: number;
  firstname: string;
  middlename: string;
  lastname: string;
  genderCode: string;
  dateOfBirth: Date | null;
}

export interface InsertPatientIdentityRequestModel {
  patientId: number;
  identityTypeCode: string;
  identityNumber: string;
  issuedBy: string;
  placeIssued: string;
  expiry: Date | null;
}

export interface UpdatePatientIdentityRequestModel {
  patientIdentityId: number;
  identityTypeCode: string;
  identityNumber: string;
  issuedBy: string;
  placeIssued: string;
  expiry: Date | null;
}

export interface InsertPatientAddressRequestModel {
  patientId: number;
  addressTypeCode: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  city: string;
  pincode: string;
  stateCode: string;
}

export interface UpdatePatientAddressRequestModel {
  patientAddressId: number;
  addressTypeCode: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  city: string;
  pincode: string;
  stateCode: string;
}

export interface InsertPatientPhoneRequestModel {
  patientId: number;
  phoneNumber: string;
  phoneTypeCode: string;
  listedAs: string;
}

export interface UpdatePatientPhoneRequestModel {
  patientPhoneId: number;
  phoneNumber: string;
  phoneTypeCode: string;
  listedAs: string;
}

export interface InsertPatientEmailRequestModel {
  patientId: number;
  emailAddress: string;
}

export interface UpdatePatientEmailRequestModel {
  patientEmailId: number;
  emailAddress: string;
}

export interface InsertPatientHealthVitalRequestModel {
  patientId: number;
  healthVitalTypeCode: string;
  healthVitalValue: string;
}
