import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";

function ProfileDetail() {
  // vous pouvez récupérer l'ID de l'utilisateur à partir du stockage local;
  const userId = localStorage.getItem("userId");
  const navigate = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setFormData] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:3001/utilisateur/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          setFormData(data);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données :", error);
        });
    }
  }, [userId]);

  // Gère la frappe dans les champs de texte
  const handleChange = (e) => {
    setFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/utilisateur/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        },
      );

      if (response.ok) {
        setUser(editFormData); // On met à jour l'affichage
        setIsEditing(false); // On quitte le mode édition
        alert("Profil mis à jour avec succès !");
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };
  const handleLogout = () => {
    // Supprimer le token JWT du stockage local lors de la déconnexion
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    // Redirige l'utilisateur vers la page de connexion après la déconnexion
    navigate.push("/login");
  };
  const handleDelete = async () => {
    // Demande de confirmation : la suppression est définitive
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
    );
    if (!confirmation) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/utilisateur/${userId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        // On vide le stockage local puisque le compte n'existe plus
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
          onClick={handleDelete}
          className="main-button profile-delete-button"
        >
          Supprimer mon compte
        </button>
        <button
          onClick={handleLogout}
          className="main-button profile-logout-button"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}
export default ProfileDetail;
