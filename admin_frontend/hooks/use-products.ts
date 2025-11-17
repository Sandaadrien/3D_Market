"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  model?: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  modelFile?: File;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<Product[]>("/ProductCrud/list");

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch products");
      }
      setProducts(response.data || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch products";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(
    async (data: CreateProductInput) => {
      setError(null);

      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price.toString());
        formData.append("stock", data.stock.toString());
        formData.append("category", data.category);
        if (data.modelFile) {
          formData.append("modelFile", data.modelFile);
        }

        const token = localStorage.getItem("authToken");
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5134/api"
          }/ProductCrud/create-product`,
          {
            method: "POST",
            body: formData,
            headers,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create product");
        }

        const newProduct = await response.json();
        setProducts([...products, newProduct]);

        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create product";
        setError(message);
        return { success: false, error: message };
      }
    },
    [products]
  );

  const updateProduct = useCallback(
    async (id: string, data: Partial<Product>) => {
      setError(null);
      try {
        const formData = new FormData();
        formData.append("Id", id.toString()); // attention à la casse : Id avec majuscule
        if (data.name) formData.append("Name", data.name);
        if (data.description) formData.append("Description", data.description);
        if (data.price !== undefined)
          formData.append("Price", data.price.toString());
        if (data.stock !== undefined)
          formData.append("Stock", data.stock.toString());
        if (data.category) formData.append("Category", data.category);
        // Si tu veux gérer le fichier 3D
        if ((data as any).modelFile) {
          formData.append("ModelFile", (data as any).modelFile);
        }
        const token = localStorage.getItem("authToken");
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5134/api"
          }/ProductCrud/update-product`,
          {
            method: "POST",
            body: formData,
            headers,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update product");
        }

        // Mise à jour locale
        setProducts(products.map((p) => (p.id === id ? { ...p, ...data } : p)));

        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update product";
        setError(message);
        return { success: false, error: message };
      }
    },
    [products]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      setError(null);

      try {
        const response = await apiClient.post(`/ProductCrud/delete-product`, {
          id,
        });

        if (!response.success) {
          throw new Error(response.error || "Failed to delete product");
        }

        setProducts(products.filter((p) => p.id !== id));
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete product";
        setError(message);
        return { success: false, error: message };
      }
    },
    [products]
  );

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
