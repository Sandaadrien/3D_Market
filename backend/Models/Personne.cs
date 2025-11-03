using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

/// <summary>
/// Table contenant les informations des utilisateurs
/// </summary>
public partial class Personne
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string Email { get; set; } = null!;

    public string MotDePasse { get; set; } = null!;

    public bool IsAdmin { get; set; }

    public virtual ICollection<Commande> Commandes { get; set; } = new List<Commande>();

    public virtual ICollection<Favori> Favoris { get; set; } = new List<Favori>();

    public virtual ICollection<Payement> Payements { get; set; } = new List<Payement>();
}
