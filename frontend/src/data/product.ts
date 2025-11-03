import { ProductsType } from "@/types/utilities";

export const products: ProductsType[] = [
  {
    id: 1,
    name: "Chaise moderne",
    model: "/models/chair.gltf",
    price: 120,
    isFavorite: true,
    category: "Mobilier",
    description:
      "Une chaise moderne et confortable, idéale pour un intérieur design ou un espace de travail élégant.",
  },
  {
    id: 2,
    name: "Table en bois",
    model: "/models/table.gltf",
    price: 250,
    isFavorite: true,
    category: "Mobilier",
    description:
      "Une table en bois au style naturel et intemporel, parfaite pour vos repas en famille ou entre amis.",
  },
  {
    id: 3,
    name: "Ordinateur portable",
    model: "/models/computer.gltf",
    price: 1500,
    isFavorite: true,
    category: "Électronique",
    description:
      "Un ordinateur portable performant et élégant, idéal pour le travail, les études ou le divertissement.",
  },
  {
    id: 4,
    name: "Tasse design",
    model: "/models/mug.gltf",
    price: 35,
    isFavorite: true,
    category: "Accessoires",
    description:
      "Une tasse moderne au design raffiné, parfaite pour déguster votre café ou votre thé avec style.",
  },
  {
    id: 40,
    name: "Étagère en bois",
    model: "/models/bookshelf.gltf",
    price: 300,
    isFavorite: true,
    category: "Mobilier",
    description:
      "Une étagère en bois élégante et pratique, idéale pour exposer vos livres ou objets décoratifs.",
  },
  {
    id: 44,
    name: "Smartphone dernier cri",
    model: "/models/phone.gltf",
    price: 999,
    isFavorite: true,
    category: "Électronique",
    description:
      "Un smartphone moderne doté des dernières technologies, alliant puissance, design et performance.",
  },
];
