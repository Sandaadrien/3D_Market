using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public partial class MarketDbContext : DbContext
{
    public MarketDbContext()
    {
    }

    public MarketDbContext(DbContextOptions<MarketDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Categorie> Categories { get; set; }

    public virtual DbSet<Commande> Commandes { get; set; }

    public virtual DbSet<Favori> Favoris { get; set; }

    public virtual DbSet<LigneCommande> LigneCommandes { get; set; }

    public virtual DbSet<Payement> Payements { get; set; }

    public virtual DbSet<Personne> Personnes { get; set; }

    public virtual DbSet<Produit> Produits { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Categorie>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("categorie_pkey");

            entity.ToTable("categorie");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Nom)
                .HasMaxLength(255)
                .HasColumnName("nom");
        });

        modelBuilder.Entity<Commande>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("commande_pkey");

            entity.ToTable("commande");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DateCommande)
                .HasDefaultValueSql("CURRENT_DATE")
                .HasColumnName("date_commande");
            entity.Property(e => e.EstPaye)
                .HasDefaultValue(false)
                .HasColumnName("est_paye");
            entity.Property(e => e.IdClient).HasColumnName("id_client");
            entity.Property(e => e.NetAPayer)
                .HasPrecision(10, 2)
                .HasColumnName("net_a_payer");
            entity.Property(e => e.StatutPaiement)
                .HasMaxLength(20)
                .HasDefaultValueSql("'EN_ATTENTE'::character varying")
                .HasColumnName("statut_paiement");

            entity.HasOne(d => d.IdClientNavigation).WithMany(p => p.Commandes)
                .HasForeignKey(d => d.IdClient)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("commande_id_client_fkey");
        });

        modelBuilder.Entity<Favori>(entity =>
        {
            entity.HasKey(e => new { e.IdPersonne, e.IdProduit }).HasName("favoris_pkey");

            entity.ToTable("favoris", tb => tb.HasComment("Table des produits favoris par utilisateur"));

            entity.Property(e => e.IdPersonne).HasColumnName("id_personne");
            entity.Property(e => e.IdProduit).HasColumnName("id_produit");
            entity.Property(e => e.DateAjout)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("date_ajout");

            entity.HasOne(d => d.IdPersonneNavigation).WithMany(p => p.Favoris)
                .HasForeignKey(d => d.IdPersonne)
                .HasConstraintName("favoris_id_personne_fkey");

            entity.HasOne(d => d.IdProduitNavigation).WithMany(p => p.Favoris)
                .HasForeignKey(d => d.IdProduit)
                .HasConstraintName("favoris_id_produit_fkey");
        });

        modelBuilder.Entity<LigneCommande>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("ligne_commande_pkey");

            entity.ToTable("ligne_commande");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.IdCommande).HasColumnName("id_commande");
            entity.Property(e => e.IdProduit).HasColumnName("id_produit");
            entity.Property(e => e.QuantiteProduit)
                .HasDefaultValue(0)
                .HasColumnName("quantite_produit");

            entity.HasOne(d => d.IdCommandeNavigation).WithMany(p => p.LigneCommandes)
                .HasForeignKey(d => d.IdCommande)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ligne_commande_id_commande_fkey");

            entity.HasOne(d => d.IdProduitNavigation).WithMany(p => p.LigneCommandes)
                .HasForeignKey(d => d.IdProduit)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("ligne_commande_id_produit_fkey");
        });

        modelBuilder.Entity<Payement>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("payement_pkey");

            entity.ToTable("payement");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DateAprobation)
                .HasDefaultValueSql("CURRENT_DATE")
                .HasColumnName("date_aprobation");
            entity.Property(e => e.IdAprobateur).HasColumnName("id_aprobateur");
            entity.Property(e => e.IdCommande).HasColumnName("id_commande");

            entity.HasOne(d => d.IdAprobateurNavigation).WithMany(p => p.Payements)
                .HasForeignKey(d => d.IdAprobateur)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("payement_id_aprobateur_fkey");

            entity.HasOne(d => d.IdCommandeNavigation).WithMany(p => p.Payements)
                .HasForeignKey(d => d.IdCommande)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("payement_id_commande_fkey");
        });

        modelBuilder.Entity<Personne>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("personne_pkey");

            entity.ToTable("personne", tb => tb.HasComment("Table contenant les informations des utilisateurs"));

            entity.HasIndex(e => e.Email, "personne_email_key").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("nextval('user_id_seq'::regclass)")
                .HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.IsAdmin)
                .HasDefaultValue(false)
                .HasColumnName("is_admin");
            entity.Property(e => e.MotDePasse)
                .HasMaxLength(255)
                .HasColumnName("mot_de_passe");
        });

        modelBuilder.Entity<Produit>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("produit_pkey");

            entity.ToTable("produit", tb => tb.HasComment("Table des produits avec leur modèle 3D et autres informations"));

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.IdCategorie).HasColumnName("id_categorie");
            entity.Property(e => e.Model)
                .HasMaxLength(255)
                .HasColumnName("model");
            entity.Property(e => e.Nom)
                .HasMaxLength(100)
                .HasColumnName("nom");
            entity.Property(e => e.PrixUnitaire)
                .HasPrecision(10, 2)
                .HasColumnName("prix_unitaire");
            entity.Property(e => e.Stock)
                .HasDefaultValue(0L)
                .HasColumnName("stock");

            entity.HasOne(d => d.IdCategorieNavigation).WithMany(p => p.Produits)
                .HasForeignKey(d => d.IdCategorie)
                .HasConstraintName("produit_id_categorie_fkey");
        });
        modelBuilder.HasSequence<int>("user_id_seq");

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
