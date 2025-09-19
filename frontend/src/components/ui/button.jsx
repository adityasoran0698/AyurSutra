import * as React from "react";

export const Button = ({
  children,
  onClick,
  variant = "primary",
  className,
}) => {
  const baseStyles =
    "px-4 py-2 rounded-xl font-semibold focus:outline-none transition-all duration-200";

  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 shadow-md",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || ""} ${className || ""}`}
    >
      {children}
    </button>
  );
};
