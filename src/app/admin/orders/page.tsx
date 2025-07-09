"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, Package, Search, TestTube } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { OrderWithItems } from "@/types/orders";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-purple-100 text-purple-800",
};

const statusLabels = {
  pending: "En attente",
  paid: "Payée",
  failed: "Échouée",
  cancelled: "Annulée",
  shipped: "Expédiée",
  delivered: "Livrée",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [testingOrders, setTestingOrders] = useState(false);

  const supabase = createClient();

  const fetchOrders = async () => {
    setLoading(true);
    
    
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .order("created_at", { ascending: false });

    

    if (error) {
      toast.error("Erreur lors du chargement des commandes");
      
    } else {
    
      setOrders(data as OrderWithItems[]);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast.error("Erreur lors de la mise à jour du statut");
      console.error(error);
      return;
    }

    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus as any } : order
    ));
    toast.success("Statut mis à jour");
  };

  const viewOrderDetails = (order: OrderWithItems) => {
    setSelectedOrder(order);
    setOrderDialogOpen(true);
  };

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.customer_name?.toLowerCase().includes(searchLower) ||
      order.customer_email?.toLowerCase().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des Commandes</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une commande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Commandes ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Chargement...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center text-muted-foreground">Aucune commande trouvée.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer_name}</div>
                        <div className="text-sm text-gray-500">{order.customer_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {(order.total_amount / 100).toFixed(2)}€
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewOrderDetails(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Détails de la commande
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Informations de commande</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">ID:</span> {selectedOrder.id}</div>
                    <div><span className="text-gray-600">Statut:</span> 
                      <Badge className={`ml-2 ${statusColors[selectedOrder.status]}`}>
                        {statusLabels[selectedOrder.status]}
                      </Badge>
                    </div>
                    <div><span className="text-gray-600">Date:</span> {new Date(selectedOrder.created_at).toLocaleString("fr-FR")}</div>
                    <div><span className="text-gray-600">Total:</span> {(selectedOrder.total_amount / 100).toFixed(2)}€</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Informations client</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Nom:</span> {selectedOrder.customer_name}</div>
                    <div><span className="text-gray-600">Email:</span> {selectedOrder.customer_email}</div>
                    {selectedOrder.shipping_address && (
                      <div>
                        <span className="text-gray-600">Adresse:</span>
                        <div className="ml-2">
                          {selectedOrder.shipping_address.line1}<br />
                          {selectedOrder.shipping_address.line2 && <>{selectedOrder.shipping_address.line2}<br /></>}
                          {selectedOrder.shipping_address.postal_code} {selectedOrder.shipping_address.city}<br />
                          {selectedOrder.shipping_address.country}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Articles commandés</h4>
                  <div className="space-y-3">
                    {selectedOrder.order_items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">Quantité: {item.quantity}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{(item.price * item.quantity / 100).toFixed(2)}€</div>
                          <div className="text-sm text-gray-600">{(item.price / 100).toFixed(2)}€ l'unité</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedOrder.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Notes</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 