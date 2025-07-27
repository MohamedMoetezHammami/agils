import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Plus, Minus, Printer, X, ArrowDown } from 'lucide-react';
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  User, 
  Building, 
  MapPin, 
  Calendar,
  Car,
  Bus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  reference: z.string().min(1, "La référence est requise"),
  dateMission: z.string().min(1, "La date de mission est requise"),
  dateDepart: z.string().min(1, "La date de départ est requise"),
  heureDepart: z.string().min(1, "L'heure de départ est requise"),
  dateRetour: z.string().min(1, "La date de retour est requise"),
  heureRetour: z.string().min(1, "L'heure de retour est requise"),
  depart: z.string().min(1, "Le lieu de départ est requis"),
  destination: z.string().min(1, "La destination est requise"),
  objet: z.string().min(5, "L'objet de la mission est requis"),
  vehicule: z.string().optional(),
  fraisMission: z.string().optional(),
  departement: z.string().min(1, "Le département est requis"),
  projet: z.string().optional(),
  compteurDepart: z.string().default("0"),
  compteurArrive: z.string().default("0"),
  kilometrage: z.string().default("0"),
});

type FormData = z.infer<typeof formSchema>;

const NouvelleMission = () => {
  const [firstAvailableVehicule, setFirstAvailableVehicule] = useState<any>(null);
  const [fetchingVehicule, setFetchingVehicule] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reference: "00000002",
      dateMission: "",
      dateDepart: "",
      heureDepart: "",
      depart: "",
      destination: "",
      dateRetour: "",
      heureRetour: "",
      objet: "",
      fraisMission: "",
      vehicule: "",
      departement: "",
    },
  });

  // Watch the vehicule field
  const formVehiculeWatch = form.watch('vehicule');

  useEffect(() => {
    if (formVehiculeWatch === 'voiture de service') {
      setFetchingVehicule(true);
      axios.get('http://localhost:8010/api/vehicules/disponibles')
        .then(res => {
          if (res.data && res.data.length > 0) {
            setFirstAvailableVehicule(res.data[0]);
          } else {
            setFirstAvailableVehicule(null);
          }
        })
        .catch(() => setFirstAvailableVehicule(null))
        .finally(() => setFetchingVehicule(false));
    } else {
      setFirstAvailableVehicule(null);
    }
  }, [formVehiculeWatch]);

  const addEmployee = () => {
    setEmployees([...employees, { matricule: '', nom: '', service: '', departement: '' }]);
  };

  const removeEmployee = (index) => {
    setEmployees(employees.filter((_, i) => i !== index));
  };

  const updateEmployee = (index, field, value) => {
    const updated = employees.map((emp, i) => 
      i === index ? { ...emp, [field]: value } : emp
    );
    setEmployees(updated);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Get user id from JWT
      const token = localStorage.getItem("token");
      let userId = null;
      if (token) {
        const decoded: any = jwtDecode(token);
        userId = decoded.id;
      }
      if (!userId) throw new Error("Utilisateur non authentifié");

      let payload: any = { ...data, userId };
      // If "Voiture de service" is selected, add immatriculation and vehicleId
      if (data.vehicule === "voiture de service" && firstAvailableVehicule?.immatriculation) {
        payload.immatriculation = firstAvailableVehicule.immatriculation;
        payload.vehicleId = firstAvailableVehicule.id;
      }
      await axios.post("http://localhost:8010/api/missions", payload);

      toast({
        title: "Mission créée avec succès",
        description: "La nouvelle mission a été enregistrée.",
      });
      navigate("/frontoffice/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur est survenue lors de la création de la mission.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/frontoffice/dashboard" 
                className="text-orange-500 hover:text-orange-400 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Nouvelle Mission</h1>
                <p className="text-sm text-gray-300">Créer une nouvelle demande de mission</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-gray-900/90 border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <FileText className="w-5 h-5 mr-2 text-orange-500" />
              Formulaire de Mission
            </CardTitle>
            <CardDescription className="text-gray-300">
              Remplissez tous les champs pour créer une nouvelle mission
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Header Row */}
                <div className="bg-gray-800 p-4 border-b border-gray-600 rounded-lg">
                  <div className="flex items-center gap-4">
                    {/* <FormField
                      control={form.control}
                      name="reference"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="font-semibold text-gray-300 whitespace-nowrap">
                            Référence Ordre de Mission
                          </FormLabel>
                          <FormControl>
                            <div className="bg-gray-700 px-3 py-1 border border-gray-600 w-21 text-center text-white">
                              {form.watch('reference') || '0'}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                    
                    <FormField
                      control={form.control}
                      name="dateMission"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="font-semibold text-gray-300 whitespace-nowrap">
                            Date Mission
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              type="date"
                              className="w-21 bg-gray-700 border-gray-600 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Date/Time Section */}
                <div className="bg-gray-800 p-4 border-b border-gray-600 rounded-lg">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <FormField
                          control={form.control}
                          name="dateDepart"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormLabel className="font-semibold text-gray-300 w-20">
                                Date Sortie
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  type="date"
                                  className="w-32 bg-gray-700 border-gray-600 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="heureDepart"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormLabel className="font-semibold text-gray-300 w-20">
                                Heure Sortie
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  type="time"
                                  className="w-20 bg-gray-700 border-gray-600 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <FormField
                          control={form.control}
                          name="dateRetour"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormLabel className="font-semibold text-gray-300 w-20">
                                Date Retour
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  type="date"
                                  className="w-32 bg-gray-700 border-gray-600 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="heureRetour"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormLabel className="font-semibold text-gray-300 w-20">
                                Heure Retour
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  {...field}
                                  type="time"
                                  className="w-20 bg-gray-700 border-gray-600 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="depart"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-4">
                            <FormLabel className="font-semibold text-gray-300 w-16">
                              Départ
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                className="flex-1 bg-gray-700 border-gray-600 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-4">
                            <FormLabel className="font-semibold text-gray-300 w-16">
                              Destination
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                className="flex-1 bg-gray-700 border-gray-600 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Mission Object */}
                <div className="bg-gray-800 p-4 border-b border-gray-600 rounded-lg">
                  <FormField
                    control={form.control}
                    name="objet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-gray-300">
                          Objet Mission
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field}
                            className="w-full mt-2 bg-gray-700 border-gray-600 text-white h-20 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Vehicle and Costs */}
                <div className="bg-gray-800 p-4 border-b border-gray-600 rounded-lg">
                  <div className="grid grid-cols-2 gap-8">
                    
                    <FormField
                      control={form.control}
                      name="fraisMission"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                          <FormLabel className="font-semibold text-gray-300 w-24">
                            Frais de Mission
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              className="flex-1 bg-gray-700 border-gray-600 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Counters */}
                <div className="bg-gray-800 p-4 border-b border-gray-600 rounded-lg">
                  <div className="flex items-center gap-8">
                    
                  <div className="flex items-center gap-4 w-full">
  <FormField
    control={form.control}
    name="vehicule"
    render={({ field }) => (
      <FormItem className="flex items-center gap-4">
        <FormLabel className="font-semibold text-gray-300 w-16">
          Véhicule
        </FormLabel>
        <FormControl>
          <select
            {...field}
            className="flex-1 bg-gray-700 border-gray-600 text-white rounded px-2 py-1"
          >
            <option value="">Sélectionner</option>
            <option value="moyen publique">Moyen publique</option>
            <option value="voiture de service">Voiture de service</option>
            <option value="voiture personnelle">Voiture personnelle</option>
          </select>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  {/* Only show immatriculation if voiture de service is selected */}
  {formVehiculeWatch === 'voiture de service' && (
    <div className="flex items-center gap-2">
      <label className="font-semibold text-gray-300 whitespace-nowrap">Immatriculation</label>
      <input
        type="text"
        readOnly
        value={fetchingVehicule ? 'Chargement...' : (firstAvailableVehicule?.immatriculation || 'Aucun disponible')}
        className="bg-gray-700 border-gray-600 text-white rounded px-2 py-1 w-40"
      />
    </div>
  )}
</div>

                  {/* <FormField
                      control={form.control}
                      name="compteurDepart"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                          <FormLabel className="font-semibold text-gray-300 w-16">
                          Compteur Départ
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              className="flex-1 bg-gray-700 border-gray-600 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                    
                    {/* <div className="flex items-center gap-2">
                      <Label className="font-semibold text-gray-300">Compteur Arrivé</Label>
                      <div className="bg-gray-700 px-3 py-1 border border-gray-600 w-16 text-center text-white">
                        {form.watch('compteurArrive') || '0'}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Label className="font-semibold text-gray-300">Kilométrage Par Course</Label>
                      <div className="bg-gray-700 px-3 py-1 border border-gray-600 w-16 text-center text-white">
                        {form.watch('kilometrage') || '0'}
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Mission Assignment */}
                <div className="bg-gray-800 p-4 border-b border-gray-600 rounded-lg">
                  <div className="grid grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="departement"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                          <FormLabel className="font-semibold text-gray-300 w-24">
                            Département
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              className="flex-1 bg-gray-700 border-gray-600 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Employee List */}
                {/* <div className="bg-gray-800 p-4 border-b border-gray-600 rounded-lg">
                  
                  <div className="flex gap-4 mb-4">
                    <Input 
                      type="text" 
                      className="w-32 bg-gray-700 border-gray-600 text-white" 
                      placeholder="Recherche..." 
                    />
                    <Search className="w-4 h-4 text-gray-500 cursor-pointer mt-2" />
                    <div className="flex-1 bg-gray-700 border border-gray-600"></div>
                    <Button variant="outline" className="text-sm bg-gray-700 border-gray-600 text-white">
                      Filtre
                    </Button>
                    <Button variant="outline" className="text-sm bg-gray-700 border-gray-600 text-white">
                      Options
                    </Button>
                  </div>

                  <div className="border border-gray-600 rounded-lg overflow-hidden">
                    <div className="bg-gray-700 border-b border-gray-600">
                      <div className="grid grid-cols-5 gap-4 p-2">
                        <div className="font-semibold text-gray-300">Matricule</div>
                        <div className="font-semibold text-gray-300">Nom</div>
                        <div className="font-semibold text-gray-300">Service</div>
                        <div className="font-semibold text-gray-300">Département</div>
                        <div className="flex gap-2">
                          <Button 
                            type="button"
                            onClick={addEmployee}
                            className="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded flex items-center justify-center p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          
                        </div>
                      </div>
                    </div>
                    
                    {employees.map((employee, index) => (
                      <div key={index} className="grid grid-cols-5 gap-4 p-2 border-b border-gray-600 bg-gray-800">
                        <Input 
                          type="text" 
                          className="text-sm bg-gray-700 border-gray-600 text-white"
                          value={employee.matricule}
                          onChange={(e) => updateEmployee(index, 'matricule', e.target.value)}
                        />
                        <Input 
                          type="text" 
                          className="text-sm bg-gray-700 border-gray-600 text-white"
                          value={employee.nom}
                          onChange={(e) => updateEmployee(index, 'nom', e.target.value)}
                        />
                        <Input 
                          type="text" 
                          className="text-sm bg-gray-700 border-gray-600 text-white"
                          value={employee.service}
                          onChange={(e) => updateEmployee(index, 'service', e.target.value)}
                        />
                        <Input 
                          type="text" 
                          className="text-sm bg-gray-700 border-gray-600 text-white"
                          value={employee.departement}
                          onChange={(e) => updateEmployee(index, 'departement', e.target.value)}
                        />
                        <Button 
                          type="button"
                          onClick={() => removeEmployee(index)}
                          className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div> */}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                <Link to="/frontoffice/dashboard">
                  <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-800">
                    Annuler
                  </Button>
                </Link>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Envoyer
                </Button>
              </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NouvelleMission;