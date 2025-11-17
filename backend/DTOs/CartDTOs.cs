namespace backend.DTOs
{
    public class ModifyRequestDTOs
    {
        public int IdApprobateur { get; set; }
        public int IdCommande { get; set; }
    }
    public class CheckoutRequest
    {
        public int IdClient { get; set; }
        public List<ArticleRequest> Articles { get; set; } = [];
    }

    public class ArticleRequest
    {
        public int IdProduit { get; set; }
        public int Quantite { get; set; }
    }
}