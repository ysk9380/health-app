import React, { useState } from "react";
import {
  Box,
  Step,
  StepLabel,
  Stepper,
  Typography,
  MobileStepper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PatientProfileAdd } from "./patient-profile-add";
import { useTranslation } from "react-i18next";
import PatientIdentityAdd from "./patientI-identity-add";
import PatientAddressAdd from "./patient-address-add";
import PatientContactAdd from "./patient-contact-add";
import PatientHealthVitalsAdd from "./patient-health-vitals-add";
import { useNavigate } from "react-router-dom";

const PatientAdd: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const navigate = useNavigate();

  const steps = [
    t("basicProfileInformation"),
    t("identityInformation"),
    t("addressInformation"),
    t("contactInformation"),
    t("healthVitals"),
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length - 1) {
      navigate("/patients/information");
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (activeStep === 0) {
      navigate("/patients");
    }
  };

  const isStepOptional = (step: number) => {
    return false;
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <PatientProfileAdd onNext={handleNext} onCancel={handleBack} />;
      case 1:
        return <PatientIdentityAdd onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <PatientAddressAdd onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <PatientContactAdd onNext={handleNext} onBack={handleBack} />;
      case 4:
        return (
          <PatientHealthVitalsAdd onNext={handleNext} onBack={handleBack} />
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Box sx={{ width: "100%", marginTop: 2 }}>
      {isMobile ? (
        <>
          <Typography>{steps[activeStep]}</Typography>
          <MobileStepper
            variant="progress"
            steps={steps.length}
            position="static"
            activeStep={activeStep}
            nextButton={<></>}
            backButton={<></>}
            sx={{ width: "100%" }}
          />
        </>
      ) : (
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: { optional?: React.ReactNode } = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      )}
      <div>{getStepContent(activeStep)}</div>
    </Box>
  );
};

export default PatientAdd;
