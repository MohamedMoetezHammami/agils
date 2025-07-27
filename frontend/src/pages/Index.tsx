
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";

const Index = () => {

  const [id, setId] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8010/api/login", {
        id,
        motDePasse
      });
      const data = response.data;
      localStorage.setItem("token", data.token);
      // Redirect according to role
      switch (data.role) {
        case "admin":
          navigate("/backoffice/dashboard");
          break;
        case "manager":
          navigate("/manager/dashboard");
          break;
        case "financier":
          navigate("/financial/dashboard");
          break;
        case "employe":
          navigate("/frontoffice/dashboard");
          break;
        default:
          setError("Rôle inconnu");
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur de connexion au serveur");
      }
    }
    setIsLoading(false);
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="h-20" />
        </div>
        <Card className="shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl text-white">Connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="id" className="block text-gray-300 font-medium mb-2">ID</label>
                <Input
                  id="id"
                  type="text"
                  placeholder="ID"
                  value={id}
                  onChange={e => setId(e.target.value)}
                  className="h-12 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-[#cccc00] focus:ring-[#cccc00]"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-300 font-medium mb-2">Mot de passe</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={motDePasse}
                  onChange={e => setMotDePasse(e.target.value)}
                  className="h-12 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-[#cccc00] focus:ring-[#cccc00]"
                  required
                />
              </div>
              {error && <div className="text-red-500 text-center">{error}</div>}
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

export default Index;
