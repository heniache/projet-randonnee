import React, { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import { useHistory } from "react-router-dom";
import "../styles/MesAvis.css";

function MesAvis() {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState(0);
  const [editCommentaire, setEditCommentaire] = useState("");

  const history = useHistory();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  function chargerAvis() {
    fetch(`http://localhost:3001/utilisateur/${userId}/avis`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAvis(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur récupération mes avis :", error);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (!token || !userId) {
      history.push("/login");
      return;
    }
    chargerAvis();
  }, []);

  function startEdit(item) {
    setEditingId(item.id);
    setEditNote(item.note);
    setEditCommentaire(item.commentaire || "");
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function saveEdit(id) {
    fetch(`http://localhost:3001/avis/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ note: editNote, commentaire: editCommentaire }),
    })
      .then((res) => res.json())
      .then(() => {
        setEditingId(null);
        chargerAvis();
      })
      .catch((error) => console.error("Erreur modification avis :", error));
  }

  function supprimerAvis(id) {
    if (!window.confirm("Supprimer cet avis définitivement ?")) return;

    fetch(`http://localhost:3001/avis/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => chargerAvis())
      .catch((error) => console.error("Erreur suppression avis :", error));
  }

  if (loading) return <p className="mes-avis-loading">Chargement...</p>;

  return (
    <div className="mes-avis-page">
      <h1 className="mes-avis-heading">Mes avis</h1>

      {avis.length === 0 ? (
        <p className="mes-avis-empty">Vous n'avez pas encore laissé d'avis.</p>
      ) : (
        <div className="mes-avis-list">
          {avis.map((item) => (
            <div className="mes-avis-card" key={item.id}>
              <div className="mes-avis-card-top">
                {(item.prestation_cover || item.item_cover) && (
                  <img
                    className="mes-avis-cover"
                    src={item.prestation_cover ?? item.item_cover}
                    alt={item.prestation_titre ?? item.item_titre}
                  />
                )}
                <div className="mes-avis-meta">
                  <h2 className="mes-avis-prestation">
                    {item.prestation_titre ?? item.item_titre}
                  </h2>
                  <p className="mes-avis-date">
                    {new Date(item.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>

              {editingId === item.id ? (
                <div className="mes-avis-edit-form">
                  <Rating
                    value={editNote}
                    onChange={(_, val) => setEditNote(val)}
                  />
                  <textarea
                    value={editCommentaire}
                    onChange={(e) => setEditCommentaire(e.target.value)}
                    placeholder="Votre commentaire..."
                  />
                  <div className="mes-avis-edit-actions">
                    <button className="btn-valider" onClick={() => saveEdit(item.id)}>
                      Valider
                    </button>
                    <button className="btn-annuler" onClick={cancelEdit}>
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Rating value={item.note} readOnly />
                  <p className="mes-avis-commentaire">{item.commentaire}</p>
                  <div className="mes-avis-actions">
                    <button className="btn-modifier" onClick={() => startEdit(item)}>
                      Modifier
                    </button>
                    <button className="btn-supprimer" onClick={() => supprimerAvis(item.id)}>
                      Supprimer
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MesAvis;
