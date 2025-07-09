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
import { Edit, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface Profile {
  id: string; // match Supabase auth.user id
  first_name: string;
  last_name: string;
  email: string;
  isAdmin: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ first_name: "", last_name: "", isAdmin: false });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);

  const supabase = createClient();

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*");

    if (error) {
      toast.error("Erreur lors du chargement des utilisateurs");
      console.error(error);
    } else {
      setProfiles(data as Profile[]);
    }
    setLoading(false);
  };

  const updateProfile = async (id: string) => {
    const { error, data } = await supabase
      .from("profiles")
      .update(editForm)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
      return;
    }

    setProfiles(profiles.map(p => p.id === id ? data : p));
    toast.success("Utilisateur modifié");
    cancelEdit();
  };

  const deleteProfile = async () => {
    const id = profileToDelete?.id;
    if (!id) return;

    try {
      const { error: profileError } = await supabase.from("profiles").delete().eq("id", id);
      const { error: userError } = await supabase.auth.admin.deleteUser(id);

      if (profileError || userError) {
        console.error("Erreur lors de la suppression:", profileError || userError);
        toast.error("Erreur lors de la suppression");
        return;
      }

      setProfiles(profiles.filter((p) => p.id !== id));
      toast.success("Utilisateur supprimé");
    } catch (error) {
      console.error(error);
      toast.error("Erreur inattendue");
    } finally {
      setProfileToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const startEdit = (profile: Profile) => {
    setEditingId(profile.id);
    setEditForm({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      isAdmin: profile.isAdmin || false,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ first_name: "", last_name: "", isAdmin: false });
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs ({profiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Chargement...</div>
          ) : profiles.length === 0 ? (
            <div className="text-center text-muted-foreground">Aucun utilisateur trouvé.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      {editingId === profile.id ? (
                        <Input
                          value={editForm.first_name}
                          onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                        />
                      ) : (
                        profile.first_name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === profile.id ? (
                        <Input
                          value={editForm.last_name}
                          onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                        />
                      ) : (
                        profile.last_name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === profile.id ? (
                        <Switch
                          checked={editForm.isAdmin}
                          onCheckedChange={(val: boolean) => setEditForm({ ...editForm, isAdmin: val })}
                        />
                      ) : (
                        profile.isAdmin ? "Oui" : "Non"
                      )}
                    </TableCell>
                    <TableCell>
                      {profile.email}
                    </TableCell>
                    <TableCell>
                      {new Date(profile.created_at).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === profile.id ? (
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" onClick={() => updateProfile(profile.id)}>Sauvegarder</Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>Annuler</Button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline" onClick={() => startEdit(profile)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setProfileToDelete(profile);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'utilisateur</DialogTitle>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{profileToDelete?.first_name} {profileToDelete?.last_name}</strong> ?
            Cette action supprimera aussi son compte.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={deleteProfile}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
