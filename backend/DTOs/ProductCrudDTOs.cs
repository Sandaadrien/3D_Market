namespace backend.DTOs
{
    public class OneProductDTOs
    {
        public int Id { get; set; }
    }
    public class ProductCreateDTOs
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public long Stock { get; set; }

        // Le fichier du modèle 3D
        public IFormFile? ModelFile { get; set; }
    }
    public class ProductUpdateDTOs
    {
        public int Id { get; set; }
        public string? Name { get; set; } = string.Empty;
        public decimal? Price { get; set; }
        public string? Category { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public long? Stock { get; set; }

        // Le fichier du modèle 3D
        public IFormFile? ModelFile { get; set; }

    }
}