'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  FileText,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Article {
  id: string;
  titre: string;
  slug: string;
  extrait: string;
  categorie: string;
  statut: 'brouillon' | 'publie' | 'archive';
  published_at: string | null;
  created_at: string;
  vues: number;
  profiles: {
    first_name: string;
    last_name: string;
  }[] | null;
}

interface Stats {
  total: number;
  publies: number;
  brouillons: number;
  vues_totales: number;
}

export default function BlogAdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    publies: 0,
    brouillons: 0,
    vues_totales: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; article: Article | null }>({
    open: false,
    article: null
  });

  // Charger les articles
  const loadArticles = async () => {
    try {
          const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (statusFilter && statusFilter !== 'all') params.append('statut', statusFilter);
    if (categoryFilter && categoryFilter !== 'all') params.append('categorie', categoryFilter);
    params.append('limit', '100');

      const response = await fetch(`/api/blog?${params}`);
      const data = await response.json();

      if (response.ok) {
        setArticles(data.articles);
        
        // Calculer les stats
        const total = data.articles.length;
        const publies = data.articles.filter((a: Article) => a.statut === 'publie').length;
        const brouillons = data.articles.filter((a: Article) => a.statut === 'brouillon').length;
        const vues_totales = data.articles.reduce((sum: number, a: Article) => sum + a.vues, 0);
        
        setStats({ total, publies, brouillons, vues_totales });

        // Extraire les catégories uniques
        const uniqueCategories = [...new Set(data.articles.map((a: Article) => a.categorie).filter(Boolean))] as string[];
        setCategories(uniqueCategories);
      } else {
        toast.error(data.error || 'Erreur lors du chargement des articles');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un article
  const handleDelete = async (article: Article) => {
    try {
      const response = await fetch(`/api/blog/${article.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Article supprimé avec succès');
        setDeleteDialog({ open: false, article: null });
        loadArticles();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  // Changer le statut d'un article
  const handleStatusChange = async (article: Article, newStatus: string) => {
    try {
      const response = await fetch(`/api/blog/${article.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...article,
          statut: newStatus,
        }),
      });

      if (response.ok) {
        toast.success('Statut mis à jour avec succès');
        loadArticles();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  useEffect(() => {
    loadArticles();
  }, [search, statusFilter, categoryFilter]);

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'publie':
        return <Badge variant="default">Publié</Badge>;
      case 'brouillon':
        return <Badge variant="secondary">Brouillon</Badge>;
      case 'archive':
        return <Badge variant="outline">Archivé</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto mb-4"></div>
          <p>Chargement des articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestion du Blog</h1>
          <p className="text-gray-600">Gérez vos articles et contenus</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/nouveau">
            <Plus className="w-4 h-4 mr-2" />
            Nouvel article
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publiés</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.publies}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brouillons</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.brouillons}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vues totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.vues_totales}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un article..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === 'all' ? '' : value)}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="publie">Publié</SelectItem>
            <SelectItem value="brouillon">Brouillon</SelectItem>
            <SelectItem value="archive">Archivé</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter || "all"} onValueChange={(value) => setCategoryFilter(value === 'all' ? '' : value)}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table des articles */}
      <Card>
        <CardHeader>
          <CardTitle>Articles ({articles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Vues</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{article.titre}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {article.extrait}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{article.categorie}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(article.statut)}</TableCell>
                  <TableCell>
                    {article.profiles && article.profiles.length > 0
                      ? `${article.profiles[0].first_name} ${article.profiles[0].last_name}`
                      : 'Anonyme'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      {article.vues}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString('fr-FR')
                        : new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/blog/${article.id}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/blog/${article.slug}`} target="_blank">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </Link>
                        </DropdownMenuItem>
                        {article.statut === 'brouillon' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(article, 'publie')}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Publier
                          </DropdownMenuItem>
                        )}
                        {article.statut === 'publie' && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(article, 'archive')}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Archiver
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => setDeleteDialog({ open: true, article })}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de suppression */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, article: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Êtes-vous sûr de vouloir supprimer l'article "{deleteDialog.article?.titre}" ?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Cette action est irréversible.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, article: null })}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog.article && handleDelete(deleteDialog.article)}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 