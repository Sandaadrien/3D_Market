"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { ProductsType } from "@/types/utilities";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  updateProfile,
  getLastProduct,
  getLovedProduct,
  toggleFavorite,
} from "@/services/profile";
import { BarLoader } from "react-spinners";

const ProfilePage = () => {
  const router = useRouter();
  // États pour les informations de profil
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // États temporaires pour l'édition
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPassword, setTempPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [activeTab, setActiveTab] = useState("informations");
  const [lastProducts, setLastProducts] = useState<ProductsType[]>([]);
  const [lovedProducts, setLovedProducts] = useState<ProductsType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) return router.push("/login");

      const user = JSON.parse(storedUser);
      try {
        setEmail(user.email);
      } catch (error) {
        console.log(error);
        router.push("/login");
      }
    };
    const fetchProducts = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) return router.push("/login");

      const user = JSON.parse(storedUser);

      try {
        const [lastRes, lovedRes] = await Promise.all([
          getLastProduct(user.id),
          getLovedProduct(user.id),
        ]);

        setLastProducts(lastRes.produitDTOs || []);
        setLovedProducts(lovedRes.produitDTOs || []);
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors du chargement des produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchProducts();
  }, [router]);

  const toggleFavoriteHere = async (id: number) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return toast.error("Utilisateur non connecté");

    const user = JSON.parse(storedUser);
    try {
      const result = await toggleFavorite(user.id, id);
      setLovedProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isFavorite: result.isFavorite } : p
        )
      );
      setLastProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isFavorite: result.isFavorite } : p
        )
      );
      toast.success(result.message);
    } catch (error) {
      toast.error("Erreur lors du changement de favori");
      console.error(error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempEmail(email);
    setTempPassword("");
    setConfirmPassword("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempEmail(email);
    setTempPassword("");
    setConfirmPassword("");
  };

  const handleSave = async () => {
    // Validation
    if (!tempEmail || !tempEmail.includes("@")) {
      toast.error("Veuillez entrer une adresse email valide");
      return;
    }

    if (tempPassword && tempPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (tempPassword && tempPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("Utilisateur non connecté");
      return;
    }

    // Sauvegarder les modifications
    const user = JSON.parse(storedUser);
    try {
      const response = await updateProfile({
        userId: user.id,
        email: tempEmail,
        password: tempPassword || undefined,
      });
      setEmail(response.user.email);
      localStorage.setItem("user", JSON.stringify(response.user));

      setIsEditing(false);
      toast.success(response.message || "Profil mis à jour avec succès !");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Erreur lors de la mise à jour du profil");
      } else {
        toast.error("Erreur inconnue lors de la mise à jour du profil");
      }
    }
    setIsEditing(false);
  };

  // Extraire les initiales pour l'avatar
  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="flex-1 bg-white p-5">
      <div className="h-screen">
        <div className="flex items-center gap-6 py-10 px-5">
          <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-6xl font-bold">
            {getInitials(email)}
          </div>
          <p className="text-xl">{email}</p>
        </div>

        <div className="flex gap-8 border-b">
          {["informations", "last products", "loved"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-4 capitalize ${
                activeTab === tab
                  ? "border-b-2 border-gray-800 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "informations" && (
          <div className="space-y-6 max-w-md p-5">
            <div>
              <label className="block text-sm mb-2 font-medium">Email</label>
              <input
                type="email"
                value={isEditing ? tempEmail : email}
                onChange={(e) => setTempEmail(e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg ${
                  isEditing
                    ? "bg-white border-2 border-gray-300"
                    : "bg-gray-200"
                }`}
              />
            </div>

            {isEditing && (
              <>
                <div>
                  <label className="block text-sm mb-2 font-medium">
                    Nouveau mot de passe (optionnel)
                  </label>
                  <input
                    type="password"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    placeholder="Laisser vide pour ne pas changer"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg"
                  />
                </div>

                {tempPassword && (
                  <div>
                    <label className="block text-sm mb-2 font-medium">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmer le nouveau mot de passe"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg"
                    />
                  </div>
                )}
              </>
            )}

            {!isEditing && (
              <div>
                <label className="block text-sm mb-2 font-medium">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value="******************"
                  disabled
                  className="w-full px-4 py-3 bg-gray-200 rounded-lg"
                />
              </div>
            )}

            {isEditing ? (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-500 text-white rounded-lg py-3 font-semibold hover:bg-green-600"
                >
                  Sauvegarder
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-400 text-white rounded-lg py-3 font-semibold hover:bg-gray-500"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                onClick={handleEdit}
                className="w-full bg-red-400 text-white rounded-lg py-3 font-semibold hover:bg-red-500"
              >
                Modifier
              </button>
            )}
          </div>
        )}

        {activeTab === "last products" && (
          <div className="h-[70%] overflow-y-scroll grid grid-cols-[repeat(auto-fill,minmax(300px,auto))] gap-4 py-10">
            {loading ? (
              <BarLoader />
            ) : (
              lastProducts.map((product) => (
                <div className="h-min" key={product.id}>
                  <ProductCard
                    product={product}
                    onToggleFavorite={toggleFavoriteHere}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "loved" && (
          <div className="h-[70%] overflow-y-scroll grid grid-cols-[repeat(auto-fill,minmax(300px,auto))] gap-4 py-10">
            {loading ? (
              <BarLoader />
            ) : (
              lovedProducts
                .filter((product) => product.isFavorite)
                .map((product) => (
                  <div className="h-min" key={product.id}>
                    <ProductCard
                      product={product}
                      onToggleFavorite={toggleFavoriteHere}
                    />
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
