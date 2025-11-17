namespace backend.DTOs
{
    public class RecentOrderDto
    {
        public int Id { get; set; }
        public string ClientEmail { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
    }
    public class DashboardStatsDto
    {
        public int TotalProducts { get; set; }
        public int TotalOrders { get; set; }
        public int AcceptedOrders { get; set; }
        public int ActiveClients { get; set; }
    }
    public class ProductsByCategoryDto
    {
        public string Category { get; set; } = string.Empty;
        public int Products { get; set; }
    }
    public class OrderStatusDto
    {
        public int Accepted { get; set; }
        public int Pending { get; set; }
        public int Deleted { get; set; }
    }
}