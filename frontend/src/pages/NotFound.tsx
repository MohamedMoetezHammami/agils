import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-[#cccc00]">404</h1>
        <p className="text-2xl text-white mb-4">Oops! Page introuvable</p>
        <p className="text-gray-300 mb-8">La page que vous recherchez n'existe pas.</p>
        <a 
          href="/" 
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#cccc00] to-[#ffff00] hover:from-[#aaaa00] hover:to-[#cccc00] text-black font-medium rounded-lg transition-all duration-300"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default NotFound;
