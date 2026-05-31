import React from "react";
import "../styles/AdminItem.css";
import "../styles/AdminReservationItem.css";

function AdminReservationItem({ reservation, onStatutChange }) {
  const getBadgeStyle = (statut) => {
    switch (statut) {
      case "Confirmée":
        return { background: "#48bb78", color: "white" };
      case "En attente":
        return { background: "#ed8936", color: "white" };
      case "Annulée":
        return { background: "#f56565", color: "white" };
      case "Terminée":
        return { background: "#a0aec0", color: "white" };
      default:
        return { background: "cadetblue", color: "white" };
    }
  };

  return (
    <div className="admin-item">
      {reservation.prestation_cover && (
        <img
          className="admin-item__image"
          src={reservation.prestation_cover}
          alt={reservation.prestation_title}
        />
      )}
      <div className="admin-item__info">
        <div className="admin-item__header">
          <h3 className="admin-item__name">
            {reservation.utilisateur_prenom} {reservation.utilisateur_nom}
          </h3>
          <span
            className="admin-item__badge"
            style={getBadgeStyle(reservation.statut)}
          >
            {reservation.statut}
          </span>
        </div>

        <p className="admin-item__price">{reservation.prestation_title}</p>

        {reservation.message && (
          <p className="admin-item__description">
            Message : {reservation.message}
          </p>
        )}

        <div className="admin-item__details">
          <span>Email : {reservation.utilisateur_email}</span>
          <span>
            Date :{" "}
            {new Date(reservation.date_reservation).toLocaleDateString("fr-FR")}
          </span>
          <span>Personnes : {reservation.nombre_personnes}</span>
          <span>Paiement : {reservation.mode_paiement}</span>
        </div>
      </div>

      <div className="admin-item__actions">
        <select
          className="admin-item__edit"
          style={{ cursor: "pointer", outline: "none" }}
          value={reservation.statut}
          onChange={(e) => onStatutChange(reservation.id, e.target.value)}
        >
          <option value="En attente">En attente</option>
          <option value="Confirmée">Confirmée</option>
          <option value="Annulée">Annulée</option>
          <option value="Terminée">Terminée</option>
        </select>
      </div>
    </div>
  );
}

export default AdminReservationItem;
