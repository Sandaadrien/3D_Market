using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Commande
{
    public int Id { get; set; }

    public int IdClient { get; set; }

    public DateOnly DateCommande { get; set; }

    public decimal NetAPayer { get; set; }

    public bool? EstPaye { get; set; }

    public virtual Personne IdClientNavigation { get; set; } = null!;

    public virtual ICollection<LigneCommande> LigneCommandes { get; set; } = new List<LigneCommande>();

    public virtual ICollection<Payement> Payements { get; set; } = new List<Payement>();
}
