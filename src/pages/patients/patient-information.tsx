import React from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import PatientIdentityCard from "./patient-identity-card";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store"; // Adjust the import path as necessary

const PatientInformation: React.FC = () => {
  const currentPatientProfile = useSelector(
    (state: RootState) => state.currentPatient.profile
  );
  const currentPatientAddress = useSelector(
    (state: RootState) => state.currentPatient.address
  );
  const currentPatientPhones = useSelector(
    (state: RootState) => state.currentPatient.phones
  );

  const getPatientAddress = (): string => {
    let addressParts = [
      currentPatientAddress?.addressLine1,
      currentPatientAddress?.addressLine2,
      currentPatientAddress?.addressLine3,
      `${currentPatientAddress?.city},`,
      currentPatientAddress?.stateName,
      currentPatientAddress?.pincode,
    ];

    let address = addressParts.filter((part) => part).join(" ");
    return address;
  };

  const getPatientPhones = (): string => {
    let phoneNumbersString =
      currentPatientPhones?.map((phone) => phone.phoneNumber).join(", ") ?? "";
    return phoneNumbersString;
  };

  return (
    <Box marginTop={3}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            display: "flex",
            backgroundColor: "#f5f5f5",
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6">Health Information</Typography>
              <Typography variant="body1">
                <strong>Condition:</strong> Condition details
              </Typography>
              <Typography variant="body1">
                <strong>Medications:</strong> Medication details
              </Typography>
              <Typography variant="h6">Vitals</Typography>
              <Typography variant="body1">
                <strong>Blood Pressure:</strong> 120/80
              </Typography>
              <Typography variant="body1">
                <strong>Heart Rate:</strong> 72 bpm
              </Typography>
              <Typography variant="h6">Allergies</Typography>
              <Typography variant="body1">
                <strong>Allergy:</strong> Allergy details
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            backgroundColor: "#D3D3A2",
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <PatientIdentityCard
              name={`${currentPatientProfile?.firstname} ${currentPatientProfile?.lastname}`}
              address={getPatientAddress()}
              phoneNumbers={getPatientPhones()}
              bloodGroup="O+"
              patientId={currentPatientProfile?.patientCode || ""}
            />
            <Card
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">Patient Profile</Typography>
                <Typography variant="body1">
                  <strong>First Name:</strong> First name
                </Typography>
                <Typography variant="body1">
                  <strong>Last Name:</strong> Last name
                </Typography>
                <Typography variant="body1">
                  <strong>Date of Birth:</strong> 09-Mar-1980
                </Typography>
                <Typography variant="h6">Patient Address</Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> patient address
                </Typography>
                <Typography variant="body1">
                  <strong>City:</strong> City
                </Typography>
                <Typography variant="body1">
                  <strong>State:</strong> State
                </Typography>
                <Typography variant="body1">
                  <strong>Zip Code:</strong> Pincode
                </Typography>
                <Typography variant="h6">Contact Information</Typography>
                <Typography variant="body1">
                  <strong>Phone:</strong> Phone number
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> Email address
                </Typography>
                <Typography variant="h6">Identity Information</Typography>
                <Typography variant="body1">
                  <strong>ID Type:</strong> ID type
                </Typography>
                <Typography variant="body1">
                  <strong>ID Number:</strong> ID number
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientInformation;
