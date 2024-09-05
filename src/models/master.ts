export interface Language {
  languageId: number;
  languageCode: string;
  languageName: string;
}

export interface Gender {
  genderId: number;
  genderCode: string;
  genderName: string;
}

export interface IdentityType {
  identityTypeId: number;
  identityTypeCode: string;
  identityTypeName: string;
}

export interface AddressType {
  addressTypeId: number;
  addressTypeCode: string;
  addressTypeName: string;
}

export interface PhoneType {
  phoneTypeId: number;
  phoneTypeCode: string;
  phoneTypeName: string;
}

export interface State {
  stateId: number;
  stateCode: string;
  stateName: string;
}

export interface HealthVital {
  healthVitalId: number;
  healthVitalCode: string;
  healthVitalName: string;
  healthVitalUnit: string;
}
