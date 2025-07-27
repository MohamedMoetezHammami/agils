import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, 
  Download, 
  CheckCircle,
  Calendar,
  User,
  Building,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const HistoriqueComplet = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch mission history from backend
  useEffect(() => {
    const fetchMissionHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8010/api/financial/mission-history');
        setMissions(response.data);
      } catch (err) {
        console.error('Error fetching mission history:', err);
        setError('Erreur lors du chargement de l\'historique');
        toast({
          title: "Erreur",
          description: "Impossible de charger l'historique des missions",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMissionHistory();
  }, []);

  const totalDifference = missions.reduce((sum, mission) => sum + mission.difference, 0);
  
  // Filter missions to get only validated/paid requests
  const validatedRequests = missions.filter(mission => 
    mission.statut_remb === "Validée" || mission.statut_remb === "Payé"
  );
  const getStatusColor = (status) => {
    switch (status) {
      case "Validée": return "bg-green-100 text-green-800";
      case "Payé": return "bg-blue-100 text-blue-800";
      case "Refusée": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const downloadCSV = () => {
    const headers = ["ID Mission", "Employé", "Département", "Objet", "Destination", "Différence (€)", "Statut"];
    const csvContent = [
      headers.join(","),
      ...missions.map(mission => [
        mission.id,
        mission.employee,
        mission.department,
        mission.objet,
        mission.destination,
        mission.difference.toFixed(3),
        mission.statut_remb
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "historique_missions.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
            <Link to="/financial/dashboard" className="text-blue-500 hover:text-blue-300">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Historique Complet</h1>
                  <p className="text-sm text-gray-300">Remboursements validés de la semaine</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={downloadCSV}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Missions traitées</p>
                  <p className="text-2xl font-bold text-green-400">{missions.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Montant total</p>
                  <p className="text-2xl font-bold text-blue-400">{totalDifference.toFixed(3)}dt</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Période</p>
                  <p className="text-2xl font-bold text-purple-400">Cette semaine</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests Table */}
        <Card className="border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Demandes de remboursement validées</span>
            </CardTitle>
            <CardDescription className="text-gray-300">
              Liste complète des remboursements validés cette semaine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">ID</TableHead>
                    <TableHead className="text-gray-300">Employé</TableHead>
                    <TableHead className="text-gray-300">Mission</TableHead>
                    <TableHead className="text-gray-300">Département</TableHead>
                    <TableHead className="text-gray-300">Objet</TableHead>
                    <TableHead className="text-gray-300">Montant</TableHead>
                    {/* <TableHead className="text-gray-300">Date Validation</TableHead>
                    <TableHead className="text-gray-300">Date Paiement</TableHead> */}
                    <TableHead className="text-gray-300">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validatedRequests.map((request) => (
                    <TableRow key={request.id} className="border-gray-700 hover:bg-gray-800/50">
                      <TableCell className="text-gray-300 font-mono text-sm">
                        {request.id}
                      </TableCell>
                      <TableCell className="text-white">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{request.employee}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{request.destination}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          <span>{request.department}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm">{request.objet}</TableCell>
                      <TableCell className="text-green-400 font-bold">
                        {request.difference.toFixed(3)}dt
                      </TableCell>
                      {/* <TableCell className="text-gray-300">{request.validatedDate}</TableCell>
                      <TableCell className="text-gray-300">{request.paymentDate}</TableCell> */}
                      <TableCell>
                        <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                        Validée
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistoriqueComplet;