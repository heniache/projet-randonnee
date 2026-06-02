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
import { PreferencesProvider, LoadingProvider, AuthProvider } from "./context";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { PreferencesContext } from "./context";
import LoadingOverlay from "./components/LoadingOverlay";
import Cart from "./components/Cart";
import Admin from "./pages/Admin";
import Prestations from "./pages/Prestations";
import PrestationDetails from "./pages/PrestationDetails";
import MesReservations from "./pages/mes-reservations";
import AdminReservations from "./pages/AdminReservations";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import AdminPrestations from "./pages/AdminPrestations";
import Favoris from "./pages/Favoris";
import MesAvis from "./pages/MesAvis";

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
            <Route exact path="/prestations">
              <Prestations />
            </Route>

            <PrivateRoute path="/mes-reservations">
              <MesReservations />
            </PrivateRoute>

            <PrivateRoute path="/favoris">
              <Favoris />
            </PrivateRoute>

            <PrivateRoute path="/mes-avis">
              <MesAvis />
            </PrivateRoute>

            <Route path="/prestations/:idPrestation">
              <PrestationDetails />
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

            <PrivateRoute path="/profile">
              <Profile />
            </PrivateRoute>

            <Route path="/cart">
              <Cart cart={cart} updateCart={updateCart} />
            </Route>
            <AdminRoute path="/admin/items">
              <Admin />
            </AdminRoute>
            <AdminRoute path="/adminReservation">
              <AdminReservations />
            </AdminRoute>
            <AdminRoute path="/admin/prestations">
              <AdminPrestations />
            </AdminRoute>
            <Route path="*">
              <Error />
            </Route>
          </Switch>
        </div>
        <Footer />
        <LoadingOverlay />
      </div>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LoadingProvider>
      <PreferencesProvider>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </PreferencesProvider>
    </LoadingProvider>
  </React.StrictMode>,
);
