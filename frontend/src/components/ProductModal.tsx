import React from "react";
import { ProductsType } from "@/types/utilities";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { X, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

const ProductModal = ({
  product,
  onClose,
  onAddItem,
}: {
  product: ProductsType;
  onClose: () => void;
  onAddItem: (product: ProductsType, quantity: number) => void;
}) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);
  const [quantity, setQuantity] = useState(1);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-gray-950/70 bg-opacity-60 flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-min flex flex-col items-center justify-center gap-8 relative py-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
          >
            <X size={24} />
          </button>

          {/* Vue 3D */}
          <div className="bg-gray-200 h-[400px] w-[400px] rounded-4xl">
            {ready && (
              <Canvas camera={{ position: [3, 3, 3] }} className="rounded-4xl">
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} />
                <Model url={product.model} />
                <OrbitControls />
              </Canvas>
            )}
          </div>

          {/* Infos produit */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
              <p className="text-md text-gray-700 mb-2">
                Prix : <span className="font-semibold">Ar {product.price}</span>
              </p>
            </div>

            <p className="text-blue-600 mb-6 text-sm">
              {" "}
              Category: {product.category}
            </p>
            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="flex gap-4">
              <div className="flex items-center gap-4 bg-gray-100 shadow-sm rounded-lg p-5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="hover:text-indigo-600"
                >
                  <Minus size={20} />
                </button>
                <span className="font-semibold min-w-5 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="hover:text-indigo-600"
                >
                  <Plus size={20} />
                </button>
              </div>
              <button
                onClick={() => {
                  onAddItem(product, quantity);
                  onClose();
                }}
                className="flex-1 bg-black text-white rounded-lg py-3 font-semibold hover:bg-gray-800"
              >
                Add to Card
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
