import React from "react";
import { Box } from "@mui/material";
import LanguageSwitcher from "./components/language-switcher";

const Home: React.FC = () => {
  return (
    <>
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          width: "100%",
          marginTop: 2,
        }}
      >
        <Box sx={{ maxWidth: 400, width: "100%" }}>
          <LanguageSwitcher />
        </Box>
      </Box>
    </>
  );
};

export default Home;
