
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FrontOfficeLogin from "./pages/FrontOfficeLogin";
import BackOfficeLogin from "./pages/BackOfficeLogin";
import FrontOfficeDashboard from "./pages/FrontOfficeDashboard";
import BackOfficeDashboard from "./pages/BackOfficeDashboard";
import ManagerLogin from "./pages/ManagerLogin";
import ManagerDashboard from "./pages/ManagerDashboard";
import FinancialLogin from "./pages/FinancialLogin";
import FinancialDashboard from "./pages/FinancialDashboard";
import AddVehicle from "./pages/AddVehicle";
import ParcAutomobile from "./pages/ParcAutomobile";
import Maintenance from "./pages/Maintenance";
import NouvelleMission from "./pages/NouvelleMission";
import MesMissions from "./pages/MesMissions";
import ValidationRemboursements from "./pages/touteslesdemandes";
import HistoriqueComplet from "./pages/HistoriqueComplet";
import ValidationMission from "./pages/ValidationMission";
import AjouterEmploye from "./pages/AjouterEmploye";
import ListePersonnel from "./pages/ListePersonnel";
import NotFound from "./pages/NotFound";
import RetourMission from "./pages/retourMission";
import SuiviRemboursements from "./pages/SuiviRemboursements";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          <Route path="/frontoffice/login" element={<FrontOfficeLogin />} />
          <Route path="/frontoffice/dashboard" element={<FrontOfficeDashboard />} />
          <Route path="/frontoffice/nouvelle_mission" element={<NouvelleMission />} />
          <Route path="/frontoffice/mes_missions" element={<MesMissions />} />
          <Route path="/frontoffice/retour_mission" element={<RetourMission />} />
          <Route path="/frontoffice/suivi_remboursements" element={<SuiviRemboursements />} />

          
          <Route path="/backoffice/login" element={<BackOfficeLogin />} />
          <Route path="/backoffice/dashboard" element={<BackOfficeDashboard />} />
          <Route path="/backoffice/add_vehicle" element={<AddVehicle />} />
          <Route path="/backoffice/parc_automobile" element={<ParcAutomobile />} />
          <Route path="/backoffice/maintenance" element={<Maintenance />} />
          <Route path="/backoffice/ajouter_employe" element={<AjouterEmploye />} />
          <Route path="/backoffice/liste_personnel" element={<ListePersonnel />} />


          <Route path="/manager/login" element={<ManagerLogin />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manger/nouvelle_mission" element={<NouvelleMission />} />
          <Route path="/manager/validation_mission" element={<ValidationMission />} />
          <Route path="/manager/mes_missions" element={<MesMissions />} />
          <Route path="/manager/retour_mission" element={<RetourMission />} />
          <Route path="/manager/suivi_remboursements" element={<SuiviRemboursements />} />


          <Route path="/financial/login" element={<FinancialLogin />} />
          <Route path="/financial/dashboard" element={<FinancialDashboard />} />
          <Route path="/financial/validation_remboursements" element={<ValidationRemboursements />} />
          <Route path="/financial/historique_complet" element={<HistoriqueComplet />} />

          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
