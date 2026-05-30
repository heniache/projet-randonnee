import React from 'react';
import '../styles/AdminItem.css';

function AdminItem({ item, onEdit, onDelete }) {
  return (
    <div className="admin-item">
      {item.cover && (
        <img className="admin-item__image" src={item.cover} alt={item.name} />
      )}
      <div className="admin-item__info">
        <div className="admin-item__header">
          <h3 className="admin-item__name">{item.name}</h3>
          {item.onSale && <span className="admin-item__badge">Promo</span>}
        </div>
        <p className="admin-item__price">{item.price} €</p>
        {item.description && (
          <p className="admin-item__description">{item.description}</p>
        )}
        <div className="admin-item__details">
          {item.category && <span>Catégorie : {item.category}</span>}
          {item.size && <span>Taille : {item.size}</span>}
          {item.comfort && <span>Confort : {item.comfort}/5</span>}
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

export default AdminItem;
