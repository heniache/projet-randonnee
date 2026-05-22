import "../styles/ItemDetails.css";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { PreferencesContext } from "../context";

// Ce composant affiche le détail d'un vêtement.
// Il permet aussi de modifier ses informations et de télécharger une nouvelle image.
function ItemDetails() {
  const { idArticle } = useParams();
  const { darkMode } = useContext(PreferencesContext);

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
    }
  }, []);

  // Cette fonction envoie l'image sélectionnée vers le backend.
  // Si l'upload réussit, elle récupère l'URL de l'image et met à jour le vêtement avec cette nouvelle image.
  const handleImageUpload = () => {
    if (!image) {
      console.error("Aucune image sélectionnée.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("vetementId", idArticle);

    fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const imageUrl = data.imageUrl;

        const itemWithNewImage = {
          ...updatedItem,
          cover: imageUrl,
        };

        handleUpdateVetement(itemWithNewImage);
        setImage(null);
      })
      .catch((error) => {
        console.error("Erreur téléchargement image :", error);
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
    fetch(`http://localhost:3001/${idArticle}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemToUpdate),
    })
      .then((response) => response.json())
      .then((data) => {
        setItemDetail(data);
        setUpdatedItem(data);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la requête PUT :", error);
      });
  };

  return (
    <div className={`itemDetails-page ${darkMode ? "dark-mode" : ""}`}>
      <h1 className="detail-heading">Détail de mon vêtement</h1>

      {!isEditing ? (
        <div className="item-details-content">
          <h2 className="article-id">id Article {idArticle}</h2>
          <h2 className="detail-name">{itemDetail.name}</h2>

          <img
            className="detail-image"
            src={itemDetail.cover}
            alt={`${itemDetail.name} cover`}
          />

          <p className="detail-meta">Prix : {itemDetail.price} euros</p>
          <p className="detail-meta">Confort : {itemDetail.comfort}</p>
          <p className="detail-meta">Taille : {itemDetail.size}</p>

          <button className="button-Add" onClick={() => setIsEditing(true)}>
            Modifier
          </button>
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
              onClick={handleUpdateVetement}
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

            <button
              className="button-Add"
              type="button"
              onClick={handleImageUpload}
            >
              Télécharger
            </button>

            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemDetails;
