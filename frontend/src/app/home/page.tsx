"use client";
import React, { useEffect, useState, useRef } from "react";
import SideBar from "@/components/SideBar";
import ListProduct from "@/components/ListProduct";
import ProfilePage from "@/components/ProfilePage";
import { ProductsType, CartItemType } from "@/types/utilities";
import CartPage from "@/components/CartPage";
import { useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";
import toast from "react-hot-toast";

const Home = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("cart");
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  // Flag pour éviter les toasts doublés
  const toastLock = useRef(false);

  // Redirection login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const onUpdateQuantity = (id: number, newQuantity: number) => {
    let showToast: string | null = null;

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (newQuantity < 1) {
          return { ...item, quantity: 1 };
        }

        if (newQuantity > item.stock) {
          showToast = "Stock maximum atteint !";
          return { ...item, quantity: item.stock };
        }

        return { ...item, quantity: newQuantity };
      })
    );

    // Affiche le toast après la mise à jour d'état
    if (showToast && !toastLock.current) {
      toastLock.current = true;
      toast.error(showToast);
      setTimeout(() => (toastLock.current = false), 200);
    }
  };

  const onAddItem = (product: ProductsType, quantity: number) => {
    let message: string | null = null;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);

      if (existing) {
        const newQuantity = Math.min(
          existing.quantity + quantity,
          product.stock
        );
        if (newQuantity === existing.quantity) {
          message = "Stock maximum atteint !";
          return prev;
        }
        message = `${product.name} ajouté(e) (+${quantity})`;
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: newQuantity } : i
        );
      } else {
        message = `${product.name} ajouté(e) au panier`;
        return [...prev, { ...product, quantity, selected: false }];
      }
    });

    if (message && !toastLock.current) {
      toastLock.current = true;
      toast.success(message);
      setTimeout(() => (toastLock.current = false), 200);
    }
  };

  const onRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Produit supprimé du panier");
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
      {currentPage === "profile" && <ProfilePage />}
    </div>
  );
};

export default Home;
