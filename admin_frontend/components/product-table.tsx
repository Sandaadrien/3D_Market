"use client";

import type { Product } from "@/hooks/use-products";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";

interface ProductTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onView?: (product: Product) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
  itemsPerPage?: number;
}

export function ProductTable({
  products,
  onEdit,
  onView,
  onDelete,
  isLoading,
  itemsPerPage = 5,
}: ProductTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Découper les produits selon la page actuelle
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return products.slice(start, start + itemsPerPage);
  }, [products, currentPage, itemsPerPage]);

  // --- Si aucun produit ---
  if (products.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          No products found. Create your first product to get started.
        </p>
      </Card>
    );
  }

  // --- Pagination handler ---
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-foreground">
                Name
              </th>
              <th className="text-left px-6 py-3 font-semibold text-foreground">
                Category
              </th>
              <th className="text-left px-6 py-3 font-semibold text-foreground">
                Price
              </th>
              <th className="text-left px-6 py-3 font-semibold text-foreground">
                Stock
              </th>
              <th className="text-left px-6 py-3 font-semibold text-foreground">
                3D Model
              </th>
              <th className="text-right px-6 py-3 font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentProducts.map((product) => (
              <tr
                key={product.id ?? product.name}
                className="hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {product.name}
                    </span>
                    <span className="text-sm text-muted-foreground truncate max-w-xs">
                      {product.description}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline">{product.category}</Badge>
                </td>
                <td className="px-6 py-4 font-semibold text-foreground">
                  {product.price} Ar
                </td>
                <td className="px-6 py-4">
                  <Badge
                    className={
                      product.stock > 0
                        ? "bg-accent/10 text-accent"
                        : "bg-destructive/10 text-destructive"
                    }
                  >
                    {product.stock} units
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {product.model ? (
                    <Badge variant="secondary">Available</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    {onView && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onView(product)}
                        disabled={isLoading}
                        title="View details"
                      >
                        <Eye size={16} />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(product)}
                        disabled={isLoading}
                        title="Edit product"
                      >
                        <Edit2 size={16} />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(product.id)}
                        disabled={isLoading}
                        className="text-destructive hover:bg-red-500"
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
