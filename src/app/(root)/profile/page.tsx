"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { OrderWithItems } from "@/types/orders";
import router from "next/router";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    avatar_url: "",
    adresse: "",
    code_postal: "",
    ville: "",
  });
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"infos" | "orders">("infos");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        toast.error("Erreur lors du chargement du profil");
        setLoading(false);
        return;
      }
      setProfile({ ...data, email: user.email });
      setForm({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: user.email || "",
        phone: data.phone || "",
        avatar_url: data.avatar_url || "",
        adresse: data.adresse || "",
        code_postal: data.code_postal || "",
        ville: data.ville || "",
      });
      setLoading(false);
    };
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const handleUpdateProfile = async () => {
    if (!profile) return;
    setLoading(true);

    const { error: profileError, data: updatedProfile } = await supabase
      .from("profiles")
      .update({
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        avatar_url: form.avatar_url,
        adresse: form.adresse,
        code_postal: form.code_postal,
        ville: form.ville,
      })
      .eq("id", profile.id)
      .select()
      .single();

    if (profileError) {
      toast.error(profileError.message || "Erreur lors de la mise à jour");
    } else {
      setProfile({ ...updatedProfile, email: profile.email });
      toast.success("Profil mis à jour !");
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `avatars/${profile.id}.${fileExt}`;

    let { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Erreur lors de l'upload de la photo");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setForm((f) => ({ ...f, avatar_url: data.publicUrl }));

    // Ajoute cette ligne pour sauvegarder immédiatement l'URL dans la base
    await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", profile.id);

    setUploading(false);
    toast.success("Photo de profil mise à jour !");
  };

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">Chargement...</div>;
  }

  if (!profile) {
    return <div className="flex h-screen w-full items-center justify-center text-red-500">Aucun profil trouvé.</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white pt-16">
      <div className="flex w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden my-16">
        {/* Navigation latérale */}
        <nav className="w-52 bg-lime-500 border-r flex flex-col py-8 px-4 gap-3">
          <button
            className={`text-left px-3 py-2 rounded-lg font-semibold transition ${
              activeTab === "infos"
                ? "bg-lime-600 text-white shadow"
                : "hover:bg-lime-600 text-white"
            }`}
            onClick={() => setActiveTab("infos")}
          >
            Informations personnelles
          </button>
          <button
            className={`text-left px-3 py-2 rounded-lg font-semibold transition ${
              activeTab === "orders"
                ? "bg-lime-600 text-white shadow"
                : "hover:bg-lime-600 text-white"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            Historique des commandes
          </button>
        </nav>

        {/* Contenu principal */}
        <main className="flex-1 p-8">
          {activeTab === "infos" && (
            <div>
              <div className="flex flex-col items-center mb-6">
                <div className="relative flex items-center justify-center w-32 h-32 rounded-xl bg-gray-100 shadow-inner mx-auto mb-2">
                  {form.avatar_url ? (
                    <img
                      src={form.avatar_url}
                      alt="Photo de profil"
                      className="w-24 h-24 object-cover rounded-xl border-4 border-gray-200 shadow-lg transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src="/avatar-default.svg"
                      alt="Avatar par défaut"
                      className="w-24 h-24 object-cover rounded-xl border-4 border-gray-200 shadow-lg"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-2 right-2 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-150 focus:outline-none"
                    title="Changer la photo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" />
                    </svg>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl">
                      <span className="text-xs text-black">Upload...</span>
                    </div>
                  )}
                </div>
                <h1 className="text-xl font-bold mt-4 text-center text-black">Mon profil</h1>
              </div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleUpdateProfile();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black font-medium mb-1">Prénom</label>
                    <Input
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      required
                      className="h-10 text-base px-3 w-full border border-gray-200 focus:border-black focus:ring-black text-black bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-1">Nom</label>
                    <Input
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      required
                      className="h-10 text-base px-3 w-full border border-gray-200 focus:border-black focus:ring-black text-black bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-1">Email</label>
                    <Input
                      name="email"
                      value={form.email}
                      disabled
                      readOnly
                      className="h-10 text-base px-3 w-full bg-gray-100 border border-gray-200 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-1">Téléphone</label>
                    <Input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="h-10 text-base px-3 w-full border border-gray-200 focus:border-black focus:ring-black text-black bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-black font-medium mb-1">Adresse</label>
                    <Input
                      name="adresse"
                      value={form.adresse}
                      onChange={handleChange}
                      className="h-10 text-base px-3 w-full border border-gray-200 focus:border-black focus:ring-black text-black bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-1">Code Postal</label>
                    <Input
                      name="code_postal"
                      value={form.code_postal}
                      onChange={handleChange}
                      className="h-10 text-base px-3 w-full border border-gray-200 focus:border-black focus:ring-black text-black bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-black font-medium mb-1">Ville</label>
                    <Input
                      name="ville"
                      value={form.ville}
                      onChange={handleChange}
                      className="h-10 text-base px-3 w-full border border-gray-200 focus:border-black focus:ring-black text-black bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    disabled={loading || uploading}
                    className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-5 py-2 rounded-lg shadow transition-colors duration-150"
                  >
                    {loading ? "Modification..." : "Enregistrer les modifications"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "orders" && (

            <OrdersHistory />

          )}
        </main>
      </div>
    </div>
  );
}

// Composant pour l'historique des commandes
function OrdersHistory() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        } else {
          toast.error("Erreur lors du chargement des commandes");
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des commandes");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'pending': return 'En attente';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      case 'failed': return 'Échouée';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    // Les prix sont stockés en centimes, donc on divise par 100
    const priceInAED = price / 100;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'AED'
    }).format(priceInAED);
  };

  
  const getTrackingInfo = (order: OrderWithItems) => {
    switch (order.status) {
      case 'pending':
        return {
          step: 1,
          title: 'Commande confirmée',
          description: 'Votre commande a été reçue et est en cours de traitement',
          icon: '📋'
        };
      case 'paid':
        return {
          step: 2,
          title: 'Paiement reçu',
          description: 'Le paiement a été confirmé, préparation en cours',
          icon: '💳'
        };
      case 'shipped':
        return {
          step: 3,
          title: 'Expédiée',
          description: 'Votre commande a été expédiée',
          icon: '📦'
        };
      case 'delivered':
        return {
          step: 4,
          title: 'Livrée',
          description: 'Votre commande a été livrée',
          icon: '✅'
        };
      case 'cancelled':
        return {
          step: 0,
          title: 'Annulée',
          description: 'Cette commande a été annulée',
          icon: '❌'
        };
      case 'failed':
        return {
          step: 0,
          title: 'Échouée',
          description: 'Le paiement a échoué',
          icon: '⚠️'
        };
      default:
        return {
          step: 1,
          title: 'En cours',
          description: 'Traitement en cours',
          icon: '⏳'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500"></div>
        <p className="text-lime-700 mt-2">Chargement des commandes...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-lime-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-lime-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-lime-700 mb-2">Aucune commande</h2>
        <p className="text-lime-600 mb-6">Vous n'avez pas encore passé de commande.</p>
        <Button 
          onClick={() => router.push('/shop')} 
          className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors duration-150"
        >
          Découvrir nos produits
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-center text-lime-700">Historique des commandes</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-lime-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            
            <div className="p-6 border-b border-lime-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-lime-800">Commande #{order.id.slice(-8)}</h3>
                  <p className="text-sm text-lime-600">Passée le {formatDate(order.created_at)}</p>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <p className="text-lg font-bold text-lime-700">{formatPrice(order.total_amount)}</p>
                </div>
              </div>
            </div>

            
            <div className="p-6 border-b border-lime-100 bg-lime-50">
              <h4 className="font-medium text-lime-800 mb-4">Suivi de commande</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center text-white text-lg">
                    {getTrackingInfo(order).icon}
                  </div>
                  <div>
                    <p className="font-medium text-lime-800">{getTrackingInfo(order).title}</p>
                    <p className="text-sm text-lime-600">{getTrackingInfo(order).description}</p>
                  </div>
                </div>
              </div>
            </div>

           
            <div className="p-6">
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-lime-50 rounded-lg">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border border-lime-200"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-lime-800 truncate">{item.name}</h4>
                      <p className="text-sm text-lime-600">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lime-700">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-xs text-lime-500">{formatPrice(item.price)} l'unité</p>
                    </div>
                  </div>
                ))}
              </div>

             
              {order.shipping_address && (
                <div className="mt-6 p-4 bg-lime-50 rounded-lg">
                  <h4 className="font-medium text-lime-800 mb-2">Adresse de livraison</h4>
                  <div className="text-sm text-lime-700">
                    <p>{order.shipping_address.line1}</p>
                    {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                    <p>{order.shipping_address.postal_code} {order.shipping_address.city}</p>
                    <p>{order.shipping_address.country}</p>
                  </div>
                </div>
              )}

            
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
}