"use client";

import type { Order, OrderStatus } from "@/hooks/use-orders";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";

interface OrdersTableProps {
  orders: Order[];
  onViewDetails?: (order: Order) => void;
  onAccept?: (orderId: string) => void;
  onDelete?: (orderId: string) => void;
  isLoading?: boolean;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles = {
    ACCEPTE: "bg-accent/10 text-accent",
    EN_ATTENTE: "bg-primary/10 text-primary",
    SUPPRIMEE: "bg-destructive/10 text-destructive",
  };

  return <Badge className={`${styles[status]} border-0`}>{status}</Badge>;
}

export function OrdersTable({
  orders,
  onViewDetails,
  onAccept,
  onDelete,
  isLoading,
}: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No orders found.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-foreground">
                Order ID
              </th>
              <th className="text-left px-6 py-3 font-semibold text-foreground">
                Client
              </th>
              <th className="text-left px-6 py-3 font-semibold text-foreground">
                Items
              </th>
              <th className="text-left px-6 py-3 font-semibold text-foreground">
                Total
              </th>
              <th className="text-left px-6 py-3 font-semibold text-foreground">
                Status
              </th>
              <th className="text-left px-6 py-3 font-semibold text-foreground">
                Date
              </th>
              <th className="text-right px-6 py-3 font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/50">
                <td className="px-6 py-4 font-mono text-sm text-foreground">
                  {order.id}
                </td>
                <td className="px-6 py-4">
                  <span className="text-foreground">{order.clientEmail}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {order.articles.length} article
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-foreground">
                  {order.netAPayer} Ar
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.statutPaiement} />
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(order.dateCommande).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    {onViewDetails && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onViewDetails(order)}
                        disabled={isLoading}
                      >
                        <Eye size={16} />
                      </Button>
                    )}
                    {order.statutPaiement === "EN_ATTENTE" && onAccept && (
                      <Button
                        size="sm"
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                        onClick={() => onAccept(order.id)}
                        disabled={isLoading}
                      >
                        <Check size={16} />
                      </Button>
                    )}
                    {order.statutPaiement !== "SUPPRIMEE" && onDelete && (
                      <Button
                        size="sm"
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => onDelete(order.id)}
                        disabled={isLoading}
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
