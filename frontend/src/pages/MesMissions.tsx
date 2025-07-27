import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  FileText,
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  MapPin,
  CreditCard,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  Euro,
  XCircle,
  Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MesMissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch missions for logged-in user
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
              <Link to="/frontoffice/dashboard" className="text-[#cccc00] hover:text-[#ffff00]">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Mes Missions</h1>
                <p className="text-sm text-gray-300">Gestion de vos demandes de mission</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error or Loading */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <span className="text-gray-300">Chargement des missions...</span>
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center h-40">
          <span className="text-red-400 font-semibold">{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="container mx-auto px-4 py-8">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-[#cccc00] to-[#ffff00] text-black border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Total missions</p>
                    <p className="text-3xl">{missions.length}</p>
                  </div>
                  <Receipt className="w-8 h-8" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">En attente</p>
                    <p className="text-3xl font-bold">{missions.filter(m => (m.statut_remb || m.statut) === "En attente").length}</p>
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
                    <p className="text-3xl font-bold">{missions.filter(m => (m.statut_remb || m.statut) === "Validée").length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-500 to-pink-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Refusées</p>
                    <p className="text-3xl font-bold">{missions.filter(m => (m.statut_remb || m.statut) === "Refusée").length}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="hover:shadow-lg transition-shadow bg-gray-900/90 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Rechercher et filtrer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher par destination ou objet..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="Validée">Validée</SelectItem>
                      {/* <SelectItem value="Remboursée">Remboursée</SelectItem> */}
                      <SelectItem value="Refusée">Refusée</SelectItem>
                      {/* <SelectItem value="Brouillon">Brouillon</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Missions Table */}
          <Card className="hover:shadow-lg transition-shadow bg-gray-900/90 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Historique des missions</CardTitle>
              <CardDescription className="text-gray-300">
                Liste complète de vos missions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Référence</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Objet</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Destination</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Véhicule</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date départ</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date retour</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Frais</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Statut</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Statut remboursement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredMissions.map((mission) => (
                      <tr key={mission.id || mission.ID || mission.id_mission}>
                        <td className="px-4 py-2 font-medium text-white">{mission.id || mission.id || '-'}</td>
                        <td className="px-4 py-2">{mission.objet || mission.Objet || '-'}</td>
                        <td className="px-4 py-2">{mission.destination || mission.Destination || '-'}</td>
                        <td className="px-4 py-2">{mission.vehicule || '-'}</td>
                        <td className="px-4 py-2">{mission.Date_Sortie || '-'}</td>
                        <td className="px-4 py-2">{mission.Date_Retour || '-'}</td>
                        <td className="px-4 py-2">{mission.Frais_de_Mission || '-'}</td>
                        <td className="px-4 py-2">{getStatusBadge(mission.statut)}</td>
                        <td className="px-4 py-2">{getStatusBadge(mission.statut_remb)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredMissions.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Aucune mission trouvée</h3>
                    <p className="text-gray-300">Aucune mission ne correspond à vos critères de recherche.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MesMissions;