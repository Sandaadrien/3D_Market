"use client";

import type { Order } from "@/hooks/use-orders";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card">
          <h2 className="text-2xl font-bold text-foreground">Order Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-sm">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Client Email</p>
              <p className="text-foreground">{order.clientEmail}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-semibold">
                {order.statutPaiement === "ACCEPTE" && (
                  <span className="text-accent">Accepted</span>
                )}
                {order.statutPaiement === "EN_ATTENTE" && (
                  <span className="text-primary">Pending</span>
                )}
                {order.statutPaiement === "SUPPRIMEE" && (
                  <span className="text-destructive">Deleted</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="text-foreground">
                {new Date(order.dateCommande).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Order Items</h3>
            <div className="space-y-2">
              {order.articles.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {item.nomProduit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantiteProduit}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">
                    {item.prixUnitaire * item.quantiteProduit} Ar
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-end pt-4 border-t border-border">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-3xl font-bold text-foreground">
                {order.netAPayer} Ar
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
