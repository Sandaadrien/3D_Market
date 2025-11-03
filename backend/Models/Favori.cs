using System;
using System.Collections.Generic;

namespace backend.Models;

/// <summary>
/// Table des produits favoris par utilisateur
/// </summary>
public partial class Favori
{
    public int IdPersonne { get; set; }

    public int IdProduit { get; set; }

    public DateTime? DateAjout { get; set; }

    public virtual Personne IdPersonneNavigation { get; set; } = null!;

    public virtual Produit IdProduitNavigation { get; set; } = null!;
}
