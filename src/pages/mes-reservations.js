import React, { useEffect, useState } from "react";
import "../styles/MesReservations.css";

function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    fetch(`http://localhost:3001/reservations/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Réservations de l'utilisateur :", data);

        if (Array.isArray(data)) {
          setReservations(data);
        } else {
          console.error("Réponse inattendue :", data);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des réservations :",
          error,
        );
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Chargement des réservations...</p>;
  }

  return (
    <div>
      <h1>Mes Réservations</h1>

      {reservations.length === 0 ? (
        <p>Vous n'avez aucune réservation pour le moment.</p>
      ) : (
        <div className="reservations-list">
          {reservations.map((reservation) => (
            <div className="reservation-card" key={reservation.id}>
              {reservation.prestation_cover && (
                <img
                  src={reservation.prestation_cover}
                  alt={reservation.prestation_title}
                  className="reservation-image"
                />
              )}
              <div className="reservation-info">
                <h2>{reservation.prestation_title}</h2>
                <p>
                  Date :{" "}
                  {new Date(reservation.date_reservation).toLocaleDateString(
                    "fr-FR",
                  )}
                </p>
                {reservation.creneau_horaire && (
                  <p>Créneau : {reservation.creneau_horaire}</p>
                )}
                <p>Personnes : {reservation.nombre_personnes}</p>
                <p>Paiement : {reservation.mode_paiement}</p>
                <p>Statut : {reservation.statut}</p>
                {reservation.message && <p>Message : {reservation.message}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MesReservations;
