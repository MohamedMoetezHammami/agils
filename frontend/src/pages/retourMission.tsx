import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Save,
  FileText,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  Calculator,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const detailFraisSchema = z.object({
  date: z.string().min(1, "Date est requis"),
  dep: z.string().min(1, "Depart est requis"),
  arr: z.string().min(1, "Arrivee est requis"),
  dest: z.string().min(1, "Destination est requis"),
  Km: z.string().min(1, "Kilometrage est requis"),
  montantKm: z.string().min(1, "Le montant kilometrique est requis"),
  P_D: z.string().optional(),
  repas: z.string().optional(),
  diner: z.string().optional(),
  logement: z.string().optional(),
  detali: z.string().optional(),
  montantdet: z.string().optional(),
});

const formSchema = z.object({
  // retourMission: z.string().min(1, "Le numéro de retour mission est requis"),
  dateRetour: z.string().optional(),
  heureRetour: z.string().optional(),
  dateDepart: z.string().optional(),
  heureDepart: z.string().optional(),
  referenceMission: z.string().optional(),
  dateMission: z.string().optional(),
  compteurDepart: z.string().optional(),
  compteurArrive: z.string().optional(),
  kilometrageParcourus: z.string().optional(),
  retourFrais: z.string().optional(),
  fraisDeplacement: z.string().optional(),
  detailFrais: z.array(detailFraisSchema).min(1, "Au moins un détail de frais est requis"),
});

type FormData = z.infer<typeof formSchema>;

const RetourMission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for userId and mission dates
  const [userId, setUserId] = useState<string | null>(null);
  const [missionDates, setMissionDates] = useState({
    dateDepart: '',
    heureDepart: '',
    dateRetour: '',
    heureRetour: '',
    vehicule: '',
  });

  // Get userId from JWT on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.id || decoded.userId || null);
      } catch (e) {
        setUserId(null);
      }
    }
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referenceMission: "",
      dateRetour: "",
      heureRetour: "",
      dateDepart: "",
      heureDepart: "",
      dateMission: "",
      compteurDepart: "",
      compteurArrive: "",
      kilometrageParcourus: "",
      retourFrais: "",
      fraisDeplacement: "",
      detailFrais: [
        {
          date: "", dep: "", arr: "", dest: "", Km: "", montantKm: "", P_D: "",
          repas: "", diner: "", logement: "", detali: "", montantdet: ""
        },
      ],
    },
  });

  // Fetch mission dates when dateMission changes
  useEffect(() => {
    const dateMission = form.watch('dateMission');
    if (userId && dateMission) {
      axios.get('http://localhost:8010/api/mission-dates', {
        params: { userId, dateMission }
      })
        .then(res => {
          setMissionDates({
            dateDepart: res.data.Date_Sortie || '',
            heureDepart: res.data.Heure_Sortie || '',
            dateRetour: res.data.Date_Retour || '',
            heureRetour: res.data.Heure_Retour || '',
            vehicule: res.data.vehicule || '',
          });
        })
        .catch((err) => {
          setMissionDates({ dateDepart: '', heureDepart: '', dateRetour: '', heureRetour: '', vehicule: '' });
          if (err.response && err.response.status === "En attente") {
            if (typeof toast === 'function') {
              toast({
                title: 'Aucune mission validée',
                description: 'La mission sélectionnée n\'est pas validée ou n\'existe pas.',
                variant: 'destructive',
              });
            }
          }
        });
    } else {
      setMissionDates({ dateDepart: '', heureDepart: '', dateRetour: '', heureRetour: '', vehicule: '' });
    }
    // eslint-disable-next-line
  }, [userId, form.watch('dateMission')]);

  // When missionDates change, update form fields
  useEffect(() => {
    form.setValue('dateDepart', missionDates.dateDepart || '');
    form.setValue('heureDepart', missionDates.heureDepart || '');
    form.setValue('dateRetour', missionDates.dateRetour || '');
    form.setValue('heureRetour', missionDates.heureRetour || '');
    // eslint-disable-next-line
  }, [missionDates]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Get user id from JWT
      const token = localStorage.getItem("token");
      let userId = null;
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          userId = decoded.id || decoded.userId || null;
        } catch (e) { 
          console.error('Error decoding token:', e);
        }
      }
      if (!userId) throw new Error("Utilisateur non authentifié");

      // Get the mission to check if it has a vehicle assigned
      const missionResponse = await axios.get('http://localhost:8010/api/mission-dates', {
        params: { 
          userId, 
          dateMission: data.dateMission 
        }
      });

      const missionData = missionResponse.data;
      
      // Update mission details and vehicle status if needed
      const response = await axios.put("http://localhost:8010/api/update-mission-details", {
        userId,
        dateMission: data.dateMission,
        compteurDepart: data.compteurDepart,
        compteurArrive: data.compteurArrive,
        detailFrais: data.detailFrais,
        vehicleId: missionData.Véhicule_id // Pass the vehicle ID to the backend
      });

      toast({
        title: "Retour de mission enregistré",
        description: missionData.vehicule 
          ? `Le véhicule ${missionData.vehicule} a été marqué comme disponible.` 
          : "Le retour de mission a été enregistré avec succès.",
      });
      
      navigate("/frontoffice/dashboard");
    } catch (error: any) {
      console.error('Error submitting mission return:', error);
      
      let errorMessage = "Une erreur est survenue lors de l'enregistrement.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
        if (error.response.data.details) {
          errorMessage += `: ${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addDetailFrais = () => {
    const currentDetailFrais = form.getValues("detailFrais");
    form.setValue("detailFrais", [...currentDetailFrais, {
      date: "", dep: "", arr: "", dest: "", Km: "", montantKm: "", P_D: "",
      repas: "", diner: "", logement: "", detali: "", montantdet: ""
    }]);
  };

  const removeDetailFrais = (index: number) => {
    const currentDetailFrais = form.getValues("detailFrais");
    if (currentDetailFrais.length > 1) {
      form.setValue("detailFrais", currentDetailFrais.filter((_, i) => i !== index));
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
                <h1 className="text-xl font-bold text-white">Retour de Mission</h1>
                <p className="text-sm text-gray-300">Enregistrer le retour d'une mission</p>
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
              Formulaire de Retour de Mission
            </CardTitle>
            <CardDescription className="text-gray-300">
              Remplissez tous les champs pour enregistrer le retour de mission
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Informations de base */}
                <div className="bg-gray-800 p-4 border-b border-gray-600 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-6">

                    {/* <FormField
                      control={form.control}
                      name="referenceMission"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="font-semibold text-gray-300 w-40">Référence Ordre de Mission</FormLabel>
                          <FormControl>
                          <div className="bg-gray-700 px-3 py-1 border border-gray-600 w-21 text-center text-white">
                              {form.watch('referenceMission') || '000000'}
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
                          <FormLabel className="font-semibold text-gray-300 w-40">Date Mission</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />


                  </div>
                </div>

                {/* Référence et Date Mission */}
                <div className="bg-gray-800 p-4 border-b border-gray-600 rounded-lg">
                  <div className="flex items-center gap-4">
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="font-semibold text-gray-300 w-20">
                        Date Sortie
                      </FormLabel>
                      <div className="w-32 bg-gray-700 border border-gray-600 px-3 py-1 text-white rounded">
                        {form.watch('dateDepart') || '--'}
                      </div>
                    </FormItem>

                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="font-semibold text-gray-300 w-20">
                        Heure Sortie
                      </FormLabel>
                      <div className="w-20 bg-gray-700 border border-gray-600 px-3 py-1 text-white rounded">
                        {form.watch('heureDepart') || '--'}
                      </div>
                    </FormItem>
                  </div>

                  <div className="flex items-center gap-4">
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="font-semibold text-gray-300 w-20">
                        Date Retour
                      </FormLabel>
                      <div className="w-32 bg-gray-700 border border-gray-600 px-3 py-1 text-white rounded">
                        {form.watch('dateRetour') || '--'}
                      </div>
                    </FormItem>

                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="font-semibold text-gray-300 w-20">
                        Heure Retour
                      </FormLabel>
                      <div className="w-20 bg-gray-700 border border-gray-600 px-3 py-1 text-white rounded">
                        {form.watch('heureRetour') || '--'}
                      </div>
                    </FormItem>
                  </div>
                </div>

                {/* Compteurs */}
                <div className="bg-gray-800 p-4 border-b border-gray-600 rounded-lg">
                  <div className="grid md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="compteurDepart"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="font-semibold text-gray-300 w-40 flex items-center">
                            Compteur Départ
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0 Km"
                              {...field}
                              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                            // disabled={missionDates.vehicule === 'Moyen publique'}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="compteurArrive"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="font-semibold text-gray-300 w-40">Compteur Arrivée</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0 Km"
                              {...field}
                              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                            // disabled={missionDates.vehicule === 'Moyen publique'}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="kilometrageParcourus"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="font-semibold text-gray-300 w-40 flex items-center">

                            Kilométrage Parcouru
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0 km"
                              {...field}
                              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                            // disabled={missionDates.vehicule === 'Moyen publique'}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Frais */}
                {/* <div className="bg-gray-800 p-4 border-b border-gray-600 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="retourFrais"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="font-semibold text-gray-300 w-40 flex items-center">
                            Retour Frais
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0.00"
                              {...field}
                              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fraisDeplacement"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="font-semibold text-gray-300 w-40">Frais Déplacement</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0.00"
                              {...field}
                              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div> */}

                {/* Détail Frais */}
                <div className="bg-gray-800 p-4 border-b border-gray-600 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-orange-500" />
                      Détail Frais
                    </h3>
                    <Button
                      type="button"
                      onClick={addDetailFrais}
                      variant="outline"
                      size="sm"
                      className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>

                  <div className="space-y-1">
                    {form.watch("detailFrais").map((_, index) => (
                      <div key={index} className="grid md:grid-cols-6 gap-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                        <FormField
                          control={form.control}
                          name={`detailFrais.${index}.date`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="font-semibold text-gray-300">Date</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  {...field}
                                  className="w-15 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`detailFrais.${index}.dep`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="font-semibold text-gray-300">Depart</FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  placeholder="00:00"
                                  {...field}
                                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`detailFrais.${index}.arr`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="font-semibold text-gray-300">Arrivée</FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  placeholder="Arrivée"
                                  {...field}
                                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`detailFrais.${index}.dest`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="font-semibold text-gray-300">Destination</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Destination"
                                  {...field}
                                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`detailFrais.${index}.Km`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="font-semibold text-gray-300">Km</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="0.0"
                                  {...field}
                                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                // disabled={missionDates.vehicule !== 'Moyen publique'}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`detailFrais.${index}.montantKm`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="font-semibold text-gray-300">montant</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="dt"
                                  {...field}
                                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                // disabled={missionDates.vehicule !== 'Moyen publique'}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`detailFrais.${index}.P_D`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="font-semibold text-gray-300">P.D.</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="P.D."
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    const value = e.target.value;
                                    if (value && value !== "5") {
                                      alert("Attention: La valeur P.D. doit être égale à 5");
                                    }
                                  }}
                                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                  disabled={(() => {
                                    const dep = form.watch(`detailFrais.${index}.dep`);
                                    if (!dep) return false;
                                    // dep is 'HH:mm'
                                    const [h, m] = dep.split(":").map(Number);
                                    if (h > 6 || (h === 6 && m > 0)) return true;
                                    if (h > 12 || (h === 12 && m > 0)) return true;
                                    return false;
                                  })()}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`detailFrais.${index}.repas`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="font-semibold text-gray-300">repas</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="repas"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    const value = e.target.value;
                                    if (value && value !== "18") {
                                      alert("Attention: La valeur repas doit être égale à 18");
                                    }
                                  }}
                                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                  disabled={(() => {
                                    const arr = form.watch(`detailFrais.${index}.arr`);
                                    if (!arr) return false;
                                    const [h, m] = arr.split(":").map(Number);
                                    // Block if arr < 12:00
                                    if (h < 12) return true;
                                    return false;
                                  })()}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`detailFrais.${index}.diner`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="font-semibold text-gray-300">diner</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="diner"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    const value = e.target.value;
                                    if (value && value !== "18") {
                                      alert("Attention: La valeur diner doit être égale à 18");
                                    }
                                  }}
                                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                  disabled={(() => {
                                    const arr = form.watch(`detailFrais.${index}.arr`);
                                    if (!arr) return false;
                                    const [h, m] = arr.split(":").map(Number);
                                    // Block if arr < 12:00 or arr < 19:00
                                    if (h < 19) return true;
                                    return false;
                                  })()}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`detailFrais.${index}.logement`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="font-semibold text-gray-300">logement</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="logement"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    const value = e.target.value;
                                    if (value && value !== "40") {
                                      alert("Attention: La valeur logement doit être égale à 40");
                                    }
                                  }}
                                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                  disabled={(() => {
                                    const arr = form.watch(`detailFrais.${index}.arr`);
                                    if (!arr) return false;
                                    const [h, m] = arr.split(":").map(Number);
                                    // Block if arr < 12:00 or arr < 19:00
                                    if (h < 19) return true;
                                    return false;
                                  })()}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`detailFrais.${index}.detali`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="font-semibold text-gray-300">detali</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="detali"
                                  {...field}
                                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`detailFrais.${index}.montantdet`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="font-semibold text-gray-300">montant</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="montant"
                                  {...field}
                                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-end">
                          {form.watch("detailFrais").length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeDetailFrais(index)}
                              variant="outline"
                              size="sm"
                              className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Boutons d'action */}
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

export default RetourMission; 