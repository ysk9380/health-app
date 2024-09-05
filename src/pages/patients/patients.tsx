import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const Patients: React.FC = () => {
  return (
    <Box marginTop={2}>
      <Outlet />
    </Box>
  );
};

export default Patients;
