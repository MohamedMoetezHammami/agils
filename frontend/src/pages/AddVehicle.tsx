import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface VehicleFormData {
  marque: string;
  modele: string;
  matricule: string;
  puissance: string;
}

const AddVehicle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<VehicleFormData>({
    defaultValues: {
      marque: "",
      modele: "",
      matricule: "",
      puissance: "",
    },
  });

  const onSubmit = async (data: VehicleFormData) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8010/api/vehicules", data);
      toast({
        title: "Véhicule ajouté avec succès",
        description: `${data.marque} ${data.modele} a été ajouté au parc automobile`,
      });
      navigate("/backoffice/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur est survenue lors de l'ajout du véhicule.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Ajouter un Véhicule</h1>
                  <p className="text-sm text-gray-300">Enregistrer un nouveau véhicule dans le parc automobile</p>
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
              <Car className="w-5 h-5 mr-2 text-orange-500" />
              Informations du Véhicule
            </CardTitle>
            <CardDescription className="text-gray-300">
              Remplissez tous les champs pour ajouter le véhicule au système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="marque"
                    rules={{ required: "La marque du véhicule est requise" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Marque de véhicule</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Toyota, Renault, Mercedes..."
                            {...field}
                            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="modele"
                    rules={{ required: "Le modèle du véhicule est requis" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Modèle de véhicule</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Corolla, Clio, C-Class..."
                            {...field}
                            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="matricule"
                    rules={{
                      required: "Le matricule est requis",
                      pattern: {
                        value: /^[0-9]{1,4}\s?[A-Z]{1,3}\s?[0-9]{1,4}$/,
                        message: "Format de matricule invalide"
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Matricule</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: 123 TUN 456"
                            {...field}
                            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="puissance"
                    rules={{
                      required: "La puissance est requise",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "La puissance doit être un nombre"
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Puissance (CV)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: 120 (CV)"
                            type="number"
                            {...field}
                            className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/backoffice/dashboard")}
                    className="text-gray-300 border-gray-600 hover:bg-gray-800"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Enregistrement..." : "Ajouter le véhicule"}
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

export default AddVehicle;