import React from "react";
import "../styles/AdminItem.css";

function AdminPrestationItem({ prestation, onEdit, onDelete }) {
  return (
    <div className="admin-item">
      {prestation.cover && (
        <img
          className="admin-item__image"
          src={prestation.cover}
          alt={prestation.titre}
        />
      )}
      <div className="admin-item__info">
        <div className="admin-item__header">
          <h3 className="admin-item__name">{prestation.titre}</h3>
        </div>
        <p className="admin-item__price">{prestation.prix} €</p>
        {prestation.description && (
          <p className="admin-item__description">{prestation.description}</p>
        )}
        <div className="admin-item__details">
          {prestation.duree && <span>Durée : {prestation.duree}</span>}
          {prestation.niveau && <span>Niveau : {prestation.niveau}</span>}
        </div>
      </div>
      <div className="admin-item__actions">
        <button className="switch-button admin-item__edit" onClick={onEdit}>
          Modifier
        </button>
        <button className="admin-item__delete" onClick={onDelete}>
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default AdminPrestationItem;
