"use client";

import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/use-products";
import { ProductForm } from "@/components/product-form";
import { ProductTable } from "@/components/product-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Product } from "@/hooks/use-products";

export default function ProductsPage() {
  const {
    products,
    loading,
    fetchProducts,
    createProduct,
    deleteProduct,
    updateProduct,
  } = useProducts();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null); // 👈 ajout

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreateOrUpdateProduct = async (data: any) => {
    if (editingProduct) {
      const result = await updateProduct(editingProduct.id, data);
      if (result.success) {
        setEditingProduct(null);
        setShowForm(false);
      }
    } else {
      const result = await createProduct(data);
      if (result.success) {
        setShowForm(false);
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product inventory
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(!showForm);
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={20} className="mr-2" />
          {showForm ? "Close" : "Add Product"}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <ProductForm
          onSubmit={handleCreateOrUpdateProduct}
          isLoading={loading}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          product={editingProduct || undefined}
        />
      )}

      {/* Products Table */}
      <ProductTable
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        isLoading={loading}
      />
    </div>
  );
}
