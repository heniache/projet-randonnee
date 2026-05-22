import { useState } from "react";
import mountain from "../assets/mountain.png";
import { Link } from "react-router-dom";
import Cart from "./Cart";
import "../styles/header.css";

function Header({ cart, updateCart }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="header-container">
      <div className="header-left">
        <h1>mont</h1>
        <img src={mountain} alt="A la mode" className="mountain" />
      </div>

      <nav className="header-right">
        <Link to="/">Accueil</Link>
        <Link to="/preferences">Préférences</Link>
        <Link to="/login">Connexion</Link>

        <button
          className="cart-header-button"
          onClick={() => setIsCartOpen(!isCartOpen)}
        >
          Panier
        </button>
      </nav>

      {isCartOpen && (
        <div className="cart-dropdown">
          <Cart cart={cart} updateCart={updateCart} />
        </div>
      )}
    </div>
  );
}

export default Header;
