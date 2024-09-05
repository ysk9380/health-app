import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material"; // Import Material-UI components

const Services: React.FC = () => {
  return (
    <Box marginTop={2}>
      <Outlet />
    </Box>
  );
};

export default Services;
