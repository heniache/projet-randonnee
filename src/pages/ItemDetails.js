import "../styles/ItemDetails.css";
import { useParams, useHistory } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { PreferencesContext } from "../context";

// Ce composant affiche le détail d'un vêtement.
// Il permet aussi de modifier ses informations et de télécharger une nouvelle image.
function ItemDetails() {
  const { idArticle } = useParams();
  const { darkMode } = useContext(PreferencesContext);
  const navigate = useHistory();

  const [itemDetail, setItemDetail] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [updatedItem, setUpdatedItem] = useState({
    name: "",
    cover: "",
    price: 0,
    comfort: 0,
    size: "",
  });

  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Cette fonction récupère l'image choisie par l'utilisateur dans l'input file.
  // Elle stocke ensuite cette image dans le state "image".
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Ce useEffect vérifie au chargement du composant si un utilisateur est connecté.
  // Il regarde si un token existe dans le localStorage, puis récupère le userId.
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const userId = localStorage.getItem("userId");
      setUserId(userId);
      // On lit aussi le rôle stocké à la connexion
      setRole(localStorage.getItem("role"));
    }
  }, []);

  // Cette fonction envoie l'image sélectionnée vers le backend.
  // Si l'upload réussit, elle récupère l'URL de l'image et met à jour le vêtement avec cette nouvelle image.
  // Cette fonction envoie l'image sélectionnée vers le backend.
  // La route /upload met déjà à jour le cover en base : on rafraîchit juste l'affichage.
  const handleImageUpload = () => {
    if (!image) {
      setUploadError("Veuillez sélectionner une image.");
      return;
    }

    setUploadError(null);
    setUploadSuccess(false);

    const formData = new FormData();
    const token = localStorage.getItem("token");

    formData.append("image", image);
    formData.append("vetementId", idArticle);

    fetch("http://localhost:3001/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || "Erreur lors de l'upload.");
          });
        }
        return response.json();
      })
      .then((data) => {
        setItemDetail((prev) => ({ ...prev, cover: data.imageUrl }));
        setUpdatedItem((prev) => ({ ...prev, cover: data.imageUrl }));
        setImage(null);
        setUploadSuccess(true);
      })
      .catch((error) => {
        console.error("Erreur téléchargement image :", error);
        setUploadError(error.message);
      });
  };

  // Ce useEffect récupère les détails du vêtement depuis le backend.
  // Il se lance au chargement de la page et à chaque fois que idArticle change.
  useEffect(() => {
    fetch(`http://localhost:3001/${idArticle}`)
      .then((response) => response.json())
      .then((data) => {
        setItemDetail(data);
        setUpdatedItem(data);
      })
      .catch((error) => {
        console.error("Erreur récupération du détail vêtement:", error);
      });
  }, [idArticle]);

  // Cette fonction met à jour le state updatedItem quand l'utilisateur modifie un champ du formulaire.
  // Elle utilise le name de l'input pour savoir quelle propriété modifier.
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUpdatedItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  // Cette fonction envoie les nouvelles informations du vêtement au backend avec une requête PUT.
  // Après la mise à jour, elle actualise l'affichage et quitte le mode modification.
  const handleUpdateVetement = (itemToUpdate = updatedItem) => {
    // On envoie le token : la route /items/:id est réservée aux admins
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3001/items/${idArticle}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(itemToUpdate),
    })
      .then((response) => response.json())
      .then(() => {
        // La route renvoie un message, pas l'article : on garde nos valeurs locales
        setItemDetail(itemToUpdate);
        setUpdatedItem(itemToUpdate);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la requête PUT :", error);
      });
  };

  // Cette fonction supprime l'article courant (réservé aux admins).
  // Après confirmation, elle envoie la requête DELETE puis renvoie à l'accueil.
  const handleDeleteVetement = () => {
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.",
    );
    if (!confirmation) {
      return;
    }

    const token = localStorage.getItem("token");

    fetch(`http://localhost:3001/items/${idArticle}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Article supprimé.");
          navigate.push("/"); // retour à la liste des articles
        } else {
          alert("Erreur lors de la suppression de l'article.");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la requête DELETE :", error);
      });
  };

  return (
    <div className={`itemDetails-page ${darkMode ? "dark-mode" : ""}`}>
      <h1 className="detail-heading">Détail de mon vêtement</h1>

      {!isEditing ? (
        <div className="item-details-content">
          <h2 className="article-id">id Article {idArticle}</h2>
          <h2 className="detail-name">{itemDetail.name}</h2>

          {itemDetail.cover && (
            <img
              className="detail-image"
              src={itemDetail.cover}
              alt={`${itemDetail.name} cover`}
            />
          )}

          <p className="detail-meta">Prix : {itemDetail.price} euros</p>
          <p className="detail-meta">Confort : {itemDetail.comfort}</p>
          <p className="detail-meta">Taille : {itemDetail.size}</p>

          {/* Les boutons de gestion ne s'affichent que pour les admins */}
          {role === "admin" && (
            <div className="detail-actions">
              <button className="button-Add" onClick={() => setIsEditing(true)}>
                Modifier
              </button>
              <button className="button-Add" onClick={handleDeleteVetement}>
                Supprimer
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="item-details-form">
          <label className="detail-label" htmlFor="name">
            Nom:
          </label>

          <input
            id="name"
            className="detail-input"
            type="text"
            name="name"
            value={updatedItem.name}
            onChange={handleInputChange}
          />

          <label className="detail-label" htmlFor="price">
            Prix:
          </label>

          <input
            id="price"
            className="detail-input"
            type="text"
            name="price"
            value={updatedItem.price}
            onChange={handleInputChange}
          />

          <div className="detail-actions">
            <button
              className="button-Add"
              type="button"
              onClick={() => handleUpdateVetement()}
            >
              Enregistrer
            </button>

            <button
              className="button-Add"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Annuler
            </button>

            <input type="file" accept="image/*" onChange={handleImageChange} />

            <button
              className="button-Add"
              type="button"
              onClick={handleImageUpload}
            >
              Télécharger
            </button>

            {uploadError && (
              <p style={{ color: "red", marginTop: "8px" }}>{uploadError}</p>
            )}
            {uploadSuccess && (
              <p style={{ color: "green", marginTop: "8px" }}>
                Image mise à jour avec succès.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemDetails;
