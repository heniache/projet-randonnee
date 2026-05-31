import { useContext } from "react";
import { LoadingContext } from "../context";
import "../styles/LoadingOverlay.css";

function LoadingOverlay() {
  const { isLoading } = useContext(LoadingContext);
  if (!isLoading) return null;
  return (
    <div className="loading-overlay">
      <div className="loading-spinner" />
    </div>
  );
}

export default LoadingOverlay;
