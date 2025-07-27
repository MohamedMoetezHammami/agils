import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  CreditCard,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight,
  User,
  LogOut,
  Shield,
  Eye,
  Stamp,
  Euro,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ManagerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalMissions: missions.length,
    approvedMissions: missions.filter(m => (m.statut) === "Validée").length,
    VReimbursement: missions.filter(m => (m.statut_remb) === "Validée").length,
    pendingReimbursement: missions.filter(m => (m.statut) === "En attente").length
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch missions for logged-in manager (all missions, not just pending)
  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        let userId = null;
        if (token) {
          try {
            const decoded: any = jwtDecode(token);
            userId = decoded.id || decoded.userId || null;
            setUserName(decoded.nom_et_prenom || 'Manager');
          } catch (e) {}
        }
        if (!userId) throw new Error("Utilisateur non authentifié");
        // Fetch all missions for this manager
        const res = await axios.get(`http://localhost:8010/api/user-missions?userId=${userId}`);
        setMissions(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || "Erreur lors du chargement des missions");
      }
      setLoading(false);
    };
    fetchMissions();
  }, []);

  // Calculate stats
  useEffect(() => {
    console.log('Missions updated:', missions);
    const total = missions.length;
    const approved = missions.filter(m => m.statut === "Validée").length;
    const validatedReimbursement = missions.filter(m => m.statut_remb === "Validée").length;
    const pending = missions.filter(m => m.statut === "En attente").length;
    
    console.log('Calculated stats:', { total, approved, validatedReimbursement, pending });
    
    setStats({
      totalMissions: total,
      approvedMissions: approved,
      VReimbursement: validatedReimbursement,
      pendingReimbursement: pending
    });
  }, [missions]);


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "En attente":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case "Validée":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Validée</Badge>;
      case "Remboursée":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Euro className="w-3 h-3 mr-1" />Remboursée</Badge>;
      case "Refusée":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" />Refusée</Badge>;
      // case "Brouillon":
      //   return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100"><FileText className="w-3 h-3 mr-1" />Brouillon</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Unified search/filter for table
  const filteredMissions = missions.filter(mission => {
    const matchesSearch = (mission.Destination || mission.destination || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mission.objet || mission.Objet || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || (mission.statut_remb || mission.statut) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-purple-400 hover:text-purple-300">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Espace Manager</h1>
                <p className="text-sm text-gray-300">Gestion et validation des missions</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-300">Connecté en tant que</p>
                <p className="font-medium text-white">{userName}</p>
              </div>
              {/* <Button variant="outline" size="sm" className="text-gray-300 border-gray-600 hover:bg-gray-800">
                <User className="w-4 h-4 mr-2" />
                Profil
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
            Tableau de Bord Manager 📊
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
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-gray-300">Chargement des statistiques...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-red-400 font-semibold">{error}</span>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Missions</p>
                  <p className="text-3xl font-bold">{stats.totalMissions}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Valider</p>
                  <p className="text-3xl font-bold">{stats.approvedMissions}</p>
                </div>
                <Stamp className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Rembourser</p>
                  <p className="text-3xl font-bold">{stats.VReimbursement}</p>
                </div>
                <CreditCard className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">En attente</p>
                  <p className="text-3xl font-bold">{stats.pendingReimbursement}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Actions principales */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="hover:shadow-lg transition-shadow bg-gray-900/90 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Shield className="w-5 h-5 mr-2 text-purple-400" />
                Actions Manager
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Link to="/manager/validation_mission">
                <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium">
                  <Stamp className="w-4 h-4 mr-2" />
                  Validation d'Ordre de Mission
                </Button>
              </Link>

              <Link to="/manger/nouvelle_mission">
                <Button variant="outline" className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Saisie d'Ordre de Mission
                </Button>
              </Link>

              <Link to="/manager/mes_missions">
                <Button variant="outline" className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800">
                  <Eye className="w-4 h-4 mr-2" />
                  Mes Missions
                </Button>
              </Link>

              {/* <Link to="/manager/suivi_remboursements">
                <Button variant="outline" className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Suivi Remboursements
                </Button>
              </Link> */}

              <Link to="/manager/retour_mission">
                <Button variant="outline" className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Retour Mission
                </Button>
              </Link>

            </CardContent>
          </Card>

          {/* <Card className="hover:shadow-lg transition-shadow bg-gray-900/90 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Missions à Traiter</CardTitle>
              <CardDescription className="text-gray-300">
                Missions en attente de validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMissions.map((mission) => (
                  <div key={mission.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{mission.employee || mission.nom_et_prenom || mission.name || "Employé"}</p>
                      <p className="text-sm text-gray-300">{mission.destination} - {mission.date || mission.date_mission}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(mission.status)}>
                        {mission.status}
                      </Badge>
                      <p className="text-sm text-gray-300 mt-1">{mission.amount || mission.frais || ""}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 text-gray-300 border-gray-600 hover:bg-gray-800">
                Voir toutes les missions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card> */}
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;