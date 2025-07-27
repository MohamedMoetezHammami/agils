import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Save, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const AjouterEmploye = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nom_et_prenom: "",
    département: "",
    date_dembauche: "",
    email: "",
    telephone: "",
    employeeId: "",
    cin: "",
    role: "",
    manager_id: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await axios.post("http://localhost:8010/api/employes", formData);
      setSuccess("Employé ajouté avec succès !");
      setFormData({
        nom_et_prenom: "",
        département: "",
        date_dembauche: "",
        email: "",
        telephone: "",
        employeeId: "",
        cin: "",
        role: "",
        manager_id: ""
      });
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur lors de l'ajout de l'employé.");
      }
    }
    setIsLoading(false);

  };

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
                  <h1 className="text-xl font-bold text-white">Ajouter un Employé</h1>
                  <p className="text-sm text-gray-300">Enregistrer un nouveau membre du personnel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto bg-gray-900/90 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <User className="w-5 h-5 mr-2 text-orange-500" />
              Informations de l'Employé
            </CardTitle>
            <CardDescription className="text-gray-300">
              Saisissez les informations du nouvel employé
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom et Prénom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom_et_prenom" className="text-white">Nom et Prénom *</Label>
                  <Input
                    id="nom_et_prenom"
                    value={formData.nom_et_prenom}
                    onChange={(e) => handleInputChange("nom_et_prenom", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    placeholder="Nom et Prénom"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="département" className="text-white">département *</Label>
                  <Input
                    id="département"
                    value={formData.département}
                    onChange={(e) => handleInputChange("département", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    placeholder="département"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_dembauche" className="text-white">Date d'embauche *</Label>
                  <Input
                    type="date"
                    id="date_dembauche"
                    value={formData.date_dembauche}
                    onChange={(e) => handleInputChange("date_dembauche", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  placeholder="nom.prenom@agil.com.tn"
                  required
                />
              </div>

              {/* Téléphone, ID et Manager ID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telephone" className="text-white">Téléphone *</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange("telephone", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    placeholder="Numéro de téléphone"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId" className="text-white">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange("employeeId", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    placeholder="ID de l'employé"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager_id" className="text-white">Manager ID</Label>
                  <Input
                    id="manager_id"
                    value={formData.manager_id}
                    onChange={(e) => handleInputChange("manager_id", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    placeholder="ID du manager (optionnel)"
                  />
                </div>
              </div>

              {/* CIN et Rôle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cin" className="text-white">CIN</Label>
                  <Input
                    id="cin"
                    value={formData.cin}
                    onChange={(e) => handleInputChange("cin", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    placeholder="12345678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white">Rôle *</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="admin" className="text-white hover:bg-gray-700">Administrateur</SelectItem>
                      <SelectItem value="employe" className="text-white hover:bg-gray-700">Employé</SelectItem>
                      <SelectItem value="manager" className="text-white hover:bg-gray-700">Manager</SelectItem>
                      <SelectItem value="financier" className="text-white hover:bg-gray-700">Financier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex justify-end space-x-4 pt-6">
                <Link to="/backoffice/dashboard">
                  <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-800">
                    Annuler
                  </Button>
                </Link>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Ajouter l'Employé
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AjouterEmploye;