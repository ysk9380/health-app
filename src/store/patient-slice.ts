// health-app/src/store/selectedPatientSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  PatientProfileState,
  PatientIdentityState,
  PatientAddressState,
  PatientPhoneState,
  PatientEmailState,
  PatientHealthVitalState,
} from "../models/patient";

interface CurrentPatientState {
  profile: PatientProfileState | null;
  identity: PatientIdentityState | null;
  address: PatientAddressState | null;
  phones: PatientPhoneState[] | null;
  email: PatientEmailState | null;
  vitals: PatientHealthVitalState[] | null;
}

const initialState: CurrentPatientState = {
  profile: null,
  identity: null,
  address: null,
  phones: [],
  email: null,
  vitals: [],
};

const currentPatientSlice = createSlice({
  name: "currentPatient",
  initialState,
  reducers: {
    setPatientProfile(state, action: PayloadAction<PatientProfileState>) {
      state.profile = action.payload;
    },
    setPatientIdentity(state, action: PayloadAction<PatientIdentityState>) {
      state.identity = action.payload;
    },
    setPatientAddress(state, action: PayloadAction<PatientAddressState>) {
      state.address = action.payload;
    },
    setPatientPhone(state, action: PayloadAction<PatientPhoneState>) {
      state.phones?.push(action.payload);
    },
    setPatientPhones(state, action: PayloadAction<PatientPhoneState[]>) {
      state.phones = action.payload;
    },
    setPatientEmail(state, action: PayloadAction<PatientEmailState>) {
      state.email = action.payload;
    },
    setPatientHealthVital(
      state,
      action: PayloadAction<PatientHealthVitalState>
    ) {
      state.vitals?.push(action.payload);
    },
    clearPatient(state) {
      state.profile = null;
      state.identity = null;
      state.address = null;
      state.phones = [];
      state.email = null;
    },
  },
});

export const {
  setPatientProfile,
  setPatientIdentity,
  setPatientAddress,
  setPatientPhone,
  setPatientPhones,
  setPatientEmail,
  setPatientHealthVital,
  clearPatient,
} = currentPatientSlice.actions;
export default currentPatientSlice.reducer;
