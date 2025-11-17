
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController(MarketDbContext marketDbContext) : ControllerBase
    {
        private readonly MarketDbContext _marketDbContext = marketDbContext;
        [HttpGet("recent-orders")]
        public async Task<IActionResult> RecentOrders()
        {
            var commandes = await _marketDbContext.Commandes
                .Include(c => c.IdClientNavigation)
                .OrderByDescending(c => c.DateCommande)
                .Take(10)
                .ToListAsync();

            var recentOrders = commandes.Select(c => new RecentOrderDto
            {
                Id = c.Id,
                ClientEmail = c.IdClientNavigation.Email,
                Total = c.NetAPayer,
                Status = c.StatutPaiement switch
                {
                    "SUPPRIMEE" => "DELETED",
                    "EN_ATTENTE" => "PENDING",
                    "ACCEPTEE" => "ACCEPTED",
                    _ => "PENDING"
                },
                Date = c.DateCommande.ToString("yyyy-MM-dd")
            }).ToList();

            return Ok(recentOrders);
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalProducts = await _marketDbContext.Produits.CountAsync();
            var totalOrders = await _marketDbContext.Commandes.CountAsync();
            var acceptedOrders = await _marketDbContext.Commandes
                .CountAsync(c => c.StatutPaiement == "ACCEPTEE");
            var activeClients = await _marketDbContext.Personnes
                .CountAsync(p => !p.IsAdmin);

            var stats = new DashboardStatsDto
            {
                TotalProducts = totalProducts,
                TotalOrders = totalOrders,
                AcceptedOrders = acceptedOrders,
                ActiveClients = activeClients
            };

            return Ok(stats);
        }

        [HttpGet("products-by-category")]
        public async Task<IActionResult> GetProductsByCategory()
        {
            var data = await _marketDbContext.Produits
                .Include(p => p.IdCategorieNavigation)
                .GroupBy(p => p.IdCategorieNavigation.Nom)
                .Select(g => new ProductsByCategoryDto
                {
                    Category = g.Key,
                    Products = g.Count()
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("order-status")]
        public async Task<IActionResult> GetOrderStatusDistribution()
        {
            var total = await _marketDbContext.Commandes.CountAsync();

            if (total == 0)
                return Ok(new { Accepted = 0, Pending = 0, Deleted = 0 });

            var accepted = await _marketDbContext.Commandes.CountAsync(c => c.StatutPaiement == "ACCEPTEE");
            var pending = await _marketDbContext.Commandes.CountAsync(c => c.StatutPaiement == "EN_ATTENTE");
            var deleted = await _marketDbContext.Commandes.CountAsync(c => c.StatutPaiement == "SUPPRIMEE");

            var distribution = new OrderStatusDto
            {
                Accepted = (int)Math.Round((double)accepted / total * 100),
                Pending = (int)Math.Round((double)pending / total * 100),
                Deleted = (int)Math.Round((double)deleted / total * 100)
            };

            return Ok(distribution);
        }

    }
}