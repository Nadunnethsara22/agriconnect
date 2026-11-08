import React, { useState } from "react";
import { 
  Sprout, 
  ShoppingBag, 
  TrendingUp, 
  PlusCircle, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Database, 
  Layers, 
  Check, 
  ChevronDown,
  ArrowRightLeft,
  Truck,
  FileText,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useMarketplace } from "../context/MarketplaceContext";
import { isFirebaseConfigured } from "../firebase";

export default function Navbar({ activePage, setActivePage, setAuthMode, onOpenFirebaseModal }) {
  const { user, isFarmer, isBuyer, isAdmin, logout, switchRole, loginAsDemoFarmer, loginAsDemoBuyer } = useAuth();
  const { pendingRequestsCount } = useMarketplace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigate = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div 
            onClick={() => navigate(isAdmin ? "analytics" : "landing")} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Agri<span className="text-emerald-600">Connect</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-100 text-emerald-800 tracking-wide">
                  LK
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 -mt-1 hidden sm:block">
                {isAdmin ? "National Price Intelligence Panel" : "ගොවි-පාරිභෝගික කෘෂි වෙළඳපොළ"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {isAdmin ? (
              <button
                onClick={() => navigate("analytics")}
                className="px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center space-x-2 bg-purple-100 text-purple-900 border border-purple-200 shadow-xs"
              >
                <TrendingUp className="w-4 h-4 text-purple-700" />
                <span>Market Prices & Trends</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("landing")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activePage === "landing"
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  Home
                </button>

                <button
                  onClick={() => navigate("marketplace")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-1.5 ${
                    activePage === "marketplace" || activePage === "product-details"
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>Marketplace</span>
                </button>

                <button
                  onClick={() => navigate("buyer-requests")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-1.5 relative ${
                    activePage === "buyer-requests"
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Buyer Requests</span>
                  {pendingRequestsCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => navigate("analytics")}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-1.5 ${
                    activePage === "analytics"
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Market Prices & Trends</span>
                </button>

                {isFarmer && (
                  <button
                    onClick={() => navigate("farmer-dashboard")}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-1.5 ${
                      activePage === "farmer-dashboard"
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>Farmer Dashboard</span>
                  </button>
                )}
              </>
            )}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* If farmer: Add Product Action */}
            {isFarmer && (
              <button
                onClick={() => navigate("add-product")}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            )}

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <img
                    src={user.avatar || (isAdmin ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" : isFarmer ? "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80" : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80")}
                    alt={user.displayName}
                    className={`w-7 h-7 rounded-full object-cover border ${isAdmin ? "border-purple-500" : isFarmer ? "border-emerald-400" : "border-amber-400"}`}
                  />
                  <div className="text-left text-xs leading-tight">
                    <p className="font-semibold text-slate-800 line-clamp-1">{user.displayName}</p>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      isAdmin ? "text-purple-700" : isFarmer ? "text-emerald-700" : "text-amber-700"
                    }`}>
                      {user.role} ({user.district})
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in text-xs">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900">{user.displayName}</p>
                      <p className="text-slate-500 text-[11px] truncate">{user.email}</p>
                      <p className="text-emerald-700 font-medium mt-1">
                        📍 {user.designation || user.farmName || user.businessName || user.district}
                      </p>
                    </div>

                    {isAdmin ? (
                      <>
                        <button
                          onClick={() => { setProfileDropdownOpen(false); navigate("analytics"); }}
                          className="w-full text-left px-3 py-2 hover:bg-purple-50 text-purple-800 font-bold flex items-center space-x-2"
                        >
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          <span>Market Prices & Trends</span>
                        </button>

                        <button
                          onClick={() => { setProfileDropdownOpen(false); onOpenFirebaseModal(); }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                        >
                          <Database className="w-4 h-4 text-slate-500" />
                          <span>Firebase Settings</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setProfileDropdownOpen(false); navigate("profile"); }}
                          className="w-full text-left px-3 py-2 hover:bg-emerald-50 hover:text-emerald-800 flex items-center space-x-2 text-slate-700 font-medium"
                        >
                          <User className="w-4 h-4 text-emerald-600" />
                          <span>Edit Profile (මගේ ගිණුම)</span>
                        </button>

                        {isFarmer && (
                          <button
                            onClick={() => { setProfileDropdownOpen(false); navigate("farmer-dashboard"); }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                          >
                            <Layers className="w-4 h-4 text-emerald-600" />
                            <span>Farmer Dashboard</span>
                          </button>
                        )}

                        {isBuyer && (
                          <button
                            onClick={() => { setProfileDropdownOpen(false); navigate("buyer-requests"); }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                          >
                            <ShoppingBag className="w-4 h-4 text-amber-600" />
                            <span>My Purchase Orders</span>
                          </button>
                        )}

                        <button
                          onClick={() => { setProfileDropdownOpen(false); onOpenFirebaseModal(); }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                        >
                          <Database className="w-4 h-4 text-slate-500" />
                          <span>Firebase Settings</span>
                        </button>
                      </>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => { setProfileDropdownOpen(false); logout(); }}
                      className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (setAuthMode) setAuthMode("login");
                    navigate("auth");
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    if (setAuthMode) setAuthMode("register");
                    navigate("auth");
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-fade-in text-sm">
          {isAdmin ? (
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs">
                <p className="font-bold text-purple-900">{user?.displayName || "Market Price Controller"}</p>
                <p className="text-purple-700 text-[11px]">{user?.email}</p>
                <p className="text-[10px] text-purple-600 font-medium mt-0.5">National Economic Centre Price Authority</p>
              </div>
              <button
                onClick={() => navigate("analytics")}
                className="w-full text-left px-3 py-2.5 rounded-xl font-bold bg-purple-600 text-white flex items-center space-x-2 shadow-sm"
              >
                <TrendingUp className="w-4 h-4 text-purple-200" />
                <span>Market Prices & Trends</span>
              </button>
            </div>
          ) : (
            <>
              {user && (
                <div className="p-3 bg-slate-50 rounded-xl mb-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 text-xs">{user.displayName}</p>
                    <p className="text-[11px] text-slate-400">{user.email}</p>
                  </div>
                  <button
                    onClick={() => navigate("profile")}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors uppercase"
                  >
                    Edit Profile
                  </button>
                </div>
              )}

              <button
                onClick={() => navigate("landing")}
                className="w-full text-left px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100"
              >
                Home
              </button>
              <button
                onClick={() => navigate("marketplace")}
                className="w-full text-left px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Product Marketplace</span>
                <span className="text-xs text-emerald-600 font-normal">Browse 8+ Crops</span>
              </button>
              <button
                onClick={() => navigate("buyer-requests")}
                className="w-full text-left px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Buyer Purchase Requests</span>
                {pendingRequestsCount > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-amber-500 text-white rounded-full font-bold">
                    {pendingRequestsCount} new
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate("analytics")}
                className="w-full text-left px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100"
              >
                Market Prices & Price Statistics
              </button>

              {isFarmer && (
                <>
                  <button
                    onClick={() => navigate("farmer-dashboard")}
                    className="w-full text-left px-3 py-2 rounded-lg font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                  >
                    Farmer Dashboard
                  </button>
                  <button
                    onClick={() => navigate("add-product")}
                    className="w-full text-left px-3 py-2 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Add Agricultural Product</span>
                  </button>
                </>
              )}
            </>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenFirebaseModal(); }}
              className="text-xs text-slate-600 flex items-center space-x-1"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Firebase Configuration</span>
            </button>
            {user ? (
              <button
                onClick={logout}
                className="text-xs text-red-600 font-semibold"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center space-x-2 text-xs font-semibold">
                <button
                  onClick={() => {
                    if (setAuthMode) setAuthMode("login");
                    navigate("auth");
                  }}
                  className="text-slate-700 hover:text-emerald-700"
                >
                  Sign In
                </button>
                <span className="text-slate-300">•</span>
                <button
                  onClick={() => {
                    if (setAuthMode) setAuthMode("register");
                    navigate("auth");
                  }}
                  className="text-emerald-700 hover:text-emerald-800 font-bold"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
