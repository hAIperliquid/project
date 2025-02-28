import React from "react";

export const EthereumIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
  >
    <path
      d="M12 2L4 12l8 5 8-5-8-10zm0 13l-8-5 8 10 8-10-8 5z"
      fill="currentColor"
    />
  </svg>
);
