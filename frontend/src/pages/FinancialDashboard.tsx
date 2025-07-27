import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  DollarSign, 
  CheckCircle, 
  History, 
  LogOut, 
  TrendingUp, 
  Receipt,
  Calendar,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FinancialDashboard = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8010/api/financial/all-missions');
        setMissions(response.data.map(mission => ({
          id: mission.id,
          employee: mission.employee,
          department: mission.department,
          objet: mission.objet,
          destination: mission.destination,
          date_mission: mission.Date_Mission,
          frais: mission.Frais_de_Mission ? Number(mission.Frais_de_Mission) : 0,
          status: mission.statut_remb || 'En attente',
        })));
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);

  // Stats calculations from real data
  const pendingCount = missions.filter(m => m.status === 'En attente').length;
  const validatedCount = missions.filter(m => m.status === 'Validée').length;
  const paidCount = missions.filter(m => m.status === 'Payé').length;
  const totalAmount = missions.reduce((sum, m) => sum + (m.frais || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p>Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="text-white text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Espace Financier</h1>
                <p className="text-sm text-gray-300">Gestion financière et remboursements</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <User className="w-4 h-4" />
                <span className="text-sm">Agent Financier</span>
              </div>
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

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Tableau de bord financier
          </h2>
          <p className="text-gray-300">
            Gérez les validations et suivez l'historique des remboursements
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">En attente</p>
                  <p className="text-2xl font-bold text-orange-400">{pendingCount}</p>
                </div>
                <Receipt className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Validés</p>
                  <p className="text-2xl font-bold text-green-400">{validatedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Payées</p>
                  <p className="text-2xl font-bold text-blue-400">{paidCount}</p>
                </div>
                <Receipt className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Montant Total</p>
                  <p className="text-2xl font-bold text-purple-400">{totalAmount.toFixed(3)}dt</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Validation Actions */}
          <Card className="border border-gray-700 bg-gray-900/90 backdrop-blur-sm hover:bg-gray-800/90 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Validation de remboursement</CardTitle>
                  <CardDescription className="text-gray-300">
                    Valider les demandes de remboursement en attente
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {missions.filter(m => m.status === 'En attente').slice(0, 2).map((mission) => (
                  <div key={mission.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{mission.destination} - {mission.employee}</p>
                      <p className="text-gray-400 text-sm">{mission.objet}</p>
                      <p className="text-gray-400 text-xs">{new Date(mission.date_mission).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{mission.frais.toFixed(3)} dt</p>
                    </div>
                  </div>
                ))}
                {missions.filter(m => m.status === 'En attente').length === 0 && (
                  <div className="text-gray-400 text-center">Aucune demande en attente</div>
                )}
                <Link to="/financial/validation_remboursements">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                    Voir toutes les demandes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* History Tracking */}
          <Card className="border border-gray-700 bg-gray-900/90 backdrop-blur-sm hover:bg-gray-800/90 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <History className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Historique des remboursements</CardTitle>
                  <CardDescription className="text-gray-300">
                    Suivi complet des frais et remboursements
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {missions.filter(m => m.status === 'Validée')
                  .slice(-2).reverse().map((mission) => (
                  <div key={mission.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{mission.destination} - {mission.employee}</p>
                      <p className="text-gray-400 text-sm">Validé{mission.date_mission ? ` le ${mission.date_mission}` : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">+{mission.frais.toFixed(2)}dt</p>
                      <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">{mission.status}</span>
                    </div>
                  </div>
                ))}
                {missions.filter(m => m.status === 'Validée').length === 0 && (
                  <div className="text-gray-400 text-center">Aucun remboursement validé</div>
                )}
                <Link to="/financial/historique_complet">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                    Voir l'historique complet
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;