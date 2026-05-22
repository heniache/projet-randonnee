import Cart from "../components/Cart";
import ShoppingList from "../components/shoppingList";
import "../styles/Home.css";

function Home({ cart, updateCart }) {
  return (
    <div className="home-wrapper">
      <div className="container">
        <div className="shopping-list">
          <ShoppingList cart={cart} updateCart={updateCart} />
        </div>
      </div>
    </div>
  );
}

export default Home;
