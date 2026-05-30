import React from "react";
import { useContext, useState } from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Detail from "./pages/Detail";
import Preferences from "./pages/Preferences";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { PreferencesProvider } from "./context";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { PreferencesContext } from "./context";
import Cart from "./components/Cart";
import Admin from "./pages/Admin";

function AppLayout() {
  const { darkMode } = useContext(PreferencesContext);
  const [cart, updateCart] = useState([]);

  return (
    <Router>
      <div className={`app-wrapper ${darkMode ? "dark-mode" : ""}`}>
        <Header cart={cart} />
        <div className="app-content">
          <Switch>
            <Route exact path="/">
              <Home cart={cart} updateCart={updateCart} />
            </Route>
            <Route path="/detail/:idArticle">
              <Detail />
            </Route>
            <Route path="/preferences">
              <Preferences />
            </Route>
            <Route path="/login">
              <Login />
            </Route>

            <Route path="/profile">
              <Profile />
            </Route>

            <Route path="/cart">
              <Cart cart={cart} updateCart={updateCart} />
            </Route>
            <Route path="/admin/items">
              <Admin />
            </Route>
            <Route path="*">
              <Error />
            </Route>
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PreferencesProvider>
      <AppLayout />
    </PreferencesProvider>
  </React.StrictMode>,
);
