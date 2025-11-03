import { X } from "lucide-react";
import { FilterModalProps } from "@/types/utilities";

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCategories,
  onToggleCategory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-950/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-6">Filtrer par catégorie</h2>
        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => onToggleCategory(category)}
                className="w-5 h-5 accent-indigo-600"
              />
              <span className="text-lg">{category}</span>
            </label>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 bg-indigo-600 text-white rounded-lg py-3 font-semibold hover:bg-indigo-700"
        >
          Appliquer les filtres
        </button>
      </div>
    </div>
  );
};

export default FilterModal;
