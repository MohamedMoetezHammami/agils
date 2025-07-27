
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  Shield, 
  Users, 
  Car, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  User,
  LogOut,
  Settings,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface DashboardStats {
  totalEmployees: number;
  totalVehicles: number;
  pendingMissions: number;
  monthlyBudget: string;
  approvalRate: number;
}

const BackOfficeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalVehicles: 0,
    pendingMissions: 0,
    monthlyBudget: "0€",
    approvalRate: 0
  });
  const [loading, setLoading] = useState({
    employees: true,
    vehicles: true
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Fetch employee count
    const fetchEmployeeCount = async () => {
      try {
        const response = await axios.get('http://localhost:8010/api/backoffice/personnel/count');
        setStats(prev => ({
          ...prev,
          totalEmployees: response.data.count || 0
        }));
      } catch (err) {
        console.error('Error fetching employee count:', err);
        setError('Erreur lors du chargement du nombre de personnel');
        toast.error('Erreur lors du chargement du nombre de personnel');
      } finally {
        setLoading(prev => ({ ...prev, employees: false }));
      }
    };

    // Fetch vehicle count
    const fetchVehicleCount = async () => {
      try {
        const response = await axios.get('http://localhost:8010/api/backoffice/vehicles/count');
        setStats(prev => ({
          ...prev,
          totalVehicles: response.data.count || 0
        }));
      } catch (err) {
        console.error('Error fetching vehicle count:', err);
        setError('Erreur lors du chargement du nombre de véhicules');
        toast.error('Erreur lors du chargement du nombre de véhicules');
      } finally {
        setLoading(prev => ({ ...prev, vehicles: false }));
      }
    };

    fetchEmployeeCount();
    fetchVehicleCount();

    return () => {
      clearInterval(timer);
    };
  }, []);

  const recentActivities = [
    
    { id: 3, type: "Véhicule", user: "Pierre Durand", action: "Nouveau véhicule ajouté", time: "Il y a 6h", status: "info" },
    { id: 4, type: "Personnel", user: "Sophie Leblanc", action: "Profil mis à jour", time: "Il y a 1j", status: "info" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "completed": return <Users className="w-4 h-4 text-green-500" />;
      case "info": return <FileText className="w-4 h-4 text-blue-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-orange-500 hover:text-orange-400">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Administration</h1>
                <p className="text-sm text-gray-300">Tableau de bord administrateur</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-300">Administrateur</p>
                <p className="font-medium text-white">Admin System</p>
              </div>
              {/* <Button variant="outline" size="sm" className="text-gray-300 border-gray-600 hover:bg-gray-800">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button> */}
              <Link to="/">
                <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300 border-red-600 hover:bg-red-900/20">
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Tableau de Bord Administrateur 🛡️
          </h2>
          <p className="text-gray-300">
            {currentTime.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Personnel</p>
                  {loading.employees ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <p className="text-3xl font-bold">{stats.totalEmployees}</p>
                  )}
                </div>
                <Users className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Véhicules</p>
                  {loading.vehicles ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <p className="text-3xl font-bold">{stats.totalVehicles}</p>
                  )}
                </div>
                <Car className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-200">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Management Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Gestion du Personnel */}
          <Card className="hover:shadow-lg transition-shadow bg-gray-900/90 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Users className="w-5 h-5 mr-2 text-orange-500" />
                Gestion du Personnel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/backoffice/ajouter_employe">
                <Button className="w-full justify-start bg-orange-600 hover:bg-orange-700">
                  <Users className="w-4 h-4 mr-2" />
                  Ajouter un employé
                </Button>
              </Link>
              <Link to="/backoffice/liste_personnel">
                <Button variant="outline" className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800">
                  <FileText className="w-4 h-4 mr-2" />
                  Liste du personnel
                </Button>
              </Link>
              <Link to="/backoffice/modifierprofils">
                <Button variant="outline" className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800">
                  <Settings className="w-4 h-4 mr-2" />
                  Modifier profils
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Gestion des Véhicules */}
          <Card className="hover:shadow-lg transition-shadow bg-gray-900/90 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Car className="w-5 h-5 mr-2 text-red-500" />
                Gestion des Véhicules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/backoffice/add_vehicle">
                <Button className="w-full justify-start bg-red-600 hover:bg-red-700">
                  <Car className="w-4 h-4 mr-2" />
                  Ajouter un véhicule
                </Button>
              </Link>
              <Link to="/backoffice/parc_automobile">
                <Button variant="outline" className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800">
                  <FileText className="w-4 h-4 mr-2" />
                  Parc automobile
                </Button>
              </Link>
              {/* <Link to="/backoffice/maintenance">
                <Button variant="outline" className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800">
                  <Settings className="w-4 h-4 mr-2" />
                  Maintenance
                </Button>
              </Link> */}
            </CardContent>
          </Card>

          {/* Gestion des Missions 
          <Card className="hover:shadow-lg transition-shadow bg-gray-900/90 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <FileText className="w-5 h-5 mr-2 text-green-500" />
                Gestion des Missions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/nouvelle-mission">
                <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Nouvelle Mission
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800">
                <AlertCircle className="w-4 h-4 mr-2" />
                Missions en attente
              </Button>
              <Button variant="outline" className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800">
                <TrendingUp className="w-4 h-4 mr-2" />
                Historique complet
              </Button>
              <Button variant="outline" className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800">
                <FileText className="w-4 h-4 mr-2" />
                Rapports
              </Button>
            </CardContent>
          </Card>*/}
        </div>

        {/* Recent Activities */}
        {/* <Card className="hover:shadow-lg transition-shadow bg-gray-900/90 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Activités Récentes</CardTitle>
            <CardDescription className="text-gray-300">
              Dernières actions dans le système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(activity.status)}
                    <div>
                      <p className="font-medium text-white">
                        {activity.type} - {activity.user}
                      </p>
                      <p className="text-sm text-gray-300">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </main>
    </div>
  );
};

export default BackOfficeDashboard;
