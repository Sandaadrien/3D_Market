import React from "react";
import { ProductsType } from "@/types/utilities";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { Heart } from "lucide-react";
import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { ModelProps } from "@/types/utilities";

export function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url);
  const clone = useMemo(() => scene.clone(), [scene]);
  return <primitive object={clone} scale={1.2} />;
}

const ProductCard = ({
  product,
  onToggleFavorite,
}: {
  product: ProductsType;
  onToggleFavorite: (id: number) => void;
}) => {
  return (
    <div className="flex flex-col items-center">
      <div>
        <div className="w-min h-90 bg-gray-300 relative rounded-2xl">
          <Canvas camera={{ position: [2, 2, 2] }} className="rounded-2xl">
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} />
            <Suspense
              fallback={
                <Html center>
                  <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </Html>
              }
            >
              <Model url={product.model} />
            </Suspense>
            <OrbitControls enableZoom={false} autoRotate />
          </Canvas>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
            className="absolute bottom-3 right-3 w-10 h-10 bg-white cursor-pointer rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <Heart
              size={20}
              className={
                product.isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600"
              }
            />
          </button>
        </div>
        <div className="w-full">
          <div className="flex justify-between items-center py-5">
            <p className="font-bold">{product.name}</p>
            <p className="text-sm">Ar {product.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
