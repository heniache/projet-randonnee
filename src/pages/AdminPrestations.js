import React, { useState, useEffect } from "react";
import AdminPrestationItem from "../components/AdminPrestationItem";
import AdminPrestationModal from "../components/AdminPrestationModal";
import "../styles/Admin.css";

function AdminPrestations() {
  const [prestations, setPrestations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchPrestations = () => {
    fetch("http://localhost:3001/prestations")
      .then((res) => res.json())
      .then((data) => setPrestations(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchPrestations();
  }, []);

  function handleEdit(prestation) {
    setEditing(prestation);
    setModalOpen(true);
  }

  function handleDelete(id) {
    if (!window.confirm("Supprimer cette prestation ? Action irréversible."))
      return;
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3001/prestations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) setPrestations((prev) => prev.filter((p) => p.id !== id));
        else alert("Erreur lors de la suppression.");
      })
      .catch((err) => console.error(err));
  }

  async function uploadImage(imageFile, prestationId) {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("vetementId", prestationId); // route /upload met à jour items, pas prestations — voir note
    const response = await fetch("http://localhost:3001/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) throw new Error("Erreur upload.");
    const data = await response.json();
    return data.imageUrl;
  }

  async function handleSave(formData, imageFile) {
    const token = localStorage.getItem("token");

    if (editing) {
      // Modification
      const response = await fetch(
        `http://localhost:3001/prestations/${editing.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      ).catch((e) => console.error(e));
      if (!response.ok) {
        alert("Erreur modification.");
        return;
      }
      setPrestations((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...formData } : p)),
      );
    } else {
      // Ajout via FormData (image incluse)
      const postData = new FormData();
      postData.append("titre", formData.titre);
      postData.append("prix", formData.prix);
      postData.append("description", formData.description);
      postData.append("duree", formData.duree);
      postData.append("level", formData.level);
      if (imageFile) postData.append("image", imageFile);

      const response = await fetch("http://localhost:3001/prestations", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: postData,
      }).catch((e) => console.error(e));
      if (!response.ok) {
        alert("Erreur ajout.");
        return;
      }
      const newPrestation = await response.json();
      setPrestations((prev) => [...prev, newPrestation]);
    }

    setModalOpen(false);
    setEditing(null);
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Gestion des prestations</h1>
        <button
          className="main-button admin-add-btn"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          + Ajouter une prestation
        </button>
      </div>
      <div className="admin-list">
        {prestations.map((p) => (
          <AdminPrestationItem
            key={p.id}
            prestation={p}
            onEdit={() => handleEdit(p)}
            onDelete={() => handleDelete(p.id)}
          />
        ))}
        {prestations.length === 0 && (
          <p className="admin-empty">Aucune prestation.</p>
        )}
      </div>
      {modalOpen && (
        <AdminPrestationModal
          prestation={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default AdminPrestations;
