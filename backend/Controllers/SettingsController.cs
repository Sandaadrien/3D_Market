
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController(MarketDbContext marketDbContext, IPasswordHasher<Personne> hasher): ControllerBase
    {
        private readonly MarketDbContext _marketDbContext = marketDbContext;
        private readonly IPasswordHasher<Personne> _hasher = hasher;

        [HttpPost("change-profile")]
        public async Task<IActionResult> ChangeProfile([FromBody] NewProfileDTOs request)
        {
            /* 
                user ??
                Email déjà utiliser && Email correct forme ?? --> Mis à jour sinon
                Password !== "" or " " ?? --> Mis à jour sinon

            */
            var user = await _marketDbContext.Personnes.FirstOrDefaultAsync(p => p.Id == request.UserId);
            if (user == null)
                return NotFound(new { message = "L'utilisateur est introuvable" });
            if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains('@'))
                return BadRequest(new { message = "Email invalide" });
            var emailExists = await _marketDbContext.Personnes.AnyAsync(p => p.Email == request.Email && p.Id != request.UserId);
            if (emailExists)
                return Conflict(new { message = "Cet email est déjà utilisé par un autre utilisateur." });
            
            user.Email = request.Email;
            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                if (request.Password.Length < 6)
                    return BadRequest(new { message = "Le mot de passe doit contenir au moins 6 caractères." });

                user.MotDePasse = _hasher.HashPassword(user, request.Password);
            }
            _marketDbContext.Personnes.Update(user);
            await _marketDbContext.SaveChangesAsync();

            return Ok(new
            {
                message = "Profil mis à jour avec succès !",
                user = new
                {
                    user.Id,
                    user.Email
                }
            });
    
        }

        [HttpPost("get-last-product")]
        public async Task<IActionResult> GetLastProduct([FromBody] GetProductsRequestDTO request)
        {
            /* 
                produits des 10 derniers commandes
                favoris Id
                ==> les produits des 10 derniers commandes
            */
            
            var lastOrders = await _marketDbContext.Commandes
                                                            .Where(c => c.IdClient == request.UserId)
                                                            .OrderByDescending(c => c.DateCommande)
                                                            .Take(10)
                                                            .Include(c => c.LigneCommandes)
                                                                .ThenInclude(lc => lc.IdProduitNavigation)
                                                                    .ThenInclude(p => p.IdCategorieNavigation)
                                                            .ToListAsync();
            var favorisIds = await _marketDbContext.Favoris
                    .Where(f => f.IdPersonne == request.UserId)
                    .Select(f => f.IdProduit)
                    .ToListAsync();

            var produits = lastOrders
                                    .SelectMany(o => o.LigneCommandes) // fusionne toutes les [LigneCommandes]
                                    .Select(lc => lc.IdProduitNavigation)
                                    .Distinct() // évite les doublons si même produit dans plusieurs commandes
                                    .ToList();
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
            }).ToList();

            return Ok(new {produitDTOs });
        }
        
        [HttpPost("get-loved-product")]
        public async Task<IActionResult> GetLovedProduct([FromBody] GetProductsRequestDTO request)
        {
            List<Produit> produits = await _marketDbContext.Produits.Include(p => p.IdCategorieNavigation).ToListAsync();
            var favorisIds = await _marketDbContext.Favoris.Where(f => f.IdPersonne == request.UserId).Select(f => f.IdProduit).ToListAsync();
            var produitDTOs = produits.Where(p => favorisIds.Contains(p.Id)).Select(p => new OneProductDetailsDTOs
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
            return Ok(new { produitDTOs });
        }

    }
}