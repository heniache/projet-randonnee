import backpack from "../assets/backpack.avif";
import hikingBoots from "../assets/hikingBoots.avif";
import trekPoles from "../assets/trekPoles.jpg";
import waterBottle from "../assets/waterBottle.jpg";

export const itemList = [
  {
    name: "Sac à dos 45L",
    category: "équipement",
    id: "1",
    onSale: true,
    size: "M",
    comfort: 3,
    cover: backpack,
    price: 89,
  },
  {
    name: "Chaussures de randonnée",
    category: "chaussures",
    id: "2",
    onSale: false,
    size: "42",
    comfort: 3,
    cover: hikingBoots,
    price: 120,
  },
  {
    name: "Bâtons de marche",
    category: "accessoires",
    id: "3",
    onSale: true,
    size: "Unique",
    comfort: 2,
    cover: trekPoles,
    price: 45,
  },
  {
    name: "Gourde isotherme 1L",
    category: "accessoires",
    id: "4",
    onSale: false,
    size: "1L",
    comfort: 2,
    cover: waterBottle,
    price: 25,
  },
];
