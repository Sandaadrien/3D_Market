export interface ProductsType {
  id: number;
  name: string;
  model: string;
  price: number;
  isFavorite: boolean;
  description: string;
  category: string;
  quantity: number;
}
export interface ProductCardsProps {
  product: ProductsType;
}

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
}
export interface ModelProps {
  url: string;
}
