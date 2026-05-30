import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import "../styles/PrestationDetails.css";

function PrestationDetails() {
  const { idPrestation } = useParams();
  const history = useHistory();

  const [prestation, setPrestation] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/prestations/${idPrestation}`)
      .then((response) => response.json())
      .then((data) => {
        setPrestation(data);
      })
      .catch((error) => {
        console.error("Erreur récupération détail prestation :", error);
      });
  }, [idPrestation]);

  if (!prestation) {
    return <p className="prestation-loading">Chargement...</p>;
  }

  return (
    <div className="prestationDetails-page">
      <h1 className="prestation-detail-heading">Détail de la prestation</h1>

      <div className="prestation-details-content">
        <h2 className="prestation-detail-name">{prestation.title}</h2>

        <img
          className="prestation-detail-image"
          src={prestation.cover}
          alt={prestation.title}
        />

        <p className="prestation-detail-description">
          {prestation.description}
        </p>

        <p className="prestation-detail-meta">Durée : {prestation.duree}</p>

        <p className="prestation-detail-meta">Niveau : {prestation.niveau}</p>

        <p className="prestation-detail-price">Prix : {prestation.prix}€</p>

        <div className="prestation-detail-actions">
          <button
            className="button-Add"
            onClick={() => history.push("/prestations")}
          >
            Retour
          </button>

          <button className="button-Add">Réserver</button>
        </div>
      </div>
    </div>
  );
}

export default PrestationDetails;
