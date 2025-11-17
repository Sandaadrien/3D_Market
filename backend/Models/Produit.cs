using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

/// <summary>
/// Table des produits avec leur modèle 3D et autres informations
/// </summary>
public partial class Produit
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Nom { get; set; } = null!;

    public string? Model { get; set; }

    public int? IdCategorie { get; set; }

    public string? Description { get; set; }

    public decimal PrixUnitaire { get; set; }

    public long Stock { get; set; }

    public virtual ICollection<Favori> Favoris { get; set; } = new List<Favori>();

    public virtual Categorie? IdCategorieNavigation { get; set; }

    public virtual ICollection<LigneCommande> LigneCommandes { get; set; } = new List<LigneCommande>();
}
