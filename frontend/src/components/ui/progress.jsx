import * as React from "react";

export const Progress = ({ value, className }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-4 ${className || ""}`}>
      <div
        className="bg-green-500 h-4 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};
