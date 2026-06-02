import { useState, useEffect } from "react";
import "../styles/AgendaSelector.css";

const ALL_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

function AgendaSelector({
  prestationId,
  selectedDate,
  selectedSlot,
  onSelect,
}) {
  const [takenSlots, setTakenSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate) {
      setTakenSlots([]);
      return;
    }
    setLoading(true);
    fetch(
      `http://localhost:3001/prestations/${prestationId}/creneaux-pris?date=${selectedDate}`,
    )
      .then((r) => r.json())
      .then((data) => {
        setTakenSlots(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedDate, prestationId]);

  if (!selectedDate) {
    return (
      <p className="agenda-hint">
        Sélectionnez d'abord une date pour voir les créneaux disponibles.
      </p>
    );
  }

  if (loading) {
    return <p className="agenda-hint">Chargement des créneaux...</p>;
  }

  return (
    <div className="agenda-container">
      <p className="agenda-legend">
        <span className="agenda-legend-dot available-dot" /> Disponible
        <span className="agenda-legend-dot taken-dot" /> Complet
        {selectedSlot && (
          <>
            <span className="agenda-legend-dot selected-dot" /> Sélectionné
          </>
        )}
      </p>
      <div className="agenda-grid">
        {ALL_SLOTS.map((slot) => {
          const taken = takenSlots.includes(slot);
          const selected = slot === selectedSlot;
          return (
            <button
              key={slot}
              type="button"
              className={`agenda-slot ${taken ? "taken" : selected ? "selected" : "available"}`}
              onClick={() => !taken && onSelect(slot)}
              disabled={taken}
              aria-pressed={selected}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AgendaSelector;
