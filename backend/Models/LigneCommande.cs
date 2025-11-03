using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class LigneCommande
{
    public int Id { get; set; }

    public int IdProduit { get; set; }

    public int IdCommande { get; set; }

    public int QuantiteProduit { get; set; }

    public virtual Commande IdCommandeNavigation { get; set; } = null!;

    public virtual Produit IdProduitNavigation { get; set; } = null!;
}
