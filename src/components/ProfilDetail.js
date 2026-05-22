import { useHistory } from "react-router-dom";
function ProfileDetail() {
  // vous pouvez récupérer l'ID de l'utilisateur à partir du stockage local;
  const userId = localStorage.getItem("userId");
  const navigate = useHistory();
  const handleLogout = () => {
    // Supprimer le token JWT du stockage local lors de la déconnexion
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    // Redirige l'utilisateur vers la page de connexion après la déconnexion
    navigate.push("/login");
  };
  return (
    <div>
      <h2>Profil Utilisateur</h2>
      <p>ID de l'utilisateur : {userId}</p>
      {/* Affichez d'autres informations de profil ici */}
      <button onClick={handleLogout}>Déconnexion</button>
    </div>
  );
}
export default ProfileDetail;
