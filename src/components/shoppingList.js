import { useState, useEffect, useContext } from "react";
import "../styles/ShoppingList.css";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import Item from "./Item";
import FavoritBouton from "./FavoritBouton";
import { PreferencesContext } from "../context";

// Ce composant affiche la liste des vêtements.
// Il reçoit le panier actuel "cart" et la fonction "updateCart" depuis le composant parent.
const ITEMS_PER_PAGE = 6;

function ShoppingList({ cart, updateCart }) {
  const { darkMode } = useContext(PreferencesContext);
  // Cette fonction ajoute un article dans le panier.
  // Si l'article existe déjà, elle augmente seulement sa quantité.
  // Sinon, elle ajoute un nouvel article avec une quantité de 1.
  function addToCart(article) {
    const existingItem = cart.find((item) => item.id === article.id);

    if (existingItem) {
      updateCart(
        cart.map((item) =>
          item.id === article.id ? { ...item, amount: item.amount + 1 } : item,
        ),
      );
    } else {
      updateCart([
        ...cart,
        {
          id: article.id,
          name: article.name,
          price: article.price,
          cover: article.cover,
          size: article.size,
          amount: 1,
        },
      ]);
    }
  }

  const [itemsList, setItemsList] = useState([]);
  const [search, setSearch] = useState("");

  const [saleFilter, setSaleFilter] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [priceOrder, setPriceOrder] = useState("default");
  const [page, setPage] = useState(1);

  // Ce useEffect récupère la liste des vêtements depuis le backend.
  // Il s'exécute une seule fois au chargement du composant grâce au tableau vide [].
  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((response) => response.json())
      .then((data) => {
        setItemsList(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des vêtements:", error);
      });
  }, []);

  const sizes = [
    ...new Set(itemsList.map((item) => item.size).filter(Boolean)),
  ];

  const filteredItems = itemsList
    .filter((item) => {
      const matchSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchSales =
        saleFilter === "all" ||
        (saleFilter === "sales" && item.onSale === 1) ||
        (saleFilter === "not-sales" && item.onSale !== 1);

      const matchSize = selectedSize === "all" || item.size === selectedSize;

      return matchSearch && matchSales && matchSize;
    })
    .sort((a, b) => {
      if (priceOrder === "asc") {
        return Number(a.price) - Number(b.price);
      }

      if (priceOrder === "desc") {
        return Number(b.price) - Number(a.price);
      }

      return 0;
    });
  function resetFilters() {
    setSearch("");
    setSaleFilter("all");
    setSelectedSize("all");
    setPriceOrder("default");
    setPage(1);
  }

  useEffect(() => {
    setPage(1);
  }, [search, saleFilter, selectedSize, priceOrder]);

  const pageCount = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div>
      <div className="search-bar-wrapper">
        <div className="search-box">
          <SearchIcon className="search-icon" />

          <input
            className="search-input"
            type="text"
            placeholder="Rechercher un article..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-container">
          <select
            className="filter-select"
            value={saleFilter}
            onChange={(e) => setSaleFilter(e.target.value)}
          >
            <option value="all">Tous les articles</option>
            <option value="sales">Articles en soldes</option>
            <option value="not-sales">Articles non soldés</option>
          </select>

          <select
            className="filter-select"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="all">Toutes les tailles</option>

            {sizes.map((size) => (
              <option key={size} value={size}>
                Taille {size}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={priceOrder}
            onChange={(e) => setPriceOrder(e.target.value)}
          >
            <option value="default">Prix par défaut</option>
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
          </select>
          <button className="reset-button" onClick={resetFilters}>
            Réinitialiser
          </button>
        </div>

      {filteredItems.length === 0 ? (
        <p className="no-result">Aucun article trouvé.</p>
      ) : (
        <>
          <ul className="item-list">
            {paginatedItems.map((item) => (
              <li className="item" key={item.id}>
                {item.onSale === 1 && <div className="sales">Soldes</div>}

                <div className="item-favorite-btn">
                  <FavoritBouton type="item" itemId={item.id} />
                </div>

                <Item
                  id={item.id}
                  cover={item.cover}
                  name={item.name}
                  size={item.size}
                  comfort={item.comfort}
                  price={item.price}
                />

                <button className="button-Add" onClick={() => addToCart(item)}>
                  Ajouter
                </button>
              </li>
            ))}
          </ul>

          <div className="pagination-container">
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              sx={
                darkMode
                  ? {
                      "& .MuiPaginationItem-root": {
                        color: "#f2f5f8",
                        borderColor: "#5c6b7b",
                      },
                      "& .MuiPaginationItem-root.Mui-selected": {
                        backgroundColor: "cadetblue",
                        color: "#fff",
                        borderColor: "cadetblue",
                      },
                      "& .MuiPaginationItem-root:hover": {
                        backgroundColor: "rgba(95,158,160,0.2)",
                      },
                    }
                  : {
                      "& .MuiPaginationItem-root.Mui-selected": {
                        backgroundColor: "cadetblue",
                        color: "#fff",
                      },
                      "& .MuiPaginationItem-root.Mui-selected:hover": {
                        backgroundColor: "#4a8fa8",
                      },
                    }
              }
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ShoppingList;
