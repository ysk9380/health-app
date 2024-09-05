import React from "react";
import "./partial-name.css";

interface PartialNameProps {
  name: string;
}

const PartialName: React.FC<PartialNameProps> = ({ name }) => {
  const displayName = name.length > 13 ? `${name.substring(0, 10)}...` : name;

  return (
    <div>
      <span className="partial-name" title={name}>
        {displayName}
      </span>
    </div>
  );
};

export default PartialName;
