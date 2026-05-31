import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "../styles/Favoris.css";

function Favoris() {
  const history = useHistory();
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const utilisateurId = localStorage.getItem("userId");

    if (!token || !utilisateurId) {
      alert("Vous devez être connecté pour voir vos favoris.");
      history.push("/login");
      return;
    }

    fetch(`http://localhost:3001/favoris/utilisateur/${utilisateurId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFavoris(data);
        } else {
          console.error("Réponse inattendue :", data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur récupération favoris :", error);
        setLoading(false);
      });
  }, [history]);

  function supprimerFavori(favoriId) {
    if (!window.confirm("Voulez-vous vraiment supprimer ce favori ?")) return;

    const token = localStorage.getItem("token");

    fetch(`http://localhost:3001/favoris/${favoriId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Échec de la suppression");
        return res.json();
      })
      .then(() => {
        setFavoris(favoris.filter((f) => f.favori_id !== favoriId));
      })
      .catch((error) => console.error("Erreur suppression favori :", error));
  }

  if (loading) {
    return <p className="favoris-loading">Chargement des favoris...</p>;
  }

  const prestations = favoris.filter((f) => f.type === "prestation");
  const items = favoris.filter((f) => f.type === "item");

  return (
    <div className="favoris-page">
      <h1 className="favoris-heading">Mes favoris</h1>

      {favoris.length === 0 ? (
        <p className="no-favoris">Vous n'avez aucun favori pour le moment.</p>
      ) : (
        <>
          {prestations.length > 0 && (
            <section className="favoris-section">
              <h2 className="favoris-section-title">Prestations</h2>
              <div className="favoris-list">
                {prestations.map((favori) => (
                  <div className="favori-card" key={favori.favori_id}>
                    <img
                      className="favori-image"
                      src={favori.cover}
                      alt={favori.title}
                    />
                    <div className="favori-info">
                      <div className="favori-title-line">
                        <h2>{favori.title}</h2>
                        <FavoriteIcon className="favori-heart" />
                      </div>
                      <p className="favori-description">{favori.description}</p>
                      <p>Durée : {favori.duration}</p>
                      <p>Niveau : {favori.niveau}</p>
                      <p className="favori-price">Prix : {favori.price}€</p>
                      <div className="favori-actions">
                        <Link to={`/prestations/${favori.prestation_id}`}>
                          <button className="button-Add">Voir la prestation</button>
                        </Link>
                        <IconButton
                          aria-label="supprimer des favoris"
                          onClick={() => supprimerFavori(favori.favori_id)}
                          disableRipple
                        >
                          <DeleteIcon className="delete-favori-icon" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {items.length > 0 && (
            <section className="favoris-section">
              <h2 className="favoris-section-title">Articles</h2>
              <div className="favoris-list">
                {items.map((favori) => (
                  <div className="favori-card" key={favori.favori_id}>
                    <img
                      className="favori-image"
                      src={favori.item_cover}
                      alt={favori.item_name}
                    />
                    <div className="favori-info">
                      <div className="favori-title-line">
                        <h2>{favori.item_name}</h2>
                        <FavoriteIcon className="favori-heart" />
                      </div>
                      <p>Taille : {favori.item_size}</p>
                      <p>Confort : {favori.item_comfort}</p>
                      <p className="favori-price">Prix : {favori.item_price}€</p>
                      <div className="favori-actions">
                        <Link to={`/detail/${favori.item_id}`}>
                          <button className="button-Add">Voir l'article</button>
                        </Link>
                        <IconButton
                          aria-label="supprimer des favoris"
                          onClick={() => supprimerFavori(favori.favori_id)}
                          disableRipple
                        >
                          <DeleteIcon className="delete-favori-icon" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default Favoris;
