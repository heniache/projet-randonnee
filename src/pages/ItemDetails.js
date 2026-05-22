import "../styles/ItemDetails.css";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { PreferencesContext } from "../context";
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
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const [userId, setUserId] = useState("");
  //gestion de l'authentification grâce au token
  useEffect(() => {
    // Vérifiez si un token est déjà stocké localement
    const token = localStorage.getItem("token");
    if (token) {
      // Si un token est présent, récupérer le userId connecté
      const userId = localStorage.getItem("userId");
      setUserId(userId);
    }
  }, []);
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

        // Sauvegarde l'image uploadée avec le reste des champs via le PUT.
        const itemWithNewImage = { ...updatedItem, cover: imageUrl };
        handleUpdateVetement(itemWithNewImage);
        setImage(null);
      })
      .catch((error) => {
        console.error("Erreur téléchargement image :", error);
      });
  };

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
  // Handle input changes for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  // Handle update action (stub, implement as needed)
  const handleUpdateVetement = (itemToUpdate = updatedItem) => {
    fetch(`http://localhost:3001/${idArticle}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemToUpdate),
    })
      .then((response) => response.json())
      .then((data) => {
        setItemDetail(data); // MAJ l'état avec lesnouvelles données
        setUpdatedItem(data);
        setIsEditing(false);
      })
      .catch((error) => console.error("Erreur lors de larequête PUT :", error));
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
