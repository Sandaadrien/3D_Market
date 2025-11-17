using System.ComponentModel;

namespace backend.DTOs
{
    public class GetProductsRequestDTO
    {
        public int UserId { get; set; }
    }
    public class OneProductDetailsDTOs
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool IsFavorite { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public long Stock { get; set; }

    }
    public class ToggleFavoriteDTOs
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
    }
}