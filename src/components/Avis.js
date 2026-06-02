import React, { useCallback, useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import "../styles/Avis.css";

function Avis({ type, targetId }) {
  const [avis, setAvis] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");

  const token = localStorage.getItem("token");
  const utilisateurId = localStorage.getItem("userId");

  const baseUrl =
    type === "item"
      ? `http://localhost:3001/items/${targetId}/avis`
      : `http://localhost:3001/prestations/${targetId}/avis`;

  const labelCible = type === "item" ? "cet article" : "cette prestation";

  const chargerAvis = useCallback(() => {
    fetch(baseUrl)
      .then((res) => res.json())
      .then((data) => {
        const seen = new Set();
        const unique = data.filter((item) => {
          const key = item.utilisateur_id ?? item.id;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setAvis(unique);
        setCurrentIndex(0);
      })
      .catch((error) => {
        console.error("Erreur récupération avis :", error);
      });
  }, [baseUrl]);

  useEffect(() => {
    chargerAvis();
  }, [chargerAvis]);

  function ajouterAvis(e) {
    e.preventDefault();

    if (!token || !utilisateurId) {
      alert("Vous devez être connecté pour laisser un avis.");
      return;
    }

    if (note === 0) {
      alert("Veuillez choisir une note.");
      return;
    }

    fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ note, commentaire }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setNote(0);
        setCommentaire("");
        chargerAvis();
      })
      .catch((error) => {
        console.error("Erreur ajout avis :", error);
      });
  }

  function prev() {
    setCurrentIndex((i) => (i - 1 + avis.length) % avis.length);
  }

  function next() {
    setCurrentIndex((i) => (i + 1) % avis.length);
  }

  const current = avis[currentIndex];
  const dejaAvis = avis.some(
    (item) => String(item.utilisateur_id) === String(utilisateurId)
  );

  return (
    <div className="avis">
      <h2>Avis</h2>

      {avis.length === 0 ? (
        <p className="avis-empty">Aucun avis pour le moment.</p>
      ) : (
        <div className="avis-carousel">
          <div className="avis-card">
            <div className="avis-card-header">
              <div>
                <h3>
                  {current.prenom} {current.nom}
                </h3>
                <p className="avis-date">
                  {new Date(current.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <Rating value={current.note} readOnly />
            </div>
            <p className="avis-commentaire">{current.commentaire}</p>
          </div>

          {avis.length > 1 && (
            <div className="avis-nav">
              <button className="avis-btn" onClick={prev} aria-label="Précédent">
                &lt;
              </button>
              <span className="avis-counter">
                {currentIndex + 1} / {avis.length}
              </span>
              <button className="avis-btn" onClick={next} aria-label="Suivant">
                &gt;
              </button>
            </div>
          )}
        </div>
      )}

      {token && utilisateurId ? (
        dejaAvis ? (
          <p className="avis-deja">
            Vous avez déjà laissé un avis pour {labelCible}.
          </p>
        ) : (
          <form className="avis-form" onSubmit={ajouterAvis}>
            <h3>Laisser un avis</h3>

            <Rating
              value={note}
              onChange={(event, newValue) => {
                setNote(newValue);
              }}
            />

            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Écrivez votre commentaire..."
            />

            <button type="submit">Envoyer</button>
          </form>
        )
      ) : (
        <p>Connectez-vous pour laisser un avis.</p>
      )}
    </div>
  );
}

export default Avis;
