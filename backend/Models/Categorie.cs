using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Categorie
{
    public int Id { get; set; }

    public string Nom { get; set; } = null!;

    public virtual ICollection<Produit> Produits { get; set; } = new List<Produit>();
}
