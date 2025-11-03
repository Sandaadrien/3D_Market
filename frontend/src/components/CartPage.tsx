"use client";
import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { ProductsType } from "@/types/utilities";
import { X, Minus, Plus } from "lucide-react";

function ModelPreview({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const clone = useMemo(() => scene.clone(), [scene]);

  return <primitive object={clone} scale={1.5} />;
}

// ---------- CartPage ----------
const CartPage = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onToggleSelect,
}: {
  cartItems: (ProductsType & { quantity: number; selected: boolean })[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onToggleSelect: (id: number) => void;
}) => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.selected ? item.price * item.quantity : 0),
    0
  );
  const delivery = 20000;
  const total = subtotal + (subtotal > 0 ? delivery : 0);

  return (
    <div className="flex-1 bg-gray-50 flex flex-col lg:flex-row gap-6 overflow-y-auto">
      {/* --- Liste des articles --- */}
      <div className="flex-1 space-y-4 p-5">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">
            🛒 Votre panier est vide
          </p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg p-6 relative shadow-sm"
            >
              {/* Bouton suppression */}
              <button
                onClick={() => onRemoveItem(item.id)}
                className="absolute top-4 right-4 hover:text-red-500"
              >
                <X size={24} />
              </button>

              <div className="flex gap-6 items-center">
                {/* Checkbox sélection */}
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => onToggleSelect(item.id)}
                  className="w-5 h-5"
                />

                {/* Mini modèle 3D */}
                <div className="w-32 h-32 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  <Canvas camera={{ position: [2, 2, 2] }}>
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[5, 5, 5]} />
                    <Suspense fallback={null}>
                      <ModelPreview url={item.model} />
                    </Suspense>
                    <OrbitControls
                      enableZoom={false}
                      autoRotate
                      autoRotateSpeed={2}
                    />
                  </Canvas>
                </div>

                {/* Infos produit */}
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Ar {item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Contrôle quantité */}
                  <div className="flex items-center gap-4 bg-gray-100 rounded px-4 py-2">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className={`hover:text-indigo-600 ${
                        item.quantity <= 1
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="font-semibold min-w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="hover:text-indigo-600"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- Résumé de commande --- */}
      <div className="w-96 bg-white rounded-lg p-8 h-fit sticky top-10 shadow-md">
        <h2 className="text-2xl font-bold mb-8">Résumé de commande</h2>
        <div className="space-y-4 mb-8">
          <div className="flex justify-between">
            <span className="text-gray-600">Sous-total</span>
            <span className="font-semibold">
              Ar {subtotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Livraison</span>
            <span className="font-semibold">
              {subtotal > 0 ? `Ar ${delivery.toLocaleString()}` : "-"}
            </span>
          </div>
          <div className="flex justify-between pt-4 border-t">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg">
              Ar {total.toLocaleString()}
            </span>
          </div>
        </div>
        <button
          disabled={subtotal === 0}
          className={`w-full rounded-lg py-4 font-semibold transition ${
            subtotal === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default CartPage;
