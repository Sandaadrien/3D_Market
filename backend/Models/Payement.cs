using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Payement
{
    public int Id { get; set; }

    public int IdCommande { get; set; }

    public int IdAprobateur { get; set; }

    public DateOnly DateAprobation { get; set; }

    public virtual Personne IdAprobateurNavigation { get; set; } = null!;

    public virtual Commande IdCommandeNavigation { get; set; } = null!;
}
