"use client";
import { useState, useMemo, ChangeEvent, useEffect, useRef } from "react";
import { ProductsType } from "@/types/utilities";
import ProductCard from "@/components/ProductCard";
import ProductModal from "./ProductModal";
import { Search, X, Filter } from "lucide-react";
import FilterModal from "./FilterModal";
import { API_URL } from "@/utils/api";
import { toggleFavorite } from "@/services/profile";
import toast from "react-hot-toast";

const ListProduct = ({
  onAddItem,
}: {
  onAddItem: (product: ProductsType, quantity: number) => void;
}) => {
  const [products, setProducts] = useState<ProductsType[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductsType | null>(
    null
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toastLock = useRef(false);

  // --- Récupération des produits ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        const res = await fetch(`${API_URL}/Home/get-products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!res.ok)
          throw new Error("Erreur lors de la récupération des produits");

        const data: ProductsType[] = await res.json();
        setProducts(data ?? []);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );

  // --- Toggle favoris ---
  const toggleFavoriteHere = async (id: number) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    let message: string | null = null;

    try {
      const result = await toggleFavorite(user.id, id);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isFavorite: result.isFavorite } : p
        )
      );

      message = result.isFavorite ? "Ajouté aux favoris" : "Retiré des favoris";
    } catch (error) {
      console.error("Erreur lors du changement de favori:", error);
      message = "Erreur lors de la mise à jour du favori";
    }

    if (message && !toastLock.current) {
      toastLock.current = true;
      if (message.includes("Retiré")) {
        toast.error(message);
      } else {
        toast.success(message);
      }
      setTimeout(() => (toastLock.current = false), 300);
    }
  };

  // --- Gestion recherche ---
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const clearSearch = () => setSearchTerm("");

  // --- Filtrage produits ---
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.category);
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategories]);

  // --- Ajout panier ---
  const handleAddToCart = (product: ProductsType, quantity: number) => {
    if (quantity > product.stock) return;
    onAddItem(product, quantity);
  };

  return (
    <div className="flex-1">
      {/* Barre de recherche */}
      <div className="flex items-center gap-2 pt-5 px-10 justify-start">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchTerm && (
            <X
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
              size={20}
            />
          )}
        </div>

        <button
          onClick={() => setShowFilterModal(true)}
          className="px-6 py-3 bg-white border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
        >
          <Filter size={20} />
          Filtrer
          {selectedCategories.length > 0 && (
            <span className="ml-2 bg-indigo-600 text-white rounded-full px-2 py-1 text-xs">
              {selectedCategories.length}
            </span>
          )}
        </button>
      </div>

      {/* Liste de produits */}
      <div className="h-[90%] overflow-y-scroll grid grid-cols-[repeat(auto-fill,minmax(300px,auto))] gap-4 py-10 px-10">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              className="h-min cursor-pointer"
              key={product.id}
              onClick={() => setSelectedProduct(product)}
            >
              <ProductCard
                product={product}
                onToggleFavorite={toggleFavoriteHere}
              />
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Aucun produit trouvé.
          </p>
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddItem={handleAddToCart}
        />
      )}

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        categories={categories}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
      />
    </div>
  );
};

export default ListProduct;
