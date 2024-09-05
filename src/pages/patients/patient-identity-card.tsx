import React, { useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
} from "@mui/material";
import Barcode from "react-barcode";
import ReactToPrint from "react-to-print";

interface PatientInformationProps {
  name: string;
  phoneNumbers: string;
  bloodGroup: string;
  address: string;
  patientId: string;
}

const PatientIdentityCard: React.FC<PatientInformationProps> = ({
  name,
  phoneNumbers,
  bloodGroup,
  address,
  patientId,
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sx={{ display: "flex" }}>
        <Card
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
          ref={componentRef}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6">Identity Card</Typography>
            <Typography variant="body1">
              <strong>Name:</strong> {name}
            </Typography>
            <Typography variant="body1">
              <strong>Phone Number:</strong> {phoneNumbers}
            </Typography>
            <Typography variant="body1">
              <strong>Blood Group:</strong> {bloodGroup}
            </Typography>
            <Typography variant="body1">
              <strong>Address:</strong> {address}
            </Typography>
            <Box marginTop={2}>
              <Barcode value={patientId} height={50} width={3} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
        <ReactToPrint
          trigger={() => (
            <Button variant="text" size="small" sx={{ color: "black" }}>
              Print Identity Card
            </Button>
          )}
          content={() => componentRef.current}
        />
      </Grid>
    </Grid>
  );
};

export default PatientIdentityCard;
