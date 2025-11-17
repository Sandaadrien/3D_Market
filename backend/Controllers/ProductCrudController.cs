
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductCrudController(MarketDbContext marketDbContext) : ControllerBase
    {
        private readonly MarketDbContext _marketDbContext = marketDbContext;

        [HttpGet("list")]
        public async Task<IActionResult> GetAllProducts()
        {
            var produits = await _marketDbContext.Produits
                .Include(p => p.IdCategorieNavigation)
                .Where(p => p.Stock > 0)
                .Select(p => new
                {
                    Id = p.Id,
                    Name = p.Nom,
                    p.Model,
                    p.Description,
                    Price = p.PrixUnitaire,
                    p.Stock,
                    Category = p.IdCategorieNavigation != null ? p.IdCategorieNavigation.Nom : "Non catégorisé"
                })
                .ToListAsync();

            return Ok(produits);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var produit = await _marketDbContext.Produits
                .Include(p => p.IdCategorieNavigation)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (produit == null)
                return NotFound(new { message = "Produit introuvable" });

            return Ok(new
            {
                produit.Id,
                produit.Nom,
                produit.Model,
                produit.Description,
                produit.PrixUnitaire,
                produit.Stock,
                Categorie = produit.IdCategorieNavigation?.Nom ?? "Non catégorisé"
            });
        }

        [HttpPost("update-product")]
        public async Task<IActionResult> UpdateProduct([FromForm] ProductUpdateDTOs request)
        {
            Console.WriteLine("here guy : "+ request.Name);
            var produit = await _marketDbContext.Produits
                .Include(p => p.IdCategorieNavigation)
                .FirstOrDefaultAsync(p => p.Id == request.Id);

            if (produit == null)
                return NotFound(new { message = "Produit introuvable" });

            if (!string.IsNullOrWhiteSpace(request.Name))
                produit.Nom = request.Name;

            if (request.Price.HasValue)
                produit.PrixUnitaire = request.Price ?? 0;

            if (!string.IsNullOrWhiteSpace(request.Description))
                produit.Description = request.Description;

            if (request.Stock.HasValue)
                produit.Stock = (int)request.Stock.Value;

            if (!string.IsNullOrWhiteSpace(request.Category))
            {
                var categorie = await _marketDbContext.Categories.FirstOrDefaultAsync(c => c.Nom == request.Category);
                if (categorie == null)
                {
                    categorie = new Categorie { Nom = request.Category };
                    _marketDbContext.Categories.Add(categorie);
                    await _marketDbContext.SaveChangesAsync();
                }
                produit.IdCategorie = categorie.Id;
            }

            if (request.ModelFile != null && request.ModelFile.Length > 0)
            {
                var uploadDir = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "frontend", "public", "models"));
                if (!Directory.Exists(uploadDir))
                    Directory.CreateDirectory(uploadDir);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(request.ModelFile.FileName);
                var filePath = Path.Combine(uploadDir, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await request.ModelFile.CopyToAsync(stream);
                }

                produit.Model = $"/models/{fileName}";
            }

            await _marketDbContext.SaveChangesAsync();

            return Ok(new { message = "Produit mis à jour avec succès" });
        }

        [HttpPost("create-product")]
        public async Task<IActionResult> CreateProduct([FromForm] ProductCreateDTOs request)
        {

            /*             request.Name = "super table 1";
                        request.Price = 20000;
                        request.Category = "Cuisine";
                        request.Description = "Table bien utile pour manger ensemble en famille";
                        request.Stock = 30;
             */
            // if (!ModelState.IsValid)
            //     return BadRequest(ModelState);

            var categorie = await _marketDbContext.Categories.FirstOrDefaultAsync((c) => request.Category == c.Nom);

            if (categorie is null)
            {
                categorie = new Categorie { Nom = request.Category };
                _marketDbContext.Categories.Add(categorie);
                _marketDbContext.SaveChanges();
            }
            string? modelPath = null;

            if (request.ModelFile != null && request.ModelFile.Length != 0)
            {
                var uploadDir = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "frontend", "public", "models"));
                if (!Directory.Exists(uploadDir))
                    Directory.CreateDirectory(uploadDir);
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(request.ModelFile.FileName);
                var filePath = Path.Combine(uploadDir, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await request.ModelFile.CopyToAsync(stream);
                }

                modelPath = $"/models/{fileName}";
            }

            var produit = new Produit
            {
                Nom = request.Name,
                Description = request.Description,
                PrixUnitaire = request.Price,
                Stock = (int)request.Stock,
                IdCategorie = categorie.Id,
                Model = modelPath,
            };

            _marketDbContext.Produits.Add(produit);

            _marketDbContext.SaveChanges();
            
            // return Ok(new { message = "Produit ajouté avec succès"});

            return Ok(new {
                Id = produit.Id,
                Name = produit.Nom,
                produit.Description,
                Price = produit.PrixUnitaire,
                Stock = produit.Stock,
                Category = categorie.Nom,
                Model = produit.Model
            });
        }

        [HttpPost("delete-product")]
        public async Task<IActionResult> DeleteProduct([FromBody] OneProductDTOs request)
        {
            var produit = await _marketDbContext.Produits
                .Include(p => p.IdCategorieNavigation)
                .FirstOrDefaultAsync(p => p.Id == request.Id);

            if (produit == null)
                return NotFound(new { message = "Produit introuvable" });

            produit.Stock = 0;
            _marketDbContext.SaveChanges();

            return Ok(new { message = "Produit retiré des stocks"});
        }
    }
}