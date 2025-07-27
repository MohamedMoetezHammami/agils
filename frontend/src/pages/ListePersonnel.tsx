import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Search,
  Edit,
  Trash2,
  UserPlus,
  Shield,
  Filter,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

interface Personnel {
  id: number;
  nom_et_prenom: string;
  email: string;
  num_tel: string;
  cin: string;
  role: string;
  date_embauche: string;
}

const ListePersonnel = () => {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const response = await axios.get("http://localhost:8010/backoffice/liste_personnel");
        setPersonnel(response.data);
      } catch (err) {
        console.error('Error fetching personnel data:', err);
        setError('Erreur lors du chargement des données du personnel');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, []);

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: "Administrateur", variant: "destructive" as const },
      manager: { label: "Manager", variant: "default" as const },
      employe: { label: "employe", variant: "secondary" as const },
      financier: { label: "financier", variant: "outline" as const }
    };
    const config = roleConfig[role as keyof typeof roleConfig] || { label: role, variant: "secondary" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // const getStatusBadge = (status: string) => {
  //   return status === "actif"
  //     ? <Badge className="bg-green-600 hover:bg-green-700">Actif</Badge>
  //     : <Badge variant="secondary">Inactif</Badge>;
  // };

  const filteredPersonnel = personnel.filter(emp => {
    const fullName = emp.nom_et_prenom || '';
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.cin.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || emp.role === filterRole;

    return matchesSearch && matchesRole;
  });

  // Handle edit action
  const handleEdit = (id: number) => {
    toast.info(`Modification de l'employé #${id}`, {
      description: "Cette fonctionnalité sera bientôt disponible"
    });
  };

  // Handle delete action
  const handleDelete = (id: number) => {
    toast.warning(`Suppression de l'employé #${id}`, {
      description: "Cette fonctionnalité sera bientôt disponible"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          <p className="text-white">Chargement des données du personnel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
        <div className="bg-gray-800/50 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="bg-red-500/20 p-3 rounded-full inline-flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" x2="12" y1="8" y2="12"></line>
              <line x1="12" x2="12.01" y1="16" y2="16"></line>
            </svg>
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
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Liste du Personnel</h1>
                  <p className="text-sm text-gray-300">Gestion des employés</p>
                </div>
              </div>
            </div>

            {/* <Link to="/backoffice/ajouter_employe">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Ajouter un employé
              </Button>
            </Link> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total</p>
                  <p className="text-3xl font-bold">{personnel?.length || 0}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Employe</p>
                  <p className="text-3xl font-bold">{personnel.filter(p => p.role === "employe").length}</p>
                </div>
                <Users className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Financier</p>
                  <p className="text-3xl font-bold">{personnel.filter(p => p.role === "financier").length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Managers</p>
                  <p className="text-3xl font-bold">{personnel.filter(p => p.role === "manager").length}</p>
                </div>
                <Users className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Admins</p>
                  <p className="text-3xl font-bold">{personnel.filter(p => p.role === "admin").length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-gray-900/90 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Filtres et Recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par nom, prénom, email ou ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all" className="text-white hover:bg-gray-700">Tous les rôles</SelectItem>
                    <SelectItem value="admin" className="text-white hover:bg-gray-700">Administrateur</SelectItem>
                    <SelectItem value="manager" className="text-white hover:bg-gray-700">Manager</SelectItem>
                    <SelectItem value="employe" className="text-white hover:bg-gray-700">Employé</SelectItem>
                    <SelectItem value="financier" className="text-white hover:bg-gray-700">Financier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personnel Table */}
        <Card className="bg-gray-900/90 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Users className="w-5 h-5 mr-2 text-orange-500" />
              Personnel ({filteredPersonnel.length})
            </CardTitle>
            <CardDescription className="text-gray-300">
              Liste complète du personnel de l'entreprise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">ID</TableHead>
                    <TableHead className="text-white">Nom & Prénom</TableHead>
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">Téléphone</TableHead>
                    <TableHead className="text-white">CIN</TableHead>
                    <TableHead className="text-white">Rôle</TableHead>
                    <TableHead className="text-white">Date d'embauche</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPersonnel.map((emp) => (
                    <TableRow key={emp.id} className="hover:bg-gray-800/50">
                      <TableCell className="text-white">{emp.id}</TableCell>
                      <TableCell className="text-white">{emp.nom_et_prenom}</TableCell>
                      <TableCell className="text-gray-300">{emp.email}</TableCell>
                      <TableCell className="text-gray-300">{emp.num_tel || '-'}</TableCell>
                      <TableCell className="text-gray-300">{emp.cin || '-'}</TableCell>
                      <TableCell>{getRoleBadge(emp.role)}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(emp.date_embauche).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredPersonnel.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  Aucun employé trouvé
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ListePersonnel;