import React from "react";
import { Link } from "react-router-dom";
import "../styles/PrestationItem.css";
function PrestationItem({ prestation }) {
  return (
    <li className="prestation-card">
      {prestation.cover && (
        <img
          className="prestation-image"
          src={prestation.cover}
          alt={prestation.titre}
        />
      )}

      <h2>{prestation.titre}</h2>
      <p className="prestation-description">{prestation.description}</p>
      <p>Durée : {prestation.duree}</p>
      <p>Niveau : {prestation.niveau}</p>
      <p className="prestation-price">Prix : {prestation.prix}€</p>
      <Link to={`/prestations/${prestation.id}`}>
        <button className="button-Add">Voir la prestation</button>
      </Link>
    </li>
  );
}

export default PrestationItem;
