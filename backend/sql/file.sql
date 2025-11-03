CREATE SCHEMA IF NOT EXISTS public;

CREATE SEQUENCE public.user_id_seq AS integer START WITH 1 INCREMENT BY 1;

-- Table des catégories
CREATE TABLE public.categorie (
    id              serial PRIMARY KEY,
    nom             varchar(255) NOT NULL
);

-- Table des utilisateurs
CREATE TABLE public.personne (
    id              integer DEFAULT nextval('user_id_seq'::regclass) PRIMARY KEY,
    email           varchar(255) NOT NULL UNIQUE,
    mot_de_passe    varchar(255) NOT NULL,
    is_admin        boolean DEFAULT false NOT NULL
);

-- Table des produits
CREATE TABLE public.produit (
    id              serial PRIMARY KEY,
    nom             varchar(100) NOT NULL,
    model           varchar(255),                -- correspond à "model" dans ProductsType
    id_categorie    integer REFERENCES public.categorie(id),
    description     text,
    prix_unitaire   decimal(10,2) DEFAULT 0 NOT NULL,  -- corrigé
    quantite        bigint DEFAULT 0 NOT NULL,
    is_favorite     boolean DEFAULT false NOT NULL     -- ajouté pour correspondre à "isFavorite"
);

-- Table des commandes
CREATE TABLE public.commande (
    id              serial PRIMARY KEY,
    id_client       integer NOT NULL REFERENCES public.personne(id),
    date_commande   date NOT NULL DEFAULT CURRENT_DATE,
    net_a_payer     decimal(10,2) DEFAULT 0 NOT NULL,
    est_payer       boolean DEFAULT false
);

-- Table des lignes de commande
CREATE TABLE public.ligne_commande (
    id                  serial PRIMARY KEY,
    id_produit          integer NOT NULL REFERENCES public.produit(id),
    id_commande         integer NOT NULL REFERENCES public.commande(id),
    quantite_produit    integer DEFAULT 0 NOT NULL
);

-- Table des paiements
CREATE TABLE public.payement (
    id                  serial PRIMARY KEY,
    id_commande         integer NOT NULL REFERENCES public.commande(id),
    id_aprobateur       integer NOT NULL REFERENCES public.personne(id),
    date_aprobation     date NOT NULL DEFAULT CURRENT_DATE
);

COMMENT ON TABLE public.personne IS 'Table contenant les informations des utilisateurs';
COMMENT ON TABLE public.produit IS 'Table des produits avec leur modèle 3D et autres informations';
