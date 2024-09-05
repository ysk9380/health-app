import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import PatientSearch from "./patient-search";
import PatientInformation from "./patient-information";

const PatientPortal: React.FC = () => {
  const currentPatient = useSelector(
    (state: RootState) => state.currentPatient
  );

  return (
    <>{currentPatient.profile ? <PatientInformation /> : <PatientSearch />}</>
  );
};

export default PatientPortal;
