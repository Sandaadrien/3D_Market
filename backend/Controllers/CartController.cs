
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController(MarketDbContext marketDbContext) : ControllerBase
    {
        private readonly MarketDbContext _marketDbContext = marketDbContext;

        [HttpPost("delete-commande")]
        public async Task<IActionResult> DeleteCommande([FromBody] ModifyRequestDTOs request)
        {
            /* 
                commande ??
                => est_payer = false
                => statutpaiement = "SUPPRIMEE"
            */
            var commande = await _marketDbContext.Commandes
                .FirstOrDefaultAsync(c => c.Id == request.IdCommande);

            if (commande == null)
                return NotFound("Commande non trouvée");

            commande.EstPaye = false;
            commande.StatutPaiement = "SUPPRIMEE";

            await _marketDbContext.SaveChangesAsync();

            return Ok(new { message = "Commande marquée comme supprimée", commandeId = commande.Id });
        }


        [HttpPost("accept-commande")]
        public async Task<IActionResult> AcceptCommande([FromBody] ModifyRequestDTOs requestDTOs)
        {

            // requestDTOs.IdApprobateur = 2;
            // requestDTOs.IdCommande = 3;
            /* 
                user ??
                commande ??

                => est_payer = true
                => statupaiement = "ACCEPTE"

                stock_produit - nombre_produit
            */

            var commande = await _marketDbContext.Commandes
                    .FirstOrDefaultAsync(c => c.Id == requestDTOs.IdCommande);

            if (commande == null)
                return NotFound("Commande non trouvée");

            var approbateur = await _marketDbContext.Personnes
                .FirstOrDefaultAsync(p => p.Id == requestDTOs.IdApprobateur && p.IsAdmin == true);

            if (approbateur == null)
                return BadRequest("Utilisateur non autorisé");
            

            var ligne_commandes = await _marketDbContext.LigneCommandes.Where(lc => lc.IdCommande == requestDTOs.IdCommande).ToListAsync();
            foreach (var lc in ligne_commandes)
            {
                var produit = await _marketDbContext.Produits.FirstOrDefaultAsync(p => p.Id == lc.IdProduit);
                if (produit == null)
                    return BadRequest($"Produit avec l'id {lc.IdProduit} introuvable");

                if (produit.Stock < lc.QuantiteProduit)
                    return BadRequest($"Stock insuffisant pour le produit {produit.Nom}");
                
                Console.WriteLine("Here totot : "+requestDTOs.IdApprobateur + " " + requestDTOs.IdCommande);

                produit.Stock -= lc.QuantiteProduit;
            }

            // Ajouter un paiement
            var paiement = new Payement
            {
                IdCommande = commande.Id,
                IdAprobateur = approbateur.Id,
                DateAprobation = DateOnly.FromDateTime(DateTime.Now)
            };

            _marketDbContext.Payements.Add(paiement);

            // Mettre à jour le statut de la commande
            commande.EstPaye = true;
            commande.StatutPaiement = "ACCEPTED";

            await _marketDbContext.SaveChangesAsync();
            return Ok(new { message = "Commande acceptée", commandeId = commande.Id });
        }
        
        
        [HttpPost("list-all-commande")]
        public async Task<IActionResult> ListAllCommande([FromBody] GetProductsRequestDTO request)
        {
            // request.UserId = 2;
            var authorized = await _marketDbContext.Personnes.AnyAsync(p => p.Id == request.UserId && p.IsAdmin == true);
            if (!authorized)
                return BadRequest("Ressource non authoriser");
            var commandes = await _marketDbContext.Commandes
                .Select(c => new
                {
                    c.Id,
                    c.IdClient,
                    ClientEmail = _marketDbContext.Personnes
                        .Where(p => p.Id == c.IdClient)
                        .Select(p => p.Email)
                        .FirstOrDefault(),
                    c.DateCommande,
                    c.NetAPayer,
                    c.EstPaye,
                    c.StatutPaiement,
                    Articles = _marketDbContext.LigneCommandes
                        .Where(lc => lc.IdCommande == c.Id)
                        .Select(lc => new
                        {
                            lc.IdProduit,
                            NomProduit = _marketDbContext.Produits
                                .Where(p => p.Id == lc.IdProduit)
                                .Select(p => p.Nom)
                                .FirstOrDefault(),
                            lc.QuantiteProduit,
                            PrixUnitaire = _marketDbContext.Produits
                                .Where(p => p.Id == lc.IdProduit)
                                .Select(p => p.PrixUnitaire)
                                .FirstOrDefault(),
                            SousTotal = lc.QuantiteProduit *
                                        _marketDbContext.Produits
                                            .Where(p => p.Id == lc.IdProduit)
                                            .Select(p => p.PrixUnitaire)
                                            .FirstOrDefault()
                        })
                        .ToList()
                })
                .ToListAsync();

            return Ok(commandes);
        }



        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
        {
/*             request.IdClient = 1;
            ArticleRequest a = new()
            { IdProduit = 1, Quantite = 2 };
            ArticleRequest b = new()
            { IdProduit = 2, Quantite = 4 };            
            ArticleRequest c = new()
            { IdProduit = 3, Quantite = 5 };
            request.Articles = [a, b, c]; */

            var commande = new Commande
            {
                IdClient = request.IdClient,
                DateCommande = DateOnly.FromDateTime(DateTime.Now),
                NetAPayer = request.Articles.Sum(a =>
                    _marketDbContext.Produits.Where(p => p.Id == a.IdProduit).Select(p => p.PrixUnitaire).First() * a.Quantite),
                EstPaye = false
            };

            _marketDbContext.Commandes.Add(commande);
            await _marketDbContext.SaveChangesAsync();

            foreach (var article in request.Articles)
            {
                _marketDbContext.LigneCommandes.Add(new LigneCommande
                {
                    IdCommande = commande.Id,
                    IdProduit = article.IdProduit,
                    QuantiteProduit = article.Quantite
                });
            }

            await _marketDbContext.SaveChangesAsync();
            return Ok(new { message = "Commande enregistrée", commandeId = commande.Id });
        }
        
    }
}