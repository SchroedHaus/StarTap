import React from "react";

const Button = ({ children, type, loading, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      loading={loading}
      className={className}
    >
      {children}
    </button>
  );
};

export default Button;
