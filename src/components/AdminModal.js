import React, { useState, useEffect } from 'react';
import '../styles/AdminModal.css';

const EMPTY_FORM = {
  name: '',
  price: '',
  description: '',
  category: '',
  size: '',
  comfort: '',
  onSale: false,
  cover: '',
};

function AdminModal({ item, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        price: item.price || '',
        description: item.description || '',
        category: item.category || '',
        size: item.size || '',
        comfort: item.comfort || '',
        onSale: item.onSale || false,
        cover: item.cover || '',
      });
      setPreview(item.cover || null);
    } else {
      setForm(EMPTY_FORM);
      setPreview(null);
    }
    setImageFile(null);
  }, [item]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(
      { ...form, price: Number(form.price), comfort: Number(form.comfort) },
      imageFile,
    );
  }

  return (
    <div className="admin-modal" onClick={onClose}>
      <div className="admin-modal__content" onClick={e => e.stopPropagation()}>
        <button className="admin-modal__close" onClick={onClose}>×</button>
        <h2 className="admin-modal__title">
          {item ? "Modifier l'article" : 'Ajouter un article'}
        </h2>
        <form className="admin-modal__form" onSubmit={handleSubmit}>
          <div className="admin-modal__image-section">
            {preview && (
              <img className="admin-modal__preview" src={preview} alt="Aperçu" />
            )}
            <label className="admin-modal__file-label">
              {preview ? "Changer l'image" : 'Ajouter une image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="admin-modal__file-input"
              />
            </label>
          </div>

          <label className="admin-modal__label">
            Nom
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nom de l'article"
              required
              className="admin-modal__input"
            />
          </label>

          <div className="admin-modal__row">
            <label className="admin-modal__label">
              Prix (€)
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
                required
                className="admin-modal__input"
              />
            </label>
            <label className="admin-modal__label">
              Confort (1–5)
              <input
                type="number"
                name="comfort"
                value={form.comfort}
                onChange={handleChange}
                placeholder="3"
                min="1"
                max="5"
                className="admin-modal__input"
              />
            </label>
          </div>

          <label className="admin-modal__label">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description de l'article"
              rows={3}
              className="admin-modal__input admin-modal__textarea"
            />
          </label>

          <div className="admin-modal__row">
            <label className="admin-modal__label">
              Catégorie
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="ex : équipement"
                className="admin-modal__input"
              />
            </label>
            <label className="admin-modal__label">
              Taille
              <input
                type="text"
                name="size"
                value={form.size}
                onChange={handleChange}
                placeholder="ex : M, 42, Unique"
                className="admin-modal__input"
              />
            </label>
          </div>

          <label className="admin-modal__checkbox-label">
            <input
              type="checkbox"
              name="onSale"
              checked={form.onSale}
              onChange={handleChange}
            />
            En promotion
          </label>

          <button type="submit" className="main-button admin-modal__submit">
            {item ? 'Enregistrer les modifications' : "Ajouter l'article"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminModal;
