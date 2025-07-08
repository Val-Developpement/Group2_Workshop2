"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, Plus, ShoppingCart, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stripe_product_id: string;
  category_id?: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export default function AdminProductsPage() {
  const supabase = createClient();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category_id: "",
    image: null as File | null,
  });



  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories (
          id,
          name,
          description
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erreur lors du chargement des produits");
      return;
    }

    setProducts(data as Product[]);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      toast.error("Erreur lors du chargement des catégories");
      return;
    }

    setCategories(data as Category[]);
  };

  const uploadImage = async (file: File) => {
    const filePath = `${Date.now()}_${file.name}`;
    
    try {
      const { data, error } = await supabase.storage.from("images").upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

      if (error) {
        console.error("Erreur upload:", error);
        toast.error("Erreur lors de l'upload de l'image: " + error.message);
        return null;
      }

      const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath);
      return urlData?.publicUrl || null;
    } catch (err) {
      console.error("Erreur générale upload:", err);
      toast.error("Erreur générale lors de l'upload: " + (err as Error).message);
      return null;
    }
  };

  const createProduct = async () => {
    
   
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      toast.error("Veuillez remplir tous les champs (nom, prix, image)");
      return;
    }

    const image_url = await uploadImage(newProduct.image);
    if (!image_url) {
      return;
    }

    try {
      const stripeRes = await fetch("/api/create-stripe-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price * 100,
          imageUrl: image_url,
        }),
      });

      const stripeData = await stripeRes.json();

      if (!stripeRes.ok) {
        console.error("Erreur Stripe:", stripeData);
        toast.error("Erreur lors de la création sur Stripe: " + stripeData.error);
        return;
      }

     
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.price,
            image_url,
            stripe_product_id: stripeData.productId,
            category_id: newProduct.category_id || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Erreur Supabase:", error);
        toast.error("Erreur lors de la création en base de données: " + error.message);
        return;
      }

     
      setProducts([data, ...products]);
      setNewProduct({ name: "", description: "", price: 0, category_id: "", image: null });
      toast.success("Produit créé avec succès sur Stripe et en base de données !");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Erreur lors de la création du produit: " + (error as Error).message);
    }
  };





  const deleteProduct = async () => {
    const id = productToDelete?.id;
    if (!id) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Erreur lors de la suppression");
      return;
    }

    setProducts(products.filter((p) => p.id !== id));
    setDeleteDialogOpen(false);
    setProductToDelete(null);
    toast.success("Produit supprimé");
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Produits</h1>
      </div>

     
      <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-6 w-6 text-black" />
            Nouveau Produit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Nom du produit</Label>
                <Input
                  id="name"
                  placeholder="Ex: iPhone 15 Pro"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre produit..."
                  value={newProduct.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-sm font-medium">Prix (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category" className="text-sm font-medium">Catégorie</Label>
                  <Select
                    value={newProduct.category_id}
                    onValueChange={(value) => setNewProduct({ ...newProduct, category_id: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
           
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Image du produit</Label>
                <div className="mt-1">
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      {newProduct.image ? (
                        <div className="space-y-2">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="text-sm text-gray-600">
                            {newProduct.image.name}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setNewProduct({ ...newProduct, image: null })}
                          >
                            Changer l'image
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2"
                            >
                              <span>Télécharger un fichier</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    setNewProduct({ ...newProduct, image: e.target.files[0] });
                                  }
                                }}
                              />
                            </label>
                            <p className="pl-1">ou glisser-déposer</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={createProduct} 
                className="w-full"
                disabled={!newProduct.name || !newProduct.price || !newProduct.image}
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer le produit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      
      <Card>
        <CardHeader>
          <CardTitle>Produits ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Stripe</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.image_url && (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded shadow-sm"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {product.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {product.category_id && categories.find(c => c.id === product.category_id)?.name || (
                    <span className="text-gray-400 text-sm">Aucune catégorie</span>
                  )}
                </TableCell>
                <TableCell className="font-semibold">{product.price}€</TableCell>
                <TableCell>
                  {product.stripe_product_id ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Connecté</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-sm text-gray-500">Non connecté</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {product.stripe_product_id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`https://dashboard.stripe.com/products/${product.stripe_product_id}`, '_blank')}
                        title="Voir sur Stripe"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setProductToDelete(product);
                        setDeleteDialogOpen(true);
                      }}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      </Card>

     
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce produit ?</DialogTitle>
          </DialogHeader>
          <p>Le produit <strong>{productToDelete?.name}</strong> sera supprimé définitivement.</p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={deleteProduct}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
