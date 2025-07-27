import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft,
  User,
  LogOut,
  Shield,
  Check,
  X,
  Eye,
  FileText,
  Calendar,
  MapPin,
  Euro,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "@/components/ui/use-toast";

const ValidationMission = () => {
  const [missions, setMissions] = useState<any[]>([]);
  const [selectedMission, setSelectedMission] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch missions for manager
  React.useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        let managerId = null;
        if (token) {
          try {
            const decoded: any = jwtDecode(token);
            managerId = decoded.id || decoded.userId || null;
          } catch (e) {}
        }
        if (!managerId) throw new Error("Manager non authentifié");
        const res = await axios.get(`http://localhost:8010/api/manager/pending-missions?managerId=${managerId}`);
        setMissions(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || "Erreur lors du chargement des missions");
      }
      setLoading(false);
    };
    fetchMissions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En attente": return "bg-yellow-100 text-yellow-800";
      case "Validée": return "bg-green-100 text-green-800";
      case "Refusée": return "bg-red-100 text-red-800";
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
              <Link to="/manager/dashboard" className="text-purple-400 hover:text-purple-300">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Validation d'Ordre de Mission</h1>
                <p className="text-sm text-gray-300">Gérer les demandes d'ordre de mission</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-300">Connecté en tant que</p>
                <p className="font-medium text-white">Manager</p>
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
        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">En Attente</p>
                  <p className="text-3xl font-bold">3</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Validées ce mois</p>
                  <p className="text-3xl font-bold">15</p>
                </div>
                <Check className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Budget Total</p>
                  <p className="text-3xl font-bold">5,420€</p>
                </div>
                <Euro className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Missions Table */}
        <Card className="bg-gray-900/90 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Missions à Valider</CardTitle>
            <CardDescription className="text-gray-300">
              Liste des demandes d'ordre de mission en attente de validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Employé</TableHead>
                    <TableHead className="text-gray-300">Département</TableHead>
                    <TableHead className="text-gray-300">Destination</TableHead>
                    <TableHead className="text-gray-300">Dates</TableHead>
                    <TableHead className="text-gray-300">Objet</TableHead>
                    <TableHead className="text-gray-300">Frais</TableHead>
                    <TableHead className="text-gray-300">Véhicule</TableHead>
                    <TableHead className="text-gray-300">Immatriculation</TableHead>
                    <TableHead className="text-gray-300">Statut</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {missions.map((mission) => (
                    <TableRow key={mission.id} className="border-gray-800 hover:bg-gray-800/40 transition-colors">
                      <TableCell className="font-medium text-white">{mission.nom_et_prenom}</TableCell>
                      <TableCell>{mission.département}</TableCell>
                      <TableCell>{mission.destination}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{mission.Date_Sortie}</span>
                          <span className="text-xs text-gray-400">{mission.Date_Retour}</span>
                        </div>
                      </TableCell>
                      <TableCell>{mission.objet}</TableCell>
                      <TableCell>{mission.Frais_de_Mission}</TableCell>
                      <TableCell>{mission.vehicule}</TableCell>
                      <TableCell>{mission.immatriculation}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(mission.statut)}>{mission.statut}</Badge>
                      </TableCell>
                      <TableCell>
  <Button
    variant="outline"
    size="sm"
    className="text-gray-300 border-gray-600 hover:bg-gray-800"
    onClick={() => setSelectedMission(mission)}
  >
    <Eye className="w-4 h-4" />
  </Button>
</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Mission Details Modal */}
        {selectedMission && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <Card className="bg-gray-900 border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <FileText className="w-5 h-5 mr-2 text-purple-400" />
            Détails de la Mission #{selectedMission.id}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedMission(null)}
            className="text-gray-300 border-gray-600 hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Employé</label>
            <p className="text-white font-medium">{selectedMission.nom_et_prenom}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Département</label>
            <p className="text-white">{selectedMission.département}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Destination</label>
            <p className="text-white">{selectedMission.destination}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Véhicule</label>
            <p className="text-white">{selectedMission.vehicule}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Immatriculation</label>
            <p className="text-white">{selectedMission.immatriculation}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Date de début</label>
            <p className="text-white">{selectedMission.Date_Sortie}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Date de fin</label>
            <p className="text-white">{selectedMission.Date_Retour}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Frais de Mission</label>
            <p className="text-green-400 font-medium">{selectedMission.Frais_de_Mission}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Objet de la mission</label>
            <p className="text-white mt-1">{selectedMission.objet}</p>
          </div>
        </div>
        <div className="flex space-x-4 pt-4">
          <Button
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            disabled={loading}
            onClick={async () => {
              if (!selectedMission) return;
              setLoading(true);
              try {
                await axios.put("http://localhost:8010/api/manager/update-mission-status", {
                  missionId: selectedMission.id,
                  statut: "Validée"
                });
                setMissions((prev) => prev.filter((m) => m.id !== selectedMission.id));
                setSelectedMission(null);
                toast({ title: "Mission validée", description: "La mission a été validée avec succès." });
              } catch (err: any) {
                toast({ title: "Erreur", description: err.response?.data?.error || err.message, variant: "destructive" });
              }
              setLoading(false);
            }}
          >
            <Check className="w-4 h-4 mr-2" />
            Valider la Mission
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-red-400 border-red-600 hover:bg-red-900/20"
            disabled={loading}
            onClick={async () => {
              if (!selectedMission) return;
              setLoading(true);
              try {
                await axios.put("http://localhost:8010/api/manager/update-mission-status", {
                  missionId: selectedMission.id,
                  statut: "Refusée"
                });
                setMissions((prev) => prev.filter((m) => m.id !== selectedMission.id));
                setSelectedMission(null);
                toast({ title: "Mission refusée", description: "La mission a été refusée." });
              } catch (err: any) {
                toast({ title: "Erreur", description: err.response?.data?.error || err.message, variant: "destructive" });
              }
              setLoading(false);
            }}
          >
            <X className="w-4 h-4 mr-2" />
            Refuser la Mission
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
)}

      </main>
    </div>
  );
};

export default ValidationMission;