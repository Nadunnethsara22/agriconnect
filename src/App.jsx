import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MarketplaceProvider } from "./context/MarketplaceContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FirebaseModal from "./components/FirebaseModal";

// Pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import FarmerDashboard from "./pages/FarmerDashboard";
import AddProduct from "./pages/AddProduct";
import BuyerRequests from "./pages/BuyerRequests";
import Analytics from "./pages/Analytics";
import ProfilePage from "./pages/ProfilePage";
import { Lock, Sprout, ShoppingBag } from "lucide-react";

function AppContent() {
  const { user, isFarmer, isAdmin } = useAuth();
  const [activePage, setActivePage] = useState("landing");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [firebaseModalOpen, setFirebaseModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'register'
  const [initialRole, setInitialRole] = useState("farmer"); // 'farmer' or 'buyer'

  // Admin users are strictly dedicated to Market Prices & Trends (analytics)
  React.useEffect(() => {
    if (isAdmin && activePage !== "analytics") {
      setActivePage("analytics");
    }
  }, [isAdmin, activePage]);

  // Auth Protection Guards
  const isProtectedFarmerPage = activePage === "farmer-dashboard" || activePage === "add-product";
  const isProtectedBuyerPage = activePage === "buyer-requests";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white">
      {/* Main Top Navigation */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        setAuthMode={setAuthMode}
        onOpenFirebaseModal={() => setFirebaseModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* PUBLIC PAGE: Landing Page */}
        {activePage === "landing" && (
          <LandingPage 
            setActivePage={setActivePage} 
            setSelectedProduct={setSelectedProduct} 
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            setAuthMode={setAuthMode}
            setInitialRole={setInitialRole}
          />
        )}

        {/* AUTH PAGE: Login & Register */}
        {activePage === "auth" && (
          <AuthPage 
            setActivePage={setActivePage} 
            authMode={authMode}
            setAuthMode={setAuthMode}
            initialRole={initialRole}
            setInitialRole={setInitialRole}
          />
        )}

        {/* PUBLIC PAGE: Marketplace */}
        {activePage === "marketplace" && (
          <Marketplace 
            setActivePage={setActivePage} 
            setSelectedProduct={setSelectedProduct} 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
          />
        )}

        {/* PUBLIC PAGE: Product Details */}
        {activePage === "product-details" && (
          <ProductDetails 
            product={selectedProduct} 
            setActivePage={setActivePage} 
            setSelectedProduct={setSelectedProduct} 
          />
        )}

        {/* PUBLIC PAGE: Market Prices & Daily Index */}
        {activePage === "analytics" && (
          <Analytics 
            setActivePage={setActivePage} 
          />
        )}

        {/* PROTECTED PAGE: Farmer Dashboard */}
        {activePage === "farmer-dashboard" && (
          !user ? (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-xl animate-fade-in">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl mx-auto flex items-center justify-center">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Farmer Account Required</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                You must be logged in as a registered Farmer to view your crops, manage inventory, and review incoming purchase requests.
              </p>
              <button
                onClick={() => setActivePage("auth")}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                Sign In / Register as Farmer
              </button>
            </div>
          ) : (
            <FarmerDashboard 
              setActivePage={setActivePage} 
              setSelectedProduct={setSelectedProduct} 
            />
          )
        )}

        {/* PROTECTED PAGE: Add Product */}
        {activePage === "add-product" && (
          !user || !isFarmer ? (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-xl animate-fade-in">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl mx-auto flex items-center justify-center">
                <Sprout className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Farmer Access Only</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Only verified farmers can publish agricultural produce and set wholesale rates. Please sign in with a farmer account.
              </p>
              <button
                onClick={() => setActivePage("auth")}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                Sign In as Farmer
              </button>
            </div>
          ) : (
            <AddProduct 
              setActivePage={setActivePage} 
            />
          )
        )}

        {/* PROTECTED PAGE: Buyer Requests */}
        {activePage === "buyer-requests" && (
          !user ? (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-xl animate-fade-in">
              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl mx-auto flex items-center justify-center">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Sign In to Manage Orders</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Please register or sign in to track your purchase orders, post buying requirements, and communicate with farmers.
              </p>
              <button
                onClick={() => setActivePage("auth")}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                Sign In to View Orders
              </button>
            </div>
          ) : (
            <BuyerRequests 
              setActivePage={setActivePage} 
            />
          )
        )}

        {/* PROFILE PAGE: Farmer & Buyer Profile Management */}
        {activePage === "profile" && (
          <ProfilePage 
            setActivePage={setActivePage} 
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        setActivePage={setActivePage} 
        setSelectedCategory={setSelectedCategory}
      />

      {/* Firebase Connection & Config Modal */}
      <FirebaseModal 
        isOpen={firebaseModalOpen} 
        onClose={() => setFirebaseModalOpen(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MarketplaceProvider>
        <AppContent />
      </MarketplaceProvider>
    </AuthProvider>
  );
}
