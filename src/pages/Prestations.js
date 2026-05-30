import React from "react";
import PrestationsList from "../components/PrestationsList";
import "../styles/Prestations.css";
function Prestations() {
  return (
    <div className="prestations-container">
      <h1>Nos Prestations</h1>
      <p>
        Découvrez nos prestations de qualité pour répondre à tous vos besoins.
      </p>
      <PrestationsList />
    </div>
  );
}

export default Prestations;
