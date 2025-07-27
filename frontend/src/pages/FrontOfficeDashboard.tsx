
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
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const FrontOfficeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
            // Extract user name from token
            setUserName(decoded.nom_et_prenom);
          } catch (e) {}
        }
        if (!userId) throw new Error("Utilisateur non authentifié");
        const res = await axios.get(`http://localhost:8010/api/user-missions?userId=${userId}`);
        setMissions(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || "Erreur lors du chargement des missions");
      }
      setLoading(false);
    };
    fetchMissions();
  }, []);

  // Calcul des stats à partir des missions récupérées
  const stats = {
    totalMissions: missions.length,
    pendingReimbursement: missions.filter(m => (m.statut || m.statut) === "En attente").length,
    approvedMissions: missions.filter(m => (m.statut || m.statut) === "Validée").length,
    VReimbursement: missions.filter(m => (m.statut_remb) === "Validée").length,
    // totalAmount: missions.reduce((sum, m) => sum + (parseFloat(m.Frais_de_Mission) || 0), 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En attente": return "bg-yellow-100 text-yellow-800";
      case "Validée": return "bg-blue-100 text-blue-800";
      case "Remboursée": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-[#cccc00] hover:text-[#ffff00]">
                <div className="w-10 h-10 bg-gradient-to-br from-[#cccc00] to-[#ffff00] rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-black" />
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Espace Personnel</h1>
                <p className="text-sm text-gray-300">Gestion de vos missions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* <div className="text-right">
                <p className="text-sm text-gray-300">Connecté en tant que</p>
                <p className="font-medium text-white">{userName}</p>
              </div> */}
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
            Bonjour {userName} ! 👋
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
          <Card className="bg-gradient-to-br from-[#cccc00] to-[#ffff00] text-black border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black/80 text-sm">Total Missions</p>
                  <p className="text-3xl font-bold">{stats.totalMissions}</p>
                </div>
                <FileText className="w-8 h-8 text-black/70" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">En attente</p>
                  <p className="text-3xl font-bold">{stats.pendingReimbursement}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Validées</p>
                  <p className="text-3xl font-bold">{stats.approvedMissions}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Rembourse</p>
                  <p className="text-3xl font-bold">{stats.VReimbursement}</p>
                </div>
                <CreditCard className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Actions rapides */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="hover:shadow-lg transition-shadow bg-gray-900/90 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Plus className="w-5 h-5 mr-2 text-[#cccc00]" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/frontoffice/nouvelle_mission">
                <Button className="w-full justify-start bg-gradient-to-r from-[#cccc00] to-[#ffff00] hover:from-[#aaaa00] hover:to-[#cccc00] text-black font-medium">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Mission
                </Button>
              </Link>
              <Link to="/frontoffice/mes_missions">
                <Button variant="outline" className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800">
                  <FileText className="w-4 h-4 mr-2" />
                  Mes Missions
                </Button>
              </Link>
              {/* <Link to="/frontoffice/suivi_remboursements">
                <Button variant="outline" className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Suivi Remboursements
                </Button>
              </Link> */}
              <Link to="/frontoffice/retour_mission">
                <Button variant="outline" className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-800">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Retour Mission
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* <Card className="hover:shadow-lg transition-shadow bg-gray-900/90 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Remboursement Frais de Mission</CardTitle>
              <CardDescription className="text-gray-300">
                Remplissez le formulaire pour soumettre vos frais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                Date et Destination
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-[#cccc00] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Destination</label>
                    <input 
                      type="text" 
                      placeholder="Lieu de mission"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-[#cccc00] focus:border-transparent"
                    />
                  </div>
                </div>

                /* Horaires 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Heure Départ</label>
                    <input 
                      type="time" 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-[#cccc00] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Heure Arrivée</label>
                    <input 
                      type="time" 
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-[#cccc00] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Transport 
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Transport</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Kilométrage (km)</label>
                      <input 
                        type="number" 
                        placeholder="Distance"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-[#cccc00] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Montant Transport (€)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-[#cccc00] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Repas 
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Nourriture</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Petit Déjeuner (€)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-2 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-[#cccc00] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Déjeuner (€)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-2 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-[#cccc00] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Dîner (€)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-2 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-[#cccc00] focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Autres Repas (€)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-2 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-[#cccc00] focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Logement 
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Logement (€)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="Montant hébergement"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-[#cccc00] focus:border-transparent"
                  />
                </div>

                {/* Frais divers 
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Frais Divers (€)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="Montant"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-[#cccc00] focus:border-transparent"
                    />
                    <input 
                      type="text" 
                      placeholder="Détail des frais"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-[#cccc00] focus:border-transparent"
                    />
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-[#cccc00] to-[#ffff00] hover:from-[#aaaa00] hover:to-[#cccc00] text-black font-medium">
                  Soumettre la Demande
                </Button>
              </form>
            </CardContent>
          </Card> */}
        </div>
      </main>
    </div>
  );
};

export default FrontOfficeDashboard;
