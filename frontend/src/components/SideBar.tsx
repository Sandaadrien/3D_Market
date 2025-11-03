"use client";
import React from "react";
import { Dispatch, SetStateAction } from "react";
import {
  Package,
  Search,
  ShoppingCart,
  Settings,
  Home as HomeIcon,
} from "lucide-react";
const SideBar = ({
  currentPage,
  onNavigate,
}: {
  currentPage: string;
  onNavigate: Dispatch<SetStateAction<string>>;
}) => {
  const menuItems = [
    { icon: HomeIcon, page: "home", label: "Accueil" },
    { icon: ShoppingCart, page: "cart", label: "Panier", badge: true },
  ];
  return (
    <div className="w-20 h-screen bg-white border-r border-gray-300 flex flex-col items-center py-6 gap-6">
      {menuItems.map((item) => (
        <button
          key={item.page}
          onClick={() => onNavigate(item.page)}
          className={`relative p-4 rounded-lg transition-colors ${
            currentPage === item.page ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <item.icon size={24} />
          {item.badge && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
      ))}
      <div className="mt-auto">
        <button
          onClick={() => onNavigate("profile")}
          className={`p-4 rounded-lg transition-colors ${
            currentPage === "profile" ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <Settings size={24} />
        </button>
      </div>
    </div>
  );
};
export default SideBar;
