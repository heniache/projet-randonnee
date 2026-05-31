import { useEffect, useState } from "react";
import AdminReservationItem from "../components/AdminReservationItem";
import "../styles/AdminReservations.css";

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  // Filtres
  const [filtreStatut, setFiltreStatut] = useState("all");
  const [triDate, setTriDate] = useState("desc");

  const fetchReservations = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/admin/reservations", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setReservations(data);
        else console.error("Réponse inattendue :", data);
      })
      .catch((err) => console.error("Erreur :", err));
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Change le statut d'une réservation
  const handleStatutChange = (id, nouveauStatut) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3001/admin/reservations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ statut: nouveauStatut }),
    })
      .then((res) => {
        if (res.ok) fetchReservations();
        else alert("Erreur lors de la mise à jour du statut.");
      })
      .catch((err) => console.error("Erreur :", err));
  };

  function resetFiltres() {
    setFiltreStatut("all");
    setTriDate("desc");
  }

  // On filtre puis on trie avant l'affichage
  const reservationsAffichees = reservations
    .filter((r) => filtreStatut === "all" || r.statut === filtreStatut)
    .sort((a, b) => {
      const dateA = new Date(a.date_reservation);
      const dateB = new Date(b.date_reservation);
      return triDate === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Gestion des réservations</h1>
      </div>

      <div
        className="admin-reservations-filters"
        style={{ marginBottom: "24px", display: "flex", gap: "16px" }}
      >
        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          className="admin-modal__input"
          style={{ width: "auto" }}
        >
          <option value="all">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="Confirmée">Confirmée</option>
          <option value="Annulée">Annulée</option>
          <option value="Terminée">Terminée</option>
        </select>

        <select
          value={triDate}
          onChange={(e) => setTriDate(e.target.value)}
          className="admin-modal__input"
          style={{ width: "auto" }}
        >
          <option value="desc">Date décroissante</option>
          <option value="asc">Date croissante</option>
        </select>

        <button className="admin-item__delete" onClick={resetFiltres}>
          Réinitialiser
        </button>
      </div>

      {reservationsAffichees.length === 0 ? (
        <p className="admin-empty">Aucune réservation trouvée.</p>
      ) : (
        // On remplace le <table> par admin-list pour empiler les cartes proprement
        <div className="admin-list">
          {reservationsAffichees.map((r) => (
            <AdminReservationItem
              key={r.id}
              reservation={r}
              onStatutChange={handleStatutChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReservations;
