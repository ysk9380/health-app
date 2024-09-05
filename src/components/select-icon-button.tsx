import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const SelectIconButton = ({ onClick }: { onClick: () => void }) => {
  const [hover, setHover] = useState(false);

  return (
    <IconButton
      color="primary"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      {hover ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
    </IconButton>
  );
};

export default SelectIconButton;
