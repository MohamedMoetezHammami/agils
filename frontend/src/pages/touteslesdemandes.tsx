import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { 
  ArrowLeft,
  User,
  LogOut,
  DollarSign,
  Check,
  X,
  Eye,
  FileText,
  Calendar,
  MapPin,
  Euro,
  Clock,
  Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ValidationRemboursements = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real mission data from database
  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8010/api/financial/all-missions');
        const missions = response.data.map(mission => ({
          id: mission.id,
          employee: mission.employee,
          department: mission.department,
          objet: mission.objet,
          destination: mission.destination,
          date_mission: mission.Date_Mission,
          frais: mission.Frais_de_Mission ? `${mission.Frais_de_Mission}` : 'N/A',
          
          status: mission.statut_remb || 'En attente',
          receipts: 0, // This would need to be implemented separately
          description: `Mission: ${mission.objet} - Destination: ${mission.destination}`,
          mission_status: mission.mission_status,
          détail_Frais: mission.détail_Frais
        }));
        setDemandes(missions);
      } catch (err) {
        console.error('Error fetching missions:', err);
        setError('Erreur lors du chargement des données');
        toast({
          title: "Erreur",
          description: "Impossible de charger les demandes de remboursement",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const [selectedDemande, setSelectedDemande] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Function to update mission status
  const updateMissionStatus = async (missionId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const response = await axios.put(`http://localhost:8010/api/financial/update-status/${missionId}`, {
        statut_remb: newStatus
      });
      
      if (response.data.success) {
        // Update the local state
        setDemandes(prevDemandes => 
          prevDemandes.map(demande => 
            demande.id === missionId 
              ? { ...demande, status: newStatus }
              : demande
          )
        );
        
        // Update selected demande if it's the one being updated
        if (selectedDemande && selectedDemande.id === missionId) {
          setSelectedDemande({ ...selectedDemande, status: newStatus });
        }
        
        toast({
          title: "Succès",
          description: `Demande ${newStatus.toLowerCase()} avec succès`,
          variant: "default"
        });
        
        // Close modal after successful update
        setSelectedDemande(null);
      }
    } catch (error) {
      console.error('Error updating mission status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la demande",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle validation
  const handleValidation = () => {
    if (selectedDemande) {
      updateMissionStatus(selectedDemande.id, 'Validée');
    }
  };

  // Handle refusal
  const handleRefusal = () => {
    if (selectedDemande) {
      updateMissionStatus(selectedDemande.id, 'Refusée');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En attente": return "bg-yellow-100 text-yellow-800";
      case "Validé": return "bg-green-100 text-green-800";
      case "Validée": return "bg-green-100 text-green-800";
      case "Payé": return "bg-blue-100 text-blue-800";
      case "Refusé": return "bg-red-100 text-red-800";
      case "Refusée": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p>Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
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
            <div className="flex items-center space-x-4">
              <Link to="/financial/dashboard" className="text-green-400 hover:text-green-300">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Voir toutes les demandes</h1>
                <p className="text-sm text-gray-300">Suivi des demandes de remboursement</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-300">Connecté en tant que</p>
                <p className="font-medium text-white">Agent Financier</p>
              </div>
              <Button variant="outline" size="sm" className="text-gray-300 border-gray-600 hover:bg-gray-800">
                <User className="w-4 h-4 mr-2" />
                Profil
              </Button>
              
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">En Attente</p>
                  <p className="text-3xl font-bold">2</p>
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
                  <p className="text-3xl font-bold">1</p>
                </div>
                <Check className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Payées</p>
                  <p className="text-3xl font-bold">1</p>
                </div>
                <Receipt className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Montant Total</p>
                  <p className="text-3xl font-bold">810€</p>
                </div>
                <Euro className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Demandes Table */}
        <Card className="bg-gray-900/90 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Toutes les demandes de remboursement</CardTitle>
            <CardDescription className="text-gray-300">
              Liste complète des demandes de remboursement avec leur statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Employé</TableHead>
                    <TableHead className="text-gray-300">Mission</TableHead>
                    <TableHead className="text-gray-300">object</TableHead>
                    <TableHead className="text-gray-300">Date soumission</TableHead>
                    <TableHead className="text-gray-300">Montant</TableHead>
                    {/* <TableHead className="text-gray-300">Justificatifs</TableHead> */}
                    <TableHead className="text-gray-300">Statut</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demandes.map((demande) => (
                    <TableRow key={demande.id} className="border-gray-700 hover:bg-gray-800/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{demande.employee}</p>
                          <p className="text-sm text-gray-400">{demande.department}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-300">
                          <MapPin className="w-4 h-4 mr-2 text-green-400" />
                          {demande.destination}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{demande.objet}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-300">
                          <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                          {demande.date_mission}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-green-400 font-medium">
                          
                          {demande.frais.replace('', '')}
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        <div className="flex items-center text-gray-300">
                          <FileText className="w-4 h-4 mr-1 text-purple-400" />
                          {demande.receipts}
                        </div>
                      </TableCell> */}
                      <TableCell>
                        <Badge className={getStatusColor(demande.status)}>
                          {demande.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-400 border-blue-600 hover:bg-blue-900/20"
                            onClick={() => setSelectedDemande(demande)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Demande Details Modal */}
        {selectedDemande && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-900 border-gray-700 max-w-2x2 w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Receipt className="w-5 h-5 mr-2 text-green-400" />
                    Détails de la demande #{selectedDemande.id}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDemande(null)}
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
                    <p className="text-white font-medium">{selectedDemande.employee}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Département</label>
                    <p className="text-white">{selectedDemande.department}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">objet</label>
                    <p className="text-white">{selectedDemande.objet}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Destination</label>
                    <p className="text-white">{selectedDemande.destination}</p>
                  </div>
                  {/* <div>
                    <label className="text-sm text-gray-400">Type de frais</label>
                    <p className="text-white">{selectedDemande.type}</p>
                  </div> */}
                  <div>
                    <label className="text-sm text-gray-400">Date de Mission</label>
                    <p className="text-white">{selectedDemande.date_mission}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Avance</label>
                    <p className="text-green-400 font-medium">{selectedDemande.frais}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-gray-400">Détail des Frais</label>
                    <div className="mt-2">
                      {selectedDemande.détail_Frais ? (
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                          {(() => {
                            try {
                              // Try to parse as JSON if it's a string
                              const details = typeof selectedDemande.détail_Frais === 'string' 
                                ? JSON.parse(selectedDemande.détail_Frais) 
                                : selectedDemande.détail_Frais;
                              
                              if (Array.isArray(details)) {
                                // Calculate grand total for multi-day missions
                                const grandTotal = details.reduce((total, item) => {
                                  return total + (Number(item.montantKm || 0) + Number(item.P_D || 0) + Number(item.repas || 0) + Number(item.diner || 0) + Number(item.logement || 0) + Number(item.montantdet || 0));
                                }, 0);
                                
                                return (
                                  <div className="space-y-3">
                                    {details.map((item, index) => {
                                      const dailyTotal = Number(item.montantKm || 0) + Number(item.P_D || 0) + Number(item.repas || 0) + Number(item.diner || 0) + Number(item.logement || 0) + Number(item.montantdet || 0);
                                      
                                      return (
                                        <div key={index} className="p-4 bg-gray-700 rounded border-l-4 border-green-400">
                                          <div className="grid grid-cols-12 gap-0.5 mb-4">
                                            <div className="p-2 bg-gray-800 rounded">
                                              <p className="text-white font-medium text-sm">Date</p>
                                              <p className="text-gray-400 text-sm">{item.date || 'N/A'}</p>
                                            </div>
                                            <div className="p-2 bg-gray-800 rounded">
                                              <p className="text-white font-medium text-sm">Départ</p>
                                              <p className="text-gray-400 text-sm">{item.dep || 'N/A'}</p>
                                            </div>
                                            <div className="p-2 bg-gray-800 rounded">
                                              <p className="text-white font-medium text-sm">Arrivée</p>
                                              <p className="text-gray-400 text-sm">{item.arr || 'N/A'}</p>
                                            </div>
                                            <div className="p-2 bg-gray-800 rounded">
                                              <p className="text-white font-medium text-sm">Destination</p>
                                              <p className="text-gray-400 text-sm">{item.dest || 'N/A'}</p>
                                            </div>
                                            <div className="p-2 bg-gray-800 rounded">
                                              <p className="text-white font-medium text-sm">Kilométrage</p>
                                              <p className="text-gray-400 text-sm">{item.Km || '0'} km</p>
                                            </div>
                                            <div className="p-2 bg-gray-800 rounded">
                                              <p className="text-white font-medium text-sm">Montant Km</p>
                                              <p className="text-gray-400 text-sm">{item.montantKm || '0'} dt</p>
                                            </div>
                                            <div className="p-2 bg-gray-800 rounded">
                                              <p className="text-white font-medium text-sm">P.D.</p>
                                              <p className="text-gray-400 text-sm">{item.P_D || '0'} dt</p>
                                            </div>
                                            <div className="p-2 bg-gray-800 rounded">
                                              <p className="text-white font-medium text-sm">Repas</p>
                                              <p className="text-gray-400 text-sm">{item.repas || '0'} dt</p>
                                            </div>
                                            <div className="p-2 bg-gray-800 rounded">
                                              <p className="text-white font-medium text-sm">Dîner</p>
                                              <p className="text-gray-400 text-sm">{item.diner || '0'} dt</p>
                                            </div>
                                            <div className="p-2 bg-gray-800 rounded">
                                              <p className="text-white font-medium text-sm">Logement</p>
                                              <p className="text-gray-400 text-sm">{item.logement || '0'} dt</p>
                                            </div>
                                            <div className="p-2 bg-gray-800 rounded">
                                              <p className="text-white font-medium text-sm">Détail</p>
                                              <p className="text-gray-400 text-sm">{item.detali || 'N/A'}</p>
                                            </div>
                                            <div className="p-2 bg-gray-800 rounded">
                                              <p className="text-white font-medium text-sm">Montant Détail</p>
                                              <p className="text-gray-400 text-sm">{item.montantdet || '0'} dt</p>
                                            </div>
                                          </div>
                                          
                                          <div className="flex justify-end pt-2 border-t border-gray-600">
                                            <div className="text-right">
                                              <p className="text-gray-400 text-sm">Total du jour {index + 1}:</p>
                                              <p className="text-green-400 font-bold text-lg">
                                                {dailyTotal.toFixed(3)} dt
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                    
                                    {/* Grand Total for multi-day missions */}
                                    {details.length > 1 && (
                                      <div className="p-4 bg-gradient-to-r from-green-600 to-emerald-400 rounded-lg border-2 border-green-400">
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <p className="text-white font-bold text-lg">Total Général de la Mission</p>
                                            <p className="text-green-100 text-sm">({details.length} jours)</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-white font-bold text-2xl">
                                              {grandTotal.toFixed(3)} dt
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {details.length > 1 && (
                                      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg border-2 border-blue-400">
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <p className="text-white font-bold text-lg">Total Général de la Mission - Avance</p>
                                            <p className="text-green-100 text-sm">
                                              Total: {grandTotal.toFixed(3)} dt - Avance: {Number(selectedDemande.frais) || 0} dt
                                            </p>
                                          </div>
                                          
                                          <div className="text-right">
                                            <p className="text-white font-bold text-2xl">
                                              {(grandTotal - (Number(selectedDemande.frais) || 0)).toFixed(3)} dt
                                            </p>
                                            <p className="text-green-100 text-sm">
                                              {(grandTotal - (Number(selectedDemande.frais) || 0)) >= 0 ? 'Dépassement' : 'Reste'}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                  </div>
                                );
                              } else if (typeof details === 'object') {
                                return (
                                  <div className="space-y-2">
                                    {Object.entries(details).map(([key, value], index) => (
                                      <div key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                                        <span className="text-gray-300 capitalize">{key.replace(/_/g, ' ')}</span>
                                        <span className="text-white">{String(value)}</span>
                                      </div>
                                    ))}
                                  </div>
                                );
                              } else {
                                return <p className="text-white">{String(details)}</p>;
                              }
                            } catch (error) {
                              // If parsing fails, display as plain text
                              return (
                                <div className="p-3 bg-gray-700 rounded">
                                  <p className="text-white whitespace-pre-wrap">{String(selectedDemande.détail_Frais)}</p>
                                </div>
                              );
                            }
                          })()} 
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">Aucun détail de frais disponible</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Statut</label>
                    <Badge className={getStatusColor(selectedDemande.status)}>
                      {selectedDemande.status}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Description</label>
                  <p className="text-white mt-1">{selectedDemande.description}</p>
                </div>

                {selectedDemande.status === "En attente" && (
                  <div className="flex space-x-4 pt-4">
                    <Button 
                      onClick={handleValidation}
                      disabled={updatingStatus}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white disabled:opacity-50"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {updatingStatus ? 'Mise à jour...' : 'Valider la demande'}
                    </Button>
                    <Button 
                      onClick={handleRefusal}
                      disabled={updatingStatus}
                      variant="outline" 
                      className="flex-1 text-red-400 border-red-600 hover:bg-red-900/20 disabled:opacity-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      {updatingStatus ? 'Mise à jour...' : 'Refuser la demande'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default ValidationRemboursements;