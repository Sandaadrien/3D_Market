"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/use-products";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CategoriesPage() {
  // const { products } = useProducts();
  // const [categories, setCategories] = useState<string[]>([]);
  // const [newCategory, setNewCategory] = useState("");
  // const [showDialog, setShowDialog] = useState(false);
  // const [editingCategory, setEditingCategory] = useState<string | null>(null);

  // useEffect(() => {
  //   // Extract unique categories from products
  //   const uniqueCategories = Array.from(
  //     new Set(products.map((p) => p.categorie).filter(Boolean))
  //   );
  //   setCategories(uniqueCategories);
  // }, [products]);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (newCategory.trim()) {
  //     if (editingCategory) {
  //       setCategories(
  //         categories.map((c) =>
  //           c === editingCategory ? newCategory.trim() : c
  //         )
  //       );
  //     } else if (!categories.includes(newCategory)) {
  //       setCategories([...categories, newCategory.trim()]);
  //     }
  //     setNewCategory("");
  //     setEditingCategory(null);
  //     setShowDialog(false);
  //   }
  // };

  // const handleEditCategory = (category: string) => {
  //   setEditingCategory(category);
  //   setNewCategory(category);
  //   setShowDialog(true);
  // };

  // const handleDeleteCategory = (category: string) => {
  //   if (confirm(`Delete category "${category}"?`)) {
  //     setCategories(categories.filter((c) => c !== category));
  //   }
  // };

  // const handleCloseDialog = () => {
  //   setShowDialog(false);
  //   setNewCategory("");
  //   setEditingCategory(null);
  // };

  // return (
  //   <div className="space-y-6">
  //     {/* Header */}
  //     <div className="flex items-center justify-between">
  //       <div>
  //         <h1 className="text-3xl font-bold text-foreground">Categories</h1>
  //         <p className="text-muted-foreground mt-1">
  //           Manage product categories
  //         </p>
  //       </div>
  //       <Button
  //         onClick={() => {
  //           setEditingCategory(null);
  //           setNewCategory("");
  //           setShowDialog(true);
  //         }}
  //         className="bg-primary text-primary-foreground hover:bg-primary/90"
  //       >
  //         <Plus size={20} className="mr-2" />
  //         Add Category
  //       </Button>
  //     </div>

  //     {/* Add/Edit Category Dialog */}
  //     <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
  //       <DialogContent>
  //         <DialogHeader>
  //           <DialogTitle>
  //             {editingCategory ? "Edit Category" : "Add New Category"}
  //           </DialogTitle>
  //         </DialogHeader>
  //         <form onSubmit={handleSubmit} className="space-y-4 py-4">
  //           <div className="space-y-2">
  //             <label className="text-sm font-medium text-foreground">
  //               Category Name
  //             </label>
  //             <input
  //               type="text"
  //               value={newCategory}
  //               onChange={(e) => setNewCategory(e.target.value)}
  //               placeholder="e.g., Furniture"
  //               className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
  //               autoFocus
  //             />
  //           </div>
  //           <div className="flex gap-3">
  //             <Button
  //               type="submit"
  //               className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
  //             >
  //               {editingCategory ? "Update" : "Add"}
  //             </Button>
  //             <Button
  //               type="button"
  //               onClick={handleCloseDialog}
  //               variant="outline"
  //               className="flex-1 bg-transparent"
  //             >
  //               Cancel
  //             </Button>
  //           </div>
  //         </form>
  //       </DialogContent>
  //     </Dialog>

  //     {/* Categories Grid */}
  //     {categories.length === 0 ? (
  //       <Card className="p-12 text-center border-2 border-dashed">
  //         <p className="text-muted-foreground text-lg">No categories yet</p>
  //         <p className="text-sm text-muted-foreground mt-1">
  //           Create your first category to get started
  //         </p>
  //       </Card>
  //     ) : (
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //         {categories.map((category) => {
  //           const categoryProductCount = products.filter(
  //             (p) => p.categorie === category
  //           ).length;
  //           return (
  //             <Card
  //               key={category}
  //               className="p-6 hover:shadow-lg transition-shadow border border-border hover:border-primary/50"
  //             >
  //               <div className="space-y-4">
  //                 <div className="flex-1">
  //                   <h3 className="font-semibold text-lg text-foreground text-balance">
  //                     {category}
  //                   </h3>
  //                   <p className="text-sm text-muted-foreground mt-1">
  //                     {categoryProductCount}{" "}
  //                     {categoryProductCount === 1 ? "product" : "products"}
  //                   </p>
  //                 </div>
  //                 <div className="flex gap-2 pt-2">
  //                   <Button
  //                     onClick={() => handleEditCategory(category)}
  //                     size="sm"
  //                     variant="outline"
  //                     className="flex-1"
  //                   >
  //                     <Edit2 size={16} className="mr-2" />
  //                     Edit
  //                   </Button>
  //                   <Button
  //                     onClick={() => handleDeleteCategory(category)}
  //                     size="sm"
  //                     variant="ghost"
  //                     className="text-destructive hover:text-destructive"
  //                   >
  //                     <Trash2 size={16} />
  //                   </Button>
  //                 </div>
  //               </div>
  //             </Card>
  //           );
  //         })}
  //       </div>
  //     )}
  //   </div>
  // );
  return <></>;
}
