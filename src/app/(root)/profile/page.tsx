"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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
    <div className="flex min-h-screen items-center justify-center bg-lime-100 pt-16">
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
                <div className="relative flex items-center justify-center w-32 h-32 rounded-xl bg-lime-100 shadow-inner mx-auto mb-2">
                  {form.avatar_url ? (
                    <img
                      src={form.avatar_url}
                      alt="Photo de profil"
                      className="w-24 h-24 object-cover rounded-xl border-4 border-lime-200 shadow-lg transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src="/avatar-default.svg"
                      alt="Avatar par défaut"
                      className="w-24 h-24 object-cover rounded-xl border-4 border-lime-200 shadow-lg"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-2 right-2 bg-white border border-lime-300 rounded-full p-2 shadow-md hover:bg-lime-100 transition-colors duration-150 focus:outline-none"
                    title="Changer la photo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lime-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      <span className="text-xs text-lime-700">Upload...</span>
                    </div>
                  )}
                </div>
                <h1 className="text-xl font-bold mt-4 text-center text-lime-700">Mon profil</h1>
              </div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleUpdateProfile();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lime-700 font-medium mb-1">Prénom</label>
                    <Input
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      required
                      className="h-10 text-base px-3 w-full border border-lime-200 focus:border-lime-500 focus:ring-lime-500"
                    />
                  </div>
                  <div>
                    <label className="block text-lime-700 font-medium mb-1">Nom</label>
                    <Input
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      required
                      className="h-10 text-base px-3 w-full border border-lime-200 focus:border-lime-500 focus:ring-lime-500"
                    />
                  </div>
                  <div>
                    <label className="block text-lime-700 font-medium mb-1">Email</label>
                    <Input
                      name="email"
                      value={form.email}
                      disabled
                      readOnly
                      className="h-10 text-base px-3 w-full bg-lime-100 border border-lime-200 text-lime-600"
                    />
                  </div>
                  <div>
                    <label className="block text-lime-700 font-medium mb-1">Téléphone</label>
                    <Input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="h-10 text-base px-3 w-full border border-lime-200 focus:border-lime-500 focus:ring-lime-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-lime-700 font-medium mb-1">Adresse</label>
                    <Input
                      name="adresse"
                      value={form.adresse}
                      onChange={handleChange}
                      className="h-10 text-base px-3 w-full border border-lime-200 focus:border-lime-500 focus:ring-lime-500"
                    />
                  </div>
                  <div>
                    <label className="block text-lime-700 font-medium mb-1">Code Postal</label>
                    <Input
                      name="code_postal"
                      value={form.code_postal}
                      onChange={handleChange}
                      className="h-10 text-base px-3 w-full border border-lime-200 focus:border-lime-500 focus:ring-lime-500"
                    />
                  </div>
                  <div>
                    <label className="block text-lime-700 font-medium mb-1">Ville</label>
                    <Input
                      name="ville"
                      value={form.ville}
                      onChange={handleChange}
                      className="h-10 text-base px-3 w-full border border-lime-200 focus:border-lime-500 focus:ring-lime-500"
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
            <div>
              <h2 className="text-lg font-bold mb-4 text-center text-lime-700">Historique des commandes</h2>
              <div className="bg-lime-100 border rounded-lg p-4 text-lime-700 text-center text-sm">
                {/* À remplacer par la vraie liste de commandes */}
                Aucun historique pour le moment.
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}