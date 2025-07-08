"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  

interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);


  const supabase = createClient();

  
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        toast.error("Erreur lors du chargement des catégories");
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement des catégories");
    } finally {
      setLoading(false);
    }
  };

  
  const createCategory = async () => {
    if (!newCategory.name.trim()) return;

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([
          {
            name: newCategory.name.trim(),
            description: newCategory.description.trim() || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la création:", error);
        return;
      }

      setCategories([data, ...categories]);
      setNewCategory({ name: "", description: "" });
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    if (!id) return;
  
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
  
      if (error) {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Erreur lors de la suppression");
        return;
      }
  
      setCategories(categories.filter((cat) => cat.id !== id));
      toast.success("Catégorie supprimée");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur inattendue");
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };
  

  
  const updateCategory = async (id: string) => {
    if (!editForm.name.trim()) return;

    try {
      const { data, error } = await supabase
        .from("categories")
        .update({
          name: editForm.name.trim(),
          description: editForm.description.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la modification:", error);
        return;
      }

      setCategories(
        categories.map((cat) => (cat.id === id ? data : cat))
      );
      setEditingId(null);
      setEditForm({ name: "", description: "" });
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  
  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditForm({
      name: category.name,
      description: category.description || "",
    });
  };

  
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", description: "" });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement des catégories...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Catégories</h1>
      </div>

      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nouvelle Catégorie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Nom de la catégorie"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
            />
            <Input
              placeholder="Description (optionnel)"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
            />
            <Button
              onClick={createCategory}
              disabled={isCreating || !newCategory.name.trim()}
              className="w-full md:w-auto"
            >
              {isCreating ? "Création..." : "Créer"}
            </Button>
          </div>
        </CardContent>
      </Card>

      
      <Card>
        <CardHeader>
          <CardTitle>Liste des Catégories ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune catégorie trouvée. Créez votre première catégorie !
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      {editingId === category.id ? (
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="w-full"
                        />
                      ) : (
                        <span className="font-medium">{category.name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === category.id ? (
                        <Input
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                          }
                          className="w-full"
                        />
                      ) : (
                        <span className="text-muted-foreground">
                          {category.description || "Aucune description"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(category.created_at).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === category.id ? (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            onClick={() => updateCategory(category.id)}
                          >
                            Sauvegarder
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                          >
                            Annuler
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                                setCategoryToDelete(category);
                                setDeleteDialogOpen(true);
                            }}
                            >
                            <Trash2 className="h-4 w-4" />
                            </Button>
                            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle>Supprimer la catégorie</DialogTitle>
                                </DialogHeader>
                                <p>Êtes-vous sûr de vouloir supprimer la catégorie <strong>{categoryToDelete?.name}</strong> ? Cette action est irréversible.</p>
                                <DialogFooter className="mt-4">
                                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                    Annuler
                                </Button>
                                <Button variant="destructive" onClick={() => handleDeleteConfirm(category.id)}>
                                    Supprimer
                                </Button>
                                </DialogFooter>
                            </DialogContent>
                            </Dialog>

                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

