"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    new_password: "",
  });

  const supabase = createClient();

  // Récupérer le profil de l'utilisateur connecté
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
        password: "",
        new_password: "",
      });
      setLoading(false);
    };
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  // Gérer la modification du profil
  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);

    // Mise à jour du profil dans la table "profiles"
    const { error: profileError, data: updatedProfile } = await supabase
      .from("profiles")
      .update({
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
      })
      .eq("id", profile.id)
      .select()
      .single();

    // Mise à jour de l'email (auth)
    let authError = null;
    if (form.email !== profile.email) {
      const { error } = await supabase.auth.updateUser({ email: form.email });
      if (error) authError = error;
    }

    // Mise à jour du mot de passe (auth)
    let passwordError = null;
    if (form.new_password) {
      const { error } = await supabase.auth.updateUser({ password: form.new_password });
      if (error) passwordError = error;
    }

    if (profileError || authError || passwordError) {
      toast.error(
        profileError?.message ||
        authError?.message ||
        passwordError?.message ||
        "Erreur lors de la mise à jour"
      );
    } else {
      setProfile({ ...updatedProfile, email: form.email });
      toast.success("Profil mis à jour !");
      setEditMode(false);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement du profil...</div>;
  }

  if (!profile) {
    return (
      <div className="p-8 text-center text-red-500">Aucun profil trouvé.</div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-16 bg-white rounded-lg shadow p-10 space-y-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Mon profil</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium mb-2">Prénom</label>
            <Input
              name="first_name"
              value={editMode ? form.first_name : profile.first_name}
              disabled={!editMode}
              onChange={(e) =>
                setForm((f) => ({ ...f, first_name: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nom</label>
            <Input
              name="last_name"
              value={editMode ? form.last_name : profile.last_name}
              disabled={!editMode}
              onChange={(e) =>
                setForm((f) => ({ ...f, last_name: e.target.value }))
              }
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Adresse email</label>
            <Input
              name="email"
              type="email"
              value={profile.email}
              disabled
              readOnly
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Téléphone</label>
            <Input
              name="phone"
              type="tel"
              value={editMode ? form.phone : profile.phone || ""}
              disabled={!editMode}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="06 12 34 56 78"
            />
          </div>
        </div>
        <div className="flex gap-4 mt-8 justify-center">
          {editMode ? (
            <>
              <Button type="submit" disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditMode(false);
                  setForm({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    email: profile.email,
                    phone: profile.phone || "",
                    password: "",
                    new_password: "",
                  });
                }}
                disabled={loading}
              >
                Annuler
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setEditMode(true)}>
              Modifier mes informations
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}