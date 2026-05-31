import mountain from "../assets/mountain.png";
import panier from "../assets/panier.png";
import { Link, useHistory, useLocation } from "react-router-dom";
import "../styles/header.css";

function Header({ cart = [] }) {
  const history = useHistory();
  const location = useLocation();
  const nombreArticles = cart.reduce((total, item) => total + item.amount, 0);

  // On relit le localStorage à chaque rendu pour rester à jour
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleAdminNavigate = (e) => {
    const route = e.target.value;
    if (route) {
      history.push(route);
      e.target.value = ""; // Reset après redirection
    }
  };

  return (
    <div className="header-container">
      <div className="header-left">
        <h1>mont</h1>
        <img src={mountain} alt="A la mode" className="mountain" />
      </div>

      <nav className="header-right">
        <Link to="/">Accueil</Link>
        <Link to="/prestations">Prestations</Link>
        <Link to="/preferences">Préférences</Link>

        {token && <Link to="/mes-reservations">Mes réservations</Link>}
        {token && <Link to="/favoris">Mes favoris</Link>}
        {role === "admin" && (
          <select
            className="admin-select"
            onChange={handleAdminNavigate}
            defaultValue=""
          >
            <option value="" disabled hidden>
              Menu Admin
            </option>
            <option value="/admin/items">Gestion Articles</option>
            <option value="/adminReservation">Gestion Réservations</option>
            <option value="/admin/prestations">Gestion Prestations</option>
          </select>
        )}

        {!token ? (
          <Link to="/login">Connexion</Link>
        ) : (
          <Link to="/profile" className="profile-link">
            Profile
          </Link>
        )}

        <Link to="/cart" className="cart-link">
          <img className="panier" src={panier} alt="panier" />
          {nombreArticles > 0 && (
            <span className="cart-badge">{nombreArticles}</span>
          )}
        </Link>
      </nav>
    </div>
  );
}

export default Header;
