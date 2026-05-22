import { useState, useEffect } from "react";
import "../styles/ShoppingList.css";
import Item from "./Item";

// Ce composant affiche la liste des vêtements.
// Il reçoit le panier actuel "cart" et la fonction "updateCart" depuis le composant parent.
function ShoppingList({ cart, updateCart }) {
  // Cette fonction ajoute un article dans le panier.
  // Si l'article existe déjà, elle augmente seulement sa quantité.
  // Sinon, elle ajoute un nouvel article avec une quantité de 1.
  function addToCart(name, price) {
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
      updateCart(
        cart.map((item) =>
          item.name === name ? { ...item, amount: item.amount + 1 } : item,
        ),
      );
    } else {
      updateCart([...cart, { name, price, amount: 1 }]);
    }
  }

  const [itemsList, setItemsList] = useState([]);

  // Ce useEffect récupère la liste des vêtements depuis le backend.
  // Il s'exécute une seule fois au chargement du composant grâce au tableau vide [].
  useEffect(() => {
    fetch(`http://localhost:3001/`)
      .then((response) => response.json())
      .then((data) => {
        setItemsList(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des vêtements:", error);
      });
  }, []);

  return (
    <div>
      <ul className="item-list">
        {itemsList.map((item) => (
          <li className="item" key={item.id}>
            <br />

            {item.onSale === 1 && <div className="sales">Soldes</div>}

            <br />

            <Item
              id={item.id}
              cover={item.cover}
              name={item.name}
              size={item.size}
              comfort={item.comfort}
              price={item.price}
            />

            <button
              className="button-Add"
              onClick={() => addToCart(item.name, item.price)}
            >
              Ajouter
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
