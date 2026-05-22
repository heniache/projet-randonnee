import "../styles/cart.css";

function Cart({ cart, updateCart }) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].amount * cart[i].price;
  }
  return (
    <div className="cart">
      <h2>Panier</h2>
      <ul>
        {cart.map(({ name, price, amount }, index) => (
          <div>
            - {name} {price}€ x {amount}
          </div>
        ))}
      </ul>
      <div className="total">Total : {total}€</div>
      <br />
      <button className="clear-cart" onClick={() => updateCart([])}>
        Vider le panier
      </button>
    </div>
  );
}
export default Cart;
