import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import "../styles/PrestationDetails.css";
import Avis from "../components/Avis";
import AgendaSelector from "../components/AgendaSelector";

function PrestationDetails() {
  const { idPrestation } = useParams();
  const history = useHistory();

  const [prestation, setPrestation] = useState(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3001/prestations/${idPrestation}`)
      .then((response) => response.json())
      .then((data) => setPrestation(data))
      .catch((error) =>
        console.error("Erreur récupération détail prestation :", error)
      );
  }, [idPrestation]);

  if (!prestation) {
    return <p className="prestation-loading">Chargement...</p>;
  }

  function handleReservationOnClick() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      alert("Vous devez être connecté pour réserver une prestation.");
      history.push("/login");
      return;
    }
    setShowReservationForm(true);
  }

  function handleReservationSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!selectedSlot) {
      alert("Veuillez sélectionner un créneau horaire.");
      return;
    }

    const formData = new FormData(e.target);
    const reservationData = {
      prestationId: idPrestation,
      date_reservation: selectedDate,
      creneau_horaire: selectedSlot,
      nombre_personnes: formData.get("nombre_personnes"),
      mode_paiement: formData.get("mode_paiement"),
      message: formData.get("message"),
    };

    fetch("http://localhost:3001/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reservationData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Réservation confirmée !");
          history.push("/prestations");
        } else {
          alert("Erreur lors de la réservation.");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la requête de réservation :", error);
        alert("Erreur réseau lors de la réservation.");
      });
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="prestationDetails-page">
      <h1 className="prestation-detail-heading">Détail de la prestation</h1>

      <div className="prestation-details-content">
        <h2 className="prestation-detail-name">{prestation.title}</h2>

        <img
          className="prestation-detail-image"
          src={prestation.cover}
          alt={prestation.title}
        />

        <p className="prestation-detail-description">{prestation.description}</p>
        <p className="prestation-detail-meta">Durée : {prestation.duree}</p>
        <p className="prestation-detail-meta">Niveau : {prestation.niveau}</p>
        <p className="prestation-detail-price">Prix : {prestation.prix}€</p>

        <Avis type="prestation" targetId={idPrestation} />

        <div className="prestation-detail-actions">
          <button
            className="button-Add"
            onClick={() => history.push("/prestations")}
          >
            Retour
          </button>

          <button className="button-Add" onClick={handleReservationOnClick}>
            Réserver
          </button>

          {showReservationForm && (
            <form className="reservation-form" onSubmit={handleReservationSubmit}>
              <h3>Formulaire de réservation</h3>

              <label className="detail-label" htmlFor="date_reservation">
                Date souhaitée :
              </label>
              <input
                id="date_reservation"
                className="detail-input"
                type="date"
                name="date_reservation"
                min={today}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot("");
                }}
                required
              />

              <label className="detail-label">Créneau horaire :</label>
              <AgendaSelector
                prestationId={idPrestation}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                onSelect={setSelectedSlot}
              />
              {selectedSlot && (
                <p className="selected-slot-info">
                  Créneau sélectionné : <strong>{selectedSlot}</strong>
                </p>
              )}

              <label className="detail-label" htmlFor="nombre_personnes">
                Nombre de personnes :
              </label>
              <input
                id="nombre_personnes"
                className="detail-input"
                type="number"
                name="nombre_personnes"
                min="1"
                required
              />

              <label className="detail-label" htmlFor="mode_paiement">
                Mode de paiement :
              </label>
              <select
                id="mode_paiement"
                className="detail-input"
                name="mode_paiement"
              >
                <option value="Carte bancaire">Carte bancaire</option>
                <option value="PayPal">PayPal</option>
                <option value="Virement bancaire">Virement bancaire</option>
                <option value="Paiement sur place">Paiement sur place</option>
              </select>

              <label className="detail-label" htmlFor="message">
                Message :
              </label>
              <textarea
                id="message"
                className="detail-input"
                name="message"
                placeholder="Ajoutez une information si besoin..."
              />

              <button className="button-Add" type="submit">
                Confirmer la réservation
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default PrestationDetails;
