"use client";
import React, { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import ListProduct from "@/components/ListProduct";
import ProfilePage from "@/components/ProfilePage";
import { ProductsType } from "@/types/utilities";
import CartPage from "@/components/CartPage";
import { useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";
import toast from "react-hot-toast";

const Home = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const [currentPage, setCurrentPage] = useState("cart");
  const [cartItems, setCartItems] = useState<
    (ProductsType & { quantity: number; selected: boolean })[]
  >([
    // {
    //   id: 1,
    //   name: "Chaise moderne",
    //   model: "/models/chair.gltf",
    //   price: 120000,
    //   isFavorite: true,
    //   category: "Mobilier",
    //   description:
    //     "Une chaise moderne et confortable, idéale pour un intérieur design.",
    //   quantity: 2,
    //   selected: false,
    // },
    // {
    //   id: 2,
    //   name: "Table en bois",
    //   model: "/models/table.gltf",
    //   price: 250000,
    //   isFavorite: true,
    //   category: "Mobilier",
    //   description:
    //     "Une table en bois au style naturel et intemporel, parfaite pour vos repas.",
    //   quantity: 1,
    //   selected: false,
    // },
  ]);

  const onUpdateQuantity = (id: number, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };
  const onAddItem = (product: ProductsType, quantity: number = 1) => {
    let message = "";
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        message = `${product.name} ajouté(e) (+${quantity})`;
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        message = `${product.name} ajouté(e) au panier`;
        return [...prev, { ...product, quantity: quantity, selected: false }];
      }
    });
    if (message) toast.success(message);
  };

  const onRemoveItem = (id: number) => {
    let removedItemName = "";
    setCartItems((prev) => {
      const removedItem = prev.find((item) => item.id === id);
      if (removedItem) {
        removedItemName = removedItem.name;
      }
      return prev.filter((item) => item.id !== id);
    });
    if (removedItemName) toast.error(`${removedItemName} retiré(e) du panier`);
  };

  const onToggleSelect = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };
  if (isLoading) {
    return (
      <div className="flex w-screen h-screen items-center justify-center">
        <BarLoader />
      </div>
    );
  }
  return (
    <div className="flex w-screen h-screen">
      <SideBar currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === "home" && <ListProduct onAddItem={onAddItem} />}
      {currentPage === "cart" && (
        <CartPage
          cartItems={cartItems}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          onToggleSelect={onToggleSelect}
        />
      )}
      {currentPage == "profile" && <ProfilePage />}
    </div>
  );
};

export default Home;
