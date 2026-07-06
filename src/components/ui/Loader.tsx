import React from "react";

interface LoaderProps {
  className?: string;
  minHeight?: string;
  size?: "sm" | "md" | "lg";
}

export default function Loader({ 
  className = "", 
  minHeight = "min-h-[400px]",
  size = "md" 
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-10 w-10 border-4",
  };

  return (
    <div className={`flex w-full items-center justify-center ${minHeight} ${className}`}>
      <div className={`animate-spin rounded-full border-primary border-t-transparent ${sizeClasses[size]}`}></div>
    </div>
  );
}
