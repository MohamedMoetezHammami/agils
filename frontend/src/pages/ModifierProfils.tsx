import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, User, Lock, Save, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const ModifierProfils = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [formData, setFormData] = useState({
    role: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch personnel from backend
  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:8010/backoffice/liste_personnel")
      .then(res => {
        setPersonnel(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Erreur lors du chargement des employés");
        setLoading(false);
      });
  }, []);

  const filteredPersonnel = personnel.filter(person =>
    (person.nom_et_prenom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person.email || person.mail || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person.cin || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmployeeSelect = (employee: any) => {
    setSelectedEmployee(employee);
    setFormData({
      role: employee.role,
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }
    if (formData.newPassword && formData.newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }
    try {
      await axios.put("http://localhost:8010/api/users/update-profile", {
        userId: selectedEmployee.id,
        role: formData.role,
        newPassword: formData.newPassword ? formData.newPassword : undefined
      });
      toast({
        title: "Profil mis à jour",
        description: `Le profil de ${selectedEmployee.nom_et_prenom} a été modifié avec succès`,
      });
      setFormData({
        role: formData.role,
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.response?.data?.error || "Erreur lors de la mise à jour du profil.",
        variant: "destructive",
      });
    }
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
              <div>
                <h1 className="text-xl font-bold text-white">Modifier Profils</h1>
                <p className="text-sm text-gray-300">Gestion des rôles et mots de passe</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Liste des employés */}
          <Card className="bg-gray-900/90 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Users className="w-5 h-5 mr-2 text-orange-500" />
                Sélectionner un employé
              </CardTitle>
              <CardDescription className="text-gray-300">
                Recherchez et sélectionnez l'employé à modifier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom, email ou CIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              {/* Liste des employés */}
              {loading ? (
                <div className="text-center text-gray-400 py-8">Chargement...</div>
              ) : error ? (
                <div className="text-center text-red-400 py-8">{error}</div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredPersonnel.map((employee) => (
                    <div
                      key={employee.id}
                      onClick={() => handleEmployeeSelect(employee)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedEmployee?.id === employee.id
                          ? "bg-orange-600/20 border border-orange-500"
                          : "bg-gray-800 hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">{employee.nom_et_prenom}</p>
                          <p className="text-sm text-gray-300">{employee.email || employee.mail}</p>
                          <p className="text-xs text-gray-400">{employee.role} • {employee.cin}</p>
                        </div>
                        {/* <div className={`px-2 py-1 rounded text-xs ${
                          employee.status === "Actif" 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {employee.status || "Actif"}
                        </div> */}
                      </div>
                    </div>
                  ))}
                  {filteredPersonnel.length === 0 && (
                    <div className="text-center text-gray-400 py-8">Aucun employé trouvé.</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formulaire de modification */}
          <Card className="bg-gray-900/90 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <User className="w-5 h-5 mr-2 text-orange-500" />
                Modifier le profil
              </CardTitle>
              <CardDescription className="text-gray-300">
                {selectedEmployee 
                  ? `Modification du profil de ${selectedEmployee.nom_et_prenom}`
                  : "Sélectionnez un employé pour le modifier"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedEmployee ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Informations de l'employé */}
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium text-white mb-2">Informations actuelles</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-300"><span className="text-gray-400">Nom:</span> {selectedEmployee.nom_et_prenom}</p>
                      <p className="text-gray-300"><span className="text-gray-400">Email:</span> {selectedEmployee.email || selectedEmployee.mail}</p>
                      <p className="text-gray-300"><span className="text-gray-400">CIN:</span> {selectedEmployee.cin}</p>
                      <p className="text-gray-300"><span className="text-gray-400">Rôle actuel:</span> {selectedEmployee.role}</p>
                    </div>
                  </div>

                  {/* Modifier le rôle */}
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-white">Nouveau rôle</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="Employé">Employé</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Administrateur">Administrateur</SelectItem>
                        <SelectItem value="Financier">Financier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Modifier le mot de passe */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-orange-500" />
                      <Label className="text-white">Changer le mot de passe</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-gray-300">Nouveau mot de passe</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Nouveau mot de passe (optionnel)"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-300">Confirmer le mot de passe</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirmer le nouveau mot de passe"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder les modifications
                  </Button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Sélectionnez un employé dans la liste pour commencer</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ModifierProfils;