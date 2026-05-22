import { useState, useEffect } from "react";
import "../styles/ShoppingList.css";
import Item from "./Item";

function ShoppingList({ cart, updateCart }) {
  function addToCart(name, price) {
    // Vérifier si l'article existe déjà dans le panier
    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
      // Si l'article existe, mettre à jour sa quantité
      updateCart(
        cart.map((item) =>
          item.name === name ? { ...item, amount: item.amount + 1 } : item,
        ),
      );
    } else {
      // Si l'article n'existe pas encore, l'ajouter au panier
      updateCart([...cart, { name, price, amount: 1 }]);
    }
  }

  const [itemsList, setItemsList] = useState([]);
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
          <li className="item">
            {/*item.name*/}
            {/*item.price*/}
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
