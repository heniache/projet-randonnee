import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function FavoritBouton({ type = "prestation", prestationId, itemId }) {
  const history = useHistory();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriId, setFavoriId] = useState(null);

  const targetId = type === "item" ? itemId : prestationId;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const utilisateurId = localStorage.getItem("userId");

    if (!utilisateurId || !token || !targetId) return;

    const idParam =
      type === "item" ? `itemId=${targetId}` : `prestationId=${targetId}`;

    fetch(
      `http://localhost:3001/favoris/check?utilisateurId=${utilisateurId}&${idParam}&type=${type}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
      .then((res) => res.json())
      .then((data) => {
        setIsFavorite(data.isFavorite);
        setFavoriId(data.favoriId);
      })
      .catch((err) => console.error("Erreur vérification favori :", err));
  }, [targetId, type]);

  function handleChange() {
    const token = localStorage.getItem("token");
    const utilisateurId = localStorage.getItem("userId");

    if (!token || !utilisateurId) {
      history.push("/login");
      return;
    }

    if (isFavorite) {
      fetch(`http://localhost:3001/favoris/${favoriId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(() => {
          setIsFavorite(false);
          setFavoriId(null);
        })
        .catch((err) => console.error("Erreur suppression favori :", err));
    } else {
      const body =
        type === "item"
          ? { utilisateur_id: utilisateurId, item_id: targetId, type: "item" }
          : { utilisateur_id: utilisateurId, prestation_id: targetId, type: "prestation" };

      fetch("http://localhost:3001/favoris", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((data) => {
          setIsFavorite(true);
          setFavoriId(data.id);
        })
        .catch((err) => console.error("Erreur ajout favori :", err));
    }
  }

  return (
    <Tooltip
      title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      arrow
      placement="top"
    >
      <Checkbox
        checked={isFavorite}
        onChange={handleChange}
        icon={<FavoriteBorderIcon />}
        checkedIcon={<FavoriteIcon />}
        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        sx={{
          padding: "6px",
          color: "#bdbdbd",
          "&.Mui-checked": { color: "#e53935" },
          "&:hover": { backgroundColor: "transparent", transform: "scale(1.2)" },
          transition: "transform 0.15s ease",
        }}
      />
    </Tooltip>
  );
}

export default FavoritBouton;
