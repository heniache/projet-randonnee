import React, { useState, useEffect } from "react";
import PrestationItem from "./PrestationItem";
import "../styles/PrestationsList.css";

const CARD_WIDTH = 270; // 250px card + 20px gap

function PrestationsList() {
  const [prestations, setPrestations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recherche, setRecherche] = useState("");
  const [niveauChoisi, setNiveauChoisi] = useState("all");
  const [triPrix, setTriPrix] = useState("default");

  const niveaux = [
    ...new Set(prestations.map((p) => p.niveau).filter(Boolean)),
  ];

  const prestationsFiltrees = prestations
    .filter((p) => {
      const correspondRecherche = p.titre
        .toLowerCase()
        .includes(recherche.toLowerCase());
      const correspondNiveau =
        niveauChoisi === "all" || p.niveau === niveauChoisi;
      return correspondRecherche && correspondNiveau;
    })
    .sort((a, b) => {
      if (triPrix === "asc") return Number(a.prix) - Number(b.prix);
      if (triPrix === "desc") return Number(b.prix) - Number(a.prix);
      return 0;
    });

  function resetFilters() {
    setRecherche("");
    setNiveauChoisi("all");
    setTriPrix("default");
  }

  useEffect(() => {
    fetch("http://localhost:3001/prestations")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPrestations(data);
        } else {
          console.error("Réponse inattendue :", data);
        }
      })
      .catch((error) =>
        console.error("Erreur récupération prestations :", error),
      );
  }, []);

  // Remet le carousel au début quand les filtres changent
  useEffect(() => {
    setCurrentIndex(0);
  }, [recherche, niveauChoisi, triPrix]);

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < prestationsFiltrees.length - 1;

  return (
    <div className="prestations-section">
      <div className="prestation-filters">
        <input
          className="prestation-search"
          type="text"
          placeholder="Rechercher une prestation..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />

        <select
          className="prestation-select"
          value={niveauChoisi}
          onChange={(e) => setNiveauChoisi(e.target.value)}
        >
          <option value="all">Tous les niveaux</option>
          {niveaux.map((niveau) => (
            <option key={niveau} value={niveau}>
              {niveau}
            </option>
          ))}
        </select>

        <select
          className="prestation-select"
          value={triPrix}
          onChange={(e) => setTriPrix(e.target.value)}
        >
          <option value="default">Prix par défaut</option>
          <option value="asc">Prix croissant</option>
          <option value="desc">Prix décroissant</option>
        </select>
        <button className="prestation-reset" onClick={resetFilters}>
          Réinitialiser
        </button>
      </div>

      {prestationsFiltrees.length === 0 ? (
        <p className="prestation-no-result">Aucune prestation trouvée.</p>
      ) : (
        <div className="carousel-wrapper">
          <button
            className="carousel-arrow"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={!canPrev}
            aria-label="Précédent"
          >
            &#8592;
          </button>

          <div className="carousel-viewport">
            <ul
              className="prestations-list"
              style={{
                transform: `translateX(-${currentIndex * CARD_WIDTH}px)`,
              }}
            >
              {prestationsFiltrees.map((prestation) => (
                <PrestationItem key={prestation.id} prestation={prestation} />
              ))}
            </ul>
          </div>

          <button
            className="carousel-arrow"
            onClick={() =>
              setCurrentIndex((i) =>
                Math.min(prestationsFiltrees.length - 1, i + 1),
              )
            }
            disabled={!canNext}
            aria-label="Suivant"
          >
            &#8594;
          </button>
        </div>
      )}
    </div>
  );
}

export default PrestationsList;
