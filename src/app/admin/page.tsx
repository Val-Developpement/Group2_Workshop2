"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";
import { 
  Users, 
  ShoppingBag, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Eye,
  DollarSign,
  Activity,
  UserCheck
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardStats {
  users: {
    total: number;
    admins: number;
    newThisMonth: number;
    growthRate: number;
  };
  articles: {
    total: number;
    published: number;
    drafts: number;
    totalViews: number;
    avgViews: number;
  };
  products: {
    total: number;
    categories: number;
  };
  signalements: {
    total: number;
    nouveaux: number;
    enCours: number;
    urgents: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'user' | 'article' | 'signalement' | 'product';
  action: string;
  details: string;
  timestamp: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    users: { total: 0, admins: 0, newThisMonth: 0, growthRate: 0 },
    articles: { total: 0, published: 0, drafts: 0, totalViews: 0, avgViews: 0 },
    products: { total: 0, categories: 0 },
    signalements: { total: 0, nouveaux: 0, enCours: 0, urgents: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  const supabase = createClient();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Statistiques utilisateurs
      const { data: users } = await supabase
        .from('profiles')
        .select('id, isAdmin, created_at');

      const currentMonth = new Date();
      currentMonth.setDate(1);
      const newUsersThisMonth = users?.filter(user => 
        new Date(user.created_at) >= currentMonth
      ).length || 0;

      // Statistiques articles
      const { data: articles } = await supabase
        .from('articles')
        .select('id, statut, vues, created_at, published_at');

      const totalViews = articles?.reduce((sum, article) => sum + (article.vues || 0), 0) || 0;

      // Statistiques produits
      const { data: products } = await supabase
        .from('products')
        .select('id, created_at');

      const { data: categories } = await supabase
        .from('categories')
        .select('id');

      // Statistiques signalements
      const { data: signalements } = await supabase
        .from('signalements')
        .select('id, statut, priorite, created_at');

      // Calculer les stats
      const dashboardStats: DashboardStats = {
        users: {
          total: users?.length || 0,
          admins: users?.filter(u => u.isAdmin).length || 0,
          newThisMonth: newUsersThisMonth,
          growthRate: users?.length ? Math.round((newUsersThisMonth / users.length) * 100) : 0
        },
        articles: {
          total: articles?.length || 0,
          published: articles?.filter(a => a.statut === 'publie').length || 0,
          drafts: articles?.filter(a => a.statut === 'brouillon').length || 0,
          totalViews,
          avgViews: articles?.length ? Math.round(totalViews / articles.length) : 0
        },
        products: {
          total: products?.length || 0,
          categories: categories?.length || 0
        },
        signalements: {
          total: signalements?.length || 0,
          nouveaux: signalements?.filter(s => s.statut === 'nouveau').length || 0,
          enCours: signalements?.filter(s => s.statut === 'en_cours').length || 0,
          urgents: signalements?.filter(s => s.priorite === 'urgente').length || 0
        }
      };

      setStats(dashboardStats);

      // Données pour graphiques
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const chartData = last7Days.map(date => {
        const dayUsers = users?.filter(user => 
          user.created_at.startsWith(date)
        ).length || 0;
        
        const dayArticles = articles?.filter(article => 
          article.created_at.startsWith(date)
        ).length || 0;

        const daySignalements = signalements?.filter(signalement => 
          signalement.created_at.startsWith(date)
        ).length || 0;

        return {
          date: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
          users: dayUsers,
          articles: dayArticles,
          signalements: daySignalements
        };
      });

      setChartData(chartData);

      // Données pour graphique en secteurs
      const pieData = [
        { name: 'Articles publiés', value: dashboardStats.articles.published, color: '#0088FE' },
        { name: 'Brouillons', value: dashboardStats.articles.drafts, color: '#00C49F' },
        { name: 'Signalements', value: dashboardStats.signalements.total, color: '#FFBB28' },
        { name: 'Produits', value: dashboardStats.products.total, color: '#FF8042' }
      ];

      setPieData(pieData);

      // Activité récente simulée basée sur les vraies données
      const activities: RecentActivity[] = [
        {
          id: '1',
          type: 'user',
          action: 'Nouvel utilisateur inscrit',
          details: `${newUsersThisMonth} nouveaux utilisateurs ce mois`,
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          type: 'article',
          action: 'Articles créés',
          details: `${dashboardStats.articles.total} articles au total`,
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          type: 'signalement',
          action: 'Signalements reçus',
          details: `${dashboardStats.signalements.nouveaux} nouveaux signalements`,
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ];

      setRecentActivity(activities);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600">Vue d'ensemble de votre plateforme APwAP</p>
        </div>
        <Button onClick={loadDashboardData} variant="outline">
          <Activity className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.total}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.users.newThisMonth} ce mois ({stats.users.growthRate}%)
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{stats.users.admins} admins</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles Blog</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.articles.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.articles.published} publiés, {stats.articles.drafts} brouillons
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Eye className="w-3 h-3" />
              <span className="text-xs">{stats.articles.totalViews} vues total</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.products.categories} catégories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signalements</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.signalements.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.signalements.nouveaux} nouveaux
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="destructive" className="text-xs">
                {stats.signalements.urgents} urgents
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métriques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vues Moyennes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.articles.avgViews}</div>
            <p className="text-xs text-muted-foreground">par article</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux Admin</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.users.total ? Math.round((stats.users.admins / stats.users.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">des utilisateurs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signalements Actifs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.signalements.enCours}</div>
            <p className="text-xs text-muted-foreground">en cours de traitement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Croissance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{stats.users.growthRate}%</div>
            <p className="text-xs text-muted-foreground">utilisateurs ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité des 7 derniers jours</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#0088FE" name="Utilisateurs" />
                <Bar dataKey="articles" fill="#00C49F" name="Articles" />
                <Bar dataKey="signalements" fill="#FFBB28" name="Signalements" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition du contenu</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleTimeString('fr-FR')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 