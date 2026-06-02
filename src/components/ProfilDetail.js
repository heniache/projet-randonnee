import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Login.css";

function ProfileDetail() {
  const userId = localStorage.getItem("userId");
  const navigate = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setFormData] = useState({});
  const [user, setUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:3001/utilisateur/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          setFormData(data);
        })
        .catch((error) =>
          console.error("Erreur lors de la récupération des données :", error)
        );
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/utilisateur/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editFormData),
        }
      );

      if (response.ok) {
        setUser(editFormData);
        setIsEditing(false);
        alert("Profil mis à jour avec succès !");
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate.push("/login");
  };

  const handleDeleteConfirm = async () => {
    if (deleteInput !== "SUPPRIMER") return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/utilisateur/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        alert("Votre compte a été supprimé.");
        navigate.push("/login");
      } else {
        alert("Erreur lors de la suppression du compte.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  if (!user) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>Profil Utilisateur</h2>
          <p className="profile-loading">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card profile-card">
        <h2>Profil Utilisateur</h2>

        <div className="profile-details">
          <div className="profile-row">
            <span className="profile-label">Nom</span>
            {isEditing ? (
              <input
                className="profile-input"
                name="nom"
                value={editFormData.nom}
                onChange={handleChange}
              />
            ) : (
              <span className="profile-value">{user.nom}</span>
            )}
          </div>

          <div className="profile-row">
            <span className="profile-label">Prénom</span>
            {isEditing ? (
              <input
                className="profile-input"
                name="prenom"
                value={editFormData.prenom}
                onChange={handleChange}
              />
            ) : (
              <span className="profile-value">{user.prenom}</span>
            )}
          </div>

          <div className="profile-row">
            <span className="profile-label">Email</span>
            {isEditing ? (
              <input
                className="profile-input"
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleChange}
              />
            ) : (
              <span className="profile-value">{user.email}</span>
            )}
          </div>

          <div className="profile-row">
            <span className="profile-label">Téléphone</span>
            {isEditing ? (
              <input
                className="profile-input"
                name="telephone"
                value={editFormData.telephone}
                onChange={handleChange}
              />
            ) : (
              <span className="profile-value">
                {user.telephone || "Non renseigné"}
              </span>
            )}
          </div>

          <div className="profile-row">
            <span className="profile-label">Adresse</span>
            {isEditing ? (
              <input
                className="profile-input"
                name="adresse"
                value={editFormData.adresse}
                onChange={handleChange}
              />
            ) : (
              <span className="profile-value">
                {user.adresse || "Non renseignée"}
              </span>
            )}
          </div>

          <div className="profile-row">
            <span className="profile-label">Rôle</span>
            <span className="profile-value">{user.role}</span>
          </div>
        </div>

        {isEditing ? (
          <div className="profile-actions">
            <button onClick={handleSave} className="main-button">
              Valider
            </button>
            <button
              onClick={() => {
                setFormData({
                  nom: user.nom || "",
                  prenom: user.prenom || "",
                  email: user.email || "",
                  telephone: user.telephone || "",
                  adresse: user.adresse || "",
                });
                setIsEditing(false);
              }}
              className="switch-button"
            >
              Annuler
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="main-button">
            Modifier
          </button>
        )}

        <button
          onClick={handleLogout}
          className="main-button profile-logout-button"
        >
          Déconnexion
        </button>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="main-button profile-delete-button"
          >
            Supprimer mon compte
          </button>
        ) : (
          <div className="delete-confirm-box">
            <h3 className="delete-confirm-title">Suppression du compte</h3>
            <p className="delete-confirm-warning">
              Cette action est <strong>irréversible</strong>. Les données suivantes seront définitivement supprimées :
            </p>
            <ul className="delete-confirm-list">
              <li>Votre profil et informations personnelles</li>
              <li>Toutes vos réservations</li>
              <li>Tous vos favoris</li>
              <li>Tous vos avis</li>
            </ul>
            <p className="delete-confirm-instruction">
              Tapez <strong>SUPPRIMER</strong> pour confirmer :
            </p>
            <input
              className="delete-confirm-input"
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="SUPPRIMER"
            />
            <div className="delete-confirm-actions">
              <button
                className="main-button profile-delete-button"
                onClick={handleDeleteConfirm}
                disabled={deleteInput !== "SUPPRIMER"}
              >
                Confirmer la suppression
              </button>
              <button
                className="switch-button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteInput("");
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileDetail;
