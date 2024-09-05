import React from "react";
import { CircularProgress, Backdrop } from "@mui/material";

const Loader: React.FC = () => {
  return (
    <Backdrop open={true} sx={{ zIndex: 9999 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loader;
