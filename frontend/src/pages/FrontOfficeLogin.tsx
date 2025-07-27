
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const FrontOfficeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation d'authentification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans votre espace personnel",
      });
      navigate("/frontoffice/dashboard");
    } else {
      toast({
        title: "Erreur de connexion",
        description: "Veuillez vérifier vos identifiants",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link 
          to="/" 
          className="inline-flex items-center text-[#cccc00] hover:text-[#ffff00] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        <Card className="shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#cccc00] to-[#ffff00] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-black" />
            </div>
            <CardTitle className="text-2xl text-white">Espace Personnel</CardTitle>
            <CardDescription className="text-gray-400">
              Connectez-vous à votre compte
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 font-medium">
                  Adresse email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@entreprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-[#cccc00] focus:ring-[#cccc00]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 font-medium">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-[#cccc00] focus:ring-[#cccc00]"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-600 bg-gray-800 text-[#cccc00] focus:ring-[#cccc00]" />
                  <span className="ml-2 text-gray-400">Se souvenir de moi</span>
                </label>
                <Link to="/admin/forgot_password" className="text-[#cccc00] hover:text-[#ffff00]">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#cccc00] to-[#ffff00] hover:from-[#aaaa00] hover:to-[#cccc00] text-black font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FrontOfficeLogin;
