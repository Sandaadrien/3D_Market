
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController(MarketDbContext marketDbContext) : ControllerBase
    {
        private readonly MarketDbContext _marketDbContext = marketDbContext;
        [HttpPost("get-products")]
        public async Task<IActionResult> GetProducts([FromBody] GetProductsRequestDTO request)
        {
            var userId = request.UserId;
            List<Produit> produits = await _marketDbContext.Produits.Include(p => p.IdCategorieNavigation).ToListAsync();
            var favorisIds = await _marketDbContext.Favoris.Where(f => f.IdPersonne == userId).Select(f => f.IdProduit).ToListAsync();
            var produitDTOs = produits.Select(p => new OneProductDetailsDTOs
            {
                Id = p.Id,
                Name = p.Nom,
                Model = p.Model ?? "N/A",
                Price = p.PrixUnitaire,
                IsFavorite = favorisIds.Contains(p.Id),
                Category = p.IdCategorieNavigation is not null ? p.IdCategorieNavigation.Nom : "N/A",
                Description = p.Description ?? "No description here",
                Stock = p.Stock
            });
            return Ok(produitDTOs);
        }

        [HttpPost("toggle-favorite")]
        public async Task<IActionResult> ToggleFavorite([FromBody] ToggleFavoriteDTOs request)
        {
            var user = await _marketDbContext.Personnes.FirstOrDefaultAsync(u => u.Id == request.UserId);
            if (user == null)
                return NotFound(new { message = "Utilisateur introuvable" });

            var produit = await _marketDbContext.Produits.FirstOrDefaultAsync(p => p.Id == request.ProductId);
            if (produit == null)
                return NotFound(new { message = "Produit introuvable" });
            var existingFavorite = await _marketDbContext.Favoris
                    .FirstOrDefaultAsync(f => f.IdPersonne == request.UserId && f.IdProduit == request.ProductId);
            if (existingFavorite != null)
            {
                // Déjà aimé -> on le supprime (dislike)
                _marketDbContext.Favoris.Remove(existingFavorite);
                await _marketDbContext.SaveChangesAsync();
                return Ok(new { isFavorite = false, message = "Produit retiré des favoris" });
            }
            else
            {
                // Pas encore aimé ->c on l'ajoute
                var newFavorite = new Favori
                {
                    IdPersonne = request.UserId,
                    IdProduit = request.ProductId
                };
                _marketDbContext.Favoris.Add(newFavorite);
                await _marketDbContext.SaveChangesAsync();
                return Ok(new { isFavorite = true, message = "Produit ajouté aux favoris" });
            }

        }
    }
}