"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ShoppingCart, Star, Heart, Eye } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stripe_product_id: string;
  category_id?: string;
  created_at: string;
  categories?: {
    id: string;
    name: string;
    description?: string;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function StorePage() {
  const supabase = createClient();
  const { addItem } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [wishlist, setWishlist] = useState<string[]>([]);

  const fetchProducts = async () => {
    try {
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
        console.error("Erreur lors du chargement des produits:", error);
        return;
      }

      setProducts(data as Product[]);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        return;
      }

      setCategories(data as Category[]);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

 
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      stripe_product_id: product.stripe_product_id,
    });
    toast.success(`${product.name} ajouté au panier !`);
  };

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg">Chargement de la boutique...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
        <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Notre Boutique</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de produits de qualité, soigneusement choisis pour vous.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar des filtres */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres
              </h3>
              
              <div className="space-y-6">
                {/* Recherche */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Recherche
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Catégories */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Catégorie
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tri */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Trier par
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Plus récents</SelectItem>
                      <SelectItem value="price-low">Prix croissant</SelectItem>
                      <SelectItem value="price-high">Prix décroissant</SelectItem>
                      <SelectItem value="name">Nom A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Prix */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Prix maximum: {priceRange[1]} AED
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 AED</span>
                    <span>{priceRange[1]} AED</span>
                  </div>
                </div>

                {/* Résultats */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Zone des produits */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart 
                    className={`h-4 w-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                  />
                </Button>
                {product.categories && (
                  <Badge className="absolute top-2 left-2 bg-lime-500 text-white">
                    {product.categories.name}
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">(4.8)</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">{product.price} AED</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-lime-500 hover:bg-lime-600 text-white"
                    disabled={!product.stripe_product_id}
                  >
                     <ShoppingCart className="h-4 w-4 mr-2" />
                     Ajouter au panier
                  </Button>
                </div>
              </CardContent>
            </Card>
              ))}
            </div>

            {/* Message si aucun produit trouvé */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-600">
                  Essayez de modifier vos critères de recherche ou vos filtres.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
