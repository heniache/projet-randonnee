import { useState } from "react";
import "../styles/cart.css";

import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

function Cart({ cart, updateCart }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const selectedCart = cart.filter((item) => selectedItems.includes(item.id));

  const total = selectedCart.reduce(
    (sum, item) => sum + item.price * item.amount,
    0,
  );

  function toggleSelectedItem(id) {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  function toggleSelectAll() {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.id));
    }
  }

  function increaseQuantity(id) {
    updateCart(
      cart.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item,
      ),
    );
  }

  function decreaseQuantity(id) {
    updateCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item,
        )
        .filter((item) => item.amount > 0),
    );
  }

  function removeItem(id) {
    updateCart(cart.filter((item) => item.id !== id));
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
  }

  function clearCart() {
    updateCart([]);
    setSelectedItems([]);
  }

  return (
    <div className="cart-page">
      <h2 className="cart-title">Votre panier</h2>

      {cart.length === 0 ? (
        <p className="empty-cart">Votre panier est vide.</p>
      ) : (
        <>
          <div className="select-all-line">
            <Checkbox
              checked={selectedItems.length === cart.length && cart.length > 0}
              onChange={toggleSelectAll}
              className="cart-checkbox"
              disableRipple
            />
            <span>Sélectionner tous les articles</span>
          </div>

          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-checkbox-zone">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelectedItem(item.id)}
                    className="cart-checkbox"
                    disableRipple
                  />
                </div>

                <img
                  className="cart-item-image"
                  src={item.cover}
                  alt={item.name}
                />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>

                  <p>Taille : {item.size}</p>
                  <p>Prix : {item.price}€</p>
                  <p>Sous-total : {item.price * item.amount}€</p>

                  <div className="cart-actions">
                    <div className="quantity-actions">
                      <IconButton
                        aria-label="supprimer l'article"
                        onClick={() => removeItem(item.id)}
                        size="small"
                        disableRipple
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        aria-label="diminuer la quantité"
                        onClick={() => decreaseQuantity(item.id)}
                        size="small"
                        disableRipple
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>

                      <span className="quantity">{item.amount}</span>

                      <IconButton
                        aria-label="augmenter la quantité"
                        onClick={() => increaseQuantity(item.id)}
                        size="small"
                        disableRipple
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div>
              <h3>Total sélectionné : {total}€</h3>
              <p>{selectedItems.length} article(s) sélectionné(s)</p>
            </div>

            <button className="clear-cart" onClick={clearCart}>
              Vider le panier
            </button>

            <button
              className="order-button"
              disabled={selectedItems.length === 0}
            >
              Commander les articles sélectionnés
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
