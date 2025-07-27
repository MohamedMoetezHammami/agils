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
              <Link to="/backoffice/dashboard" className="text-primary hover:text-primary/80">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Car className="w-6 h-6 text-background" />
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Ajouter un Véhicule</h1>
                <p className="text-sm text-muted-foreground">Enregistrer un nouveau véhicule dans le parc automobile</p>
              </div>
            </div>


          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Car className="w-5 h-5 mr-2 text-primary" />
                Informations du Véhicule
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Remplissez tous les champs pour ajouter le véhicule au système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="marque"
                    rules={{ required: "La marque du véhicule est requise" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Marque de véhicule</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Toyota, Renault, Mercedes..."
                            {...field}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
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
                        <FormLabel className="text-foreground">Modèle de véhicule</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Corolla, Clio, C-Class..."
                            {...field}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
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
                        <FormLabel className="text-foreground">Matricule</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: 123 ABC 456"
                            {...field}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
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
                        <FormLabel className="text-foreground">Puissance (CV)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: 120"
                            type="number"
                            {...field}
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Enregistrement..." : "Ajouter le véhicule"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/backoffice/dashboard")}
                      className="flex-1 border-border text-muted-foreground hover:bg-muted"
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AddVehicle;