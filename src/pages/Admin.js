import React, { useState, useEffect } from "react";
import AdminItem from "../components/AdminItem";
import AdminModal from "../components/AdminModal";
import "../styles/Admin.css";

function Admin() {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(() => {});
  }, []);

  function handleEdit(item) {
    setEditingItem(item);
    setModalOpen(true);
  }

  function handleDelete(id) {
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.",
    );
    if (!confirmation) {
      return;
    }

    const token = localStorage.getItem("token");

    fetch(`http://localhost:3001/items/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Article supprimé.");
          setItems((prev) => prev.filter((item) => item.id !== id));
        } else {
          alert("Erreur lors de la suppression de l'article.");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la requête DELETE :", error);
      });
  }

  async function uploadImage(imageFile, vetementId) {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("vetementId", vetementId);

    const response = await fetch("http://localhost:3001/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) throw new Error("Erreur lors de l'upload de l'image.");
    const data = await response.json();
    return data.imageUrl;
  }

  async function handleSave(formData, imageFile) {
    const token = localStorage.getItem("token");

    if (editingItem) {
      // Modification : PUT /items/:id
      const response = await fetch(
        `http://localhost:3001/items/${editingItem.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      ).catch((error) => {
        console.error("Erreur lors de la requête PUT :", error);
      });

      if (!response.ok) {
        alert("Erreur lors de la modification de l'article.");
        return;
      }

      let updatedItem = { ...editingItem, ...formData };

      if (imageFile) {
        const imageUrl = await uploadImage(imageFile, editingItem.id).catch(
          (error) => console.error(error),
        );
        if (imageUrl) updatedItem = { ...updatedItem, cover: imageUrl };
      }

      setItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? updatedItem : i)),
      );
    } else {
      // Ajout : POST /items avec FormData
      const postData = new FormData();
      postData.append("name", formData.name);
      postData.append("price", formData.price);
      postData.append("comfort", formData.comfort);
      postData.append("size", formData.size);
      postData.append("onSale", formData.onSale);
      postData.append("category", formData.category);
      if (imageFile) postData.append("image", imageFile);

      const response = await fetch("http://localhost:3001/items", {
        method: "POST",
        // Pas de Content-Type : le navigateur le définit automatiquement avec le boundary
        headers: { Authorization: `Bearer ${token}` },
        body: postData,
      }).catch((error) => {
        console.error("Erreur lors de la requête POST :", error);
      });

      if (!response.ok) {
        alert("Erreur lors de l'ajout de l'article.");
        return;
      }

      const newItem = await response.json();
      setItems((prev) => [...prev, newItem]);
    }

    setModalOpen(false);
    setEditingItem(null);
  }

  function handleOpenAdd() {
    setEditingItem(null);
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
    setEditingItem(null);
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Gestion des articles</h1>
        <button className="main-button admin-add-btn" onClick={handleOpenAdd}>
          + Ajouter un article
        </button>
      </div>
      <div className="admin-list">
        {items.map((item) => (
          <AdminItem
            key={item.id}
            item={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
        {items.length === 0 && (
          <p className="admin-empty">Aucun article disponible.</p>
        )}
      </div>
      {modalOpen && (
        <AdminModal
          item={editingItem}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Admin;
