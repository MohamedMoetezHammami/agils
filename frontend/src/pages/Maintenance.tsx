import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Car, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  FileText,
  User,
  LogOut,
  Search,
  Filter,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const Maintenance = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Données simulées
  const maintenanceRecords = [
    {
      id: 1,
      vehicleId: "REG001",
      matricule: "123-TUN-456",
      marque: "Toyota",
      modele: "Corolla",
      type: "Révision générale",
      status: "En cours",
      dateDebut: "2024-01-15",
      dateFin: "2024-01-17",
      technicien: "Ahmed Ben Ali",
      cout: "450 TND",
      priority: "medium"
    },
    {
      id: 2,
      vehicleId: "REG002", 
      matricule: "789-TUN-012",
      marque: "Peugeot",
      modele: "308",
      type: "Changement d'huile",
      status: "Terminé",
      dateDebut: "2024-01-10",
      dateFin: "2024-01-10",
      technicien: "Mohamed Trabelsi",
      cout: "120 TND",
      priority: "low"
    },
    {
      id: 3,
      vehicleId: "REG003",
      matricule: "345-TUN-678",
      marque: "Renault",
      modele: "Clio",
      type: "Réparation freins",
      status: "Programmé",
      dateDebut: "2024-01-20",
      dateFin: "2024-01-22",
      technicien: "Karim Sassi",
      cout: "320 TND",
      priority: "high"
    },
    {
      id: 4,
      vehicleId: "REG004",
      matricule: "901-TUN-234",
      marque: "Volkswagen",
      modele: "Golf",
      type: "Contrôle technique",
      status: "En attente",
      dateDebut: "2024-01-25",
      dateFin: "2024-01-25",
      technicien: "Non assigné",
      cout: "80 TND",
      priority: "medium"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "En cours":
        return <Badge className="bg-blue-600 hover:bg-blue-700">En cours</Badge>;
      case "Terminé":
        return <Badge className="bg-green-600 hover:bg-green-700">Terminé</Badge>;
      case "Programmé":
        return <Badge className="bg-orange-600 hover:bg-orange-700">Programmé</Badge>;
      case "En attente":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">En attente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredRecords = maintenanceRecords.filter(record =>
    record.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.technicien.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    enCours: maintenanceRecords.filter(r => r.status === "En cours").length,
    programme: maintenanceRecords.filter(r => r.status === "Programmé").length,
    enAttente: maintenanceRecords.filter(r => r.status === "En attente").length,
    termine: maintenanceRecords.filter(r => r.status === "Terminé").length
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
                <h1 className="text-xl font-bold text-white">Maintenance</h1>
                <p className="text-sm text-gray-300">Gestion de la maintenance des véhicules</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-300">Administrateur</p>
                <p className="font-medium text-white">Admin System</p>
              </div>
              <Link to="/backoffice/dashboard">
                <Button variant="outline" size="sm" className="text-gray-300 border-gray-600 hover:bg-gray-800">
                  Retour
                </Button>
              </Link>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">En cours</p>
                  <p className="text-3xl font-bold">{stats.enCours}</p>
                </div>
                <Wrench className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Programmé</p>
                  <p className="text-3xl font-bold">{stats.programme}</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">En attente</p>
                  <p className="text-3xl font-bold">{stats.enAttente}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Terminé</p>
                  <p className="text-3xl font-bold">{stats.termine}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par matricule, marque, type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-800">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle maintenance
          </Button>
        </div>

        {/* Maintenance Records */}
        <Card className="bg-gray-900/90 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Registre de Maintenance</CardTitle>
            <CardDescription className="text-gray-300">
              Suivi des opérations de maintenance des véhicules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div key={record.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                    {/* Vehicle Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                          <Car className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{record.matricule}</p>
                          <p className="text-sm text-gray-300">{record.marque} {record.modele}</p>
                        </div>
                      </div>
                    </div>

                    {/* Maintenance Type */}
                    <div>
                      <p className="text-sm text-gray-400">Type</p>
                      <p className="font-medium text-white">{record.type}</p>
                    </div>

                    {/* Status and Priority */}
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(record.status)}
                      {getPriorityIcon(record.priority)}
                    </div>

                    {/* Dates */}
                    <div>
                      <p className="text-sm text-gray-400">Période</p>
                      <p className="text-sm text-white">{record.dateDebut}</p>
                      {record.dateFin !== record.dateDebut && (
                        <p className="text-sm text-gray-300">→ {record.dateFin}</p>
                      )}
                    </div>

                    {/* Technician and Cost */}
                    <div className="lg:text-right">
                      <p className="text-sm text-gray-400">Technicien</p>
                      <p className="text-sm text-white">{record.technicien}</p>
                      <p className="text-sm font-medium text-green-400">{record.cout}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredRecords.length === 0 && (
              <div className="text-center py-12">
                <Wrench className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Aucun enregistrement de maintenance trouvé</p>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Maintenance;