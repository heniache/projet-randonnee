import React, { useState, useEffect } from "react";
import "../styles/AdminModal.css";

const EMPTY_FORM = {
  titre: "",
  prix: "",
  description: "",
  duree: "",
  niveau: "",
  cover: "",
};

function AdminPrestationModal({ prestation, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (prestation) {
      setForm({
        titre: prestation.titre || "",
        prix: prestation.prix || "",
        description: prestation.description || "",
        duree: prestation.duree || "",
        niveau: prestation.niveau || "",
        cover: prestation.cover || "",
      });
      setPreview(prestation.cover || null);
    } else {
      setForm(EMPTY_FORM);
      setPreview(null);
    }
    setImageFile(null);
  }, [prestation]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ ...form, prix: Number(form.prix) }, imageFile);
  }

  return (
    <div className="admin-modal" onClick={onClose}>
      <div
        className="admin-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="admin-modal__close" onClick={onClose}>
          ×
        </button>
        <h2 className="admin-modal__title">
          {prestation ? "Modifier la prestation" : "Ajouter une prestation"}
        </h2>
        <form className="admin-modal__form" onSubmit={handleSubmit}>
          <div className="admin-modal__image-section">
            {preview && (
              <img
                className="admin-modal__preview"
                src={preview}
                alt="Aperçu"
              />
            )}
            <label className="admin-modal__file-label">
              {preview ? "Changer l'image" : "Ajouter une image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="admin-modal__file-input"
              />
            </label>
          </div>

          <label className="admin-modal__label">
            Titre
            <input
              type="text"
              name="titre"
              value={form.titre}
              onChange={handleChange}
              required
              className="admin-modal__input"
            />
          </label>

          <div className="admin-modal__row">
            <label className="admin-modal__label">
              Prix (€)
              <input
                type="number"
                name="prix"
                value={form.prix}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                className="admin-modal__input"
              />
            </label>
            <label className="admin-modal__label">
              Durée
              <input
                type="text"
                name="duree"
                value={form.duree}
                onChange={handleChange}
                placeholder="ex : 2h, 1 journée"
                className="admin-modal__input"
              />
            </label>
          </div>

          <label className="admin-modal__label">
            Niveau
            <select
              name="niveau"
              value={form.niveau}
              onChange={handleChange}
              className="admin-modal__input"
            >
              <option value="">-- Choisir --</option>
              <option value="Débutant">Débutant</option>
              <option value="Moyen">Moyen</option>
              <option value="Expert">Expert</option>
              <option value="Tout niveau">Tout niveau</option>
            </select>
          </label>

          <label className="admin-modal__label">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="admin-modal__input admin-modal__textarea"
            />
          </label>

          <button type="submit" className="main-button admin-modal__submit">
            {prestation ? "Enregistrer" : "Ajouter"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPrestationModal;
