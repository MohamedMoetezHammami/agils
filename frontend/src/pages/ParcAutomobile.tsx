import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Car, 
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Settings,
  Fuel,
  Calendar,
  Wrench,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";

interface Vehicle {
  id: string;
  immatriculation: string;
  marque_de_véhicule: string;
  modele_de_véhicule: string;
  statut: string;
  puissance: number;
  // Optional fields that might be present in some records
  date_derniere_revision?: string;
  date_prochaine_revision?: string;
  niveau_carburant?: number;
  kilometrage?: number;
  disponibilite?: boolean;
  carburant?: string;
}

interface FilterState {
  status: string;
  marque: string;
  minPuissance: string;
  maxPuissance: string;
}

const ParcAutomobile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    marque: '',
    minPuissance: '',
    maxPuissance: ''
  });

  // Fetch vehicles data
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:8010/backoffice/parc_automobile");
        setVehicles(response.data);
        setFilteredVehicles(response.data);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Erreur lors du chargement des données des véhicules');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Apply filters when filters or vehicles change
  useEffect(() => {
    let result = [...vehicles];

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(vehicle =>
        (vehicle.marque_de_véhicule?.toLowerCase() || '').includes(term) ||
        (vehicle.modele_de_véhicule?.toLowerCase() || '').includes(term) ||
        (vehicle.immatriculation?.toLowerCase() || '').includes(term) ||
        (vehicle.id?.toLowerCase() || '').includes(term)
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(vehicle => 
        vehicle.statut?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Apply marque filter
    if (filters.marque) {
      result = result.filter(vehicle => 
        vehicle.marque_de_véhicule?.toLowerCase() === filters.marque.toLowerCase()
      );
    }

    // Apply puissance range filter
    if (filters.minPuissance) {
      const min = parseInt(filters.minPuissance, 10);
      result = result.filter(vehicle => 
        vehicle.puissance && vehicle.puissance >= min
      );
    }

    if (filters.maxPuissance) {
      const max = parseInt(filters.maxPuissance, 10);
      result = result.filter(vehicle => 
        vehicle.puissance && vehicle.puissance <= max
      );
    }

    setFilteredVehicles(result);
  }, [vehicles, searchTerm, filters]);

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case "disponible":
      case "disponible":
        return <Badge className="bg-green-500 hover:bg-green-600">Disponible</Badge>;
      case "en_mission":
      case "en mission":
        return <Badge className="bg-orange-500 hover:bg-orange-600">En mission</Badge>;
      case "maintenance":
        return <Badge className="bg-red-500 hover:bg-red-600">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Inconnu'}</Badge>;
    }
  };

  const getFuelLevelColor = (level: number) => {
    if (level > 60) return "text-green-500";
    if (level > 30) return "text-orange-500";
    return "text-red-500";
  };

  const stats = {
    total: vehicles.length,
    disponible: vehicles.filter(v => v.statut?.toLowerCase() === "disponible").length,
    en_mission: vehicles.filter(v => v.statut?.toLowerCase() === "en mission" || v.statut?.toLowerCase() === "en_mission").length,
    maintenance: vehicles.filter(v => v.statut?.toLowerCase() === "maintenance").length
  };

  // Get unique marques for filter dropdown
  const uniqueMarques = Array.from(
    new Set(vehicles.map(v => v.marque_de_véhicule).filter(Boolean))
  ).sort();

  // Get unique statuses for filter dropdown
  const uniqueStatuses = [
    'Disponible',
    'En mission',
    'En attente',
    ...Array.from(new Set(vehicles.map(v => v.statut).filter(Boolean)))
  ].filter((v, i, a) => a.indexOf(v) === i).sort();

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      marque: '',
      minPuissance: '',
      maxPuissance: ''
    });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          <p className="text-white">Chargement des données du parc automobile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
        <div className="bg-gray-800/50 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="bg-red-500/20 p-3 rounded-full inline-flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Erreur de chargement</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
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
            <div className="flex items-center space-x-4">
              <Link to="/backoffice/dashboard" className="text-orange-500 hover:text-orange-400">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Parc Automobile</h1>
                <p className="text-sm text-gray-300">Gestion de la flotte de véhicules</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/backoffice/add_vehicle">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un véhicule
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
                  <p className="text-blue-100 text-sm">Total</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Car className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Disponibles</p>
                  <p className="text-3xl font-bold">{stats.disponible}</p>
                </div>
                <Shield className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">En mission</p>
                  <p className="text-3xl font-bold">{stats.en_mission}</p>
                </div>
                <Settings className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Maintenance</p>
                  <p className="text-3xl font-bold">{stats.maintenance}</p>
                </div>
                <Wrench className="w-8 h-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-gray-900/90 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Rechercher des véhicules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par marque, modèle ou matricule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <Button 
                variant="outline" 
                className="text-gray-300 border-gray-600 hover:bg-gray-800"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Masquer les filtres' : 'Filtres'}
              </Button>
            </div>
            
            {/* Filters Panel */}
            {showFilters && (
              <div className="border-t border-gray-700 p-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Statut</label>
                    <select
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 text-sm"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">Tous les statuts</option>
                      {uniqueStatuses.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Marque Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Marque</label>
                    <select
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 text-sm"
                      value={filters.marque}
                      onChange={(e) => handleFilterChange('marque', e.target.value)}
                    >
                      <option value="">Toutes les marques</option>
                      {uniqueMarques.map(marque => (
                        <option key={marque} value={marque}>
                          {marque}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Min Puissance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Puissance min (CV)</label>
                    <input
                      type="number"
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 text-sm"
                      placeholder="Min"
                      value={filters.minPuissance}
                      onChange={(e) => handleFilterChange('minPuissance', e.target.value)}
                      min="0"
                    />
                  </div>
                  
                  {/* Max Puissance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Puissance max (CV)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        className="flex-1 bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 text-sm"
                        placeholder="Max"
                        value={filters.maxPuissance}
                        onChange={(e) => handleFilterChange('maxPuissance', e.target.value)}
                        min={filters.minPuissance || '0'}
                      />
                      <Button 
                        variant="outline" 
                        className="text-gray-300 border-gray-600 hover:bg-gray-800"
                        onClick={resetFilters}
                        size="sm"
                      >
                        Réinitialiser
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vehicles Table */}
        <Card className="bg-gray-900/90 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Liste des véhicules</CardTitle>
            <div className="flex justify-between items-center">
            <CardDescription className="text-gray-300">
              {filteredVehicles.length} véhicule(s) trouvé(s) sur {vehicles.length}
            </CardDescription>
            <div className="text-sm text-gray-400">
              {filters.status || filters.marque || filters.minPuissance || filters.maxPuissance ? (
                <span>Filtres actifs</span>
              ) : null}
            </div>
          </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">ID</TableHead>
                  <TableHead className="text-gray-300">Véhicule</TableHead>
                  <TableHead className="text-gray-300">Immatriculation</TableHead>
                  <TableHead className="text-gray-300">Puissance</TableHead>
                  <TableHead className="text-gray-300">Kilométrage</TableHead>
                  <TableHead className="text-gray-300">Statut</TableHead>
                  <TableHead className="text-gray-300">Niveau carburant</TableHead>
                  <TableHead className="text-gray-300">Dernière révision</TableHead>
                  <TableHead className="text-gray-300">Prochaine révision</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id} className="hover:bg-gray-800/50">
                    <TableCell className="font-medium text-white">{vehicle.id}</TableCell>
                    <TableCell className="text-white">
                      <div className="font-medium">{vehicle.marque_de_véhicule} {vehicle.modele_de_véhicule}</div>
                      <div className="text-sm text-gray-400">
                        {vehicle.carburant || 'Non spécifié'}
                        {vehicle.puissance ? ` • ${vehicle.puissance} CV` : ''}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{vehicle.immatriculation}</TableCell>
                    <TableCell className="text-gray-300">{vehicle.puissance || 'N/A'} CV</TableCell>
                    <TableCell className="text-gray-300">{vehicle.kilometrage ? vehicle.kilometrage.toLocaleString() + ' km' : 'N/A'}</TableCell>
                    <TableCell>{getStatusBadge(vehicle.statut)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-full rounded-full ${getFuelLevelColor(vehicle.niveau_carburant || 0)}`}
                            style={{ width: `${vehicle.niveau_carburant || 0}%` }}
                          />
                        </div>
                        <span className={`text-sm ${getFuelLevelColor(vehicle.niveau_carburant || 0)}`}>
                          {vehicle.niveau_carburant || 0}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {vehicle.date_derniere_revision ? 
                        new Date(vehicle.date_derniere_revision).toLocaleDateString('fr-FR') : 
                        'N/A'}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {vehicle.date_prochaine_revision ? 
                        new Date(vehicle.date_prochaine_revision).toLocaleDateString('fr-FR') : 
                        'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredVehicles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-400">
                      Aucun véhicule trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ParcAutomobile;