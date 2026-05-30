import mountain from "../assets/mountain.png";
import panier from "../assets/panier.png";
import { Link } from "react-router-dom";
import "../styles/header.css";

function Header({ cart = [] }) {
  const nombreArticles = cart.reduce((total, item) => total + item.amount, 0);
  const role = localStorage.getItem("role");
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
        {role === "admin" && <Link to="/admin/items">Gestion</Link>}
        <Link to="/login">Connexion</Link>
        <Link to="/profile" className="profile-link">
          Profile
        </Link>
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
