import React, { useState } from "react";
import { 
  Sprout, 
  ShoppingBag, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { SRI_LANKA_DISTRICTS } from "../data/mockData";

export default function AuthPage({ 
  setActivePage, 
  authMode = "login", 
  setAuthMode, 
  initialRole = "farmer", 
  setInitialRole 
}) {
  const { login, register, loginWithGoogle, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(authMode === "register");
  const [selectedRole, setSelectedRole] = useState(initialRole || "farmer"); // "farmer", "buyer", or "admin"
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Sync mode when navigated with specific authMode ('register' or 'login')
  React.useEffect(() => {
    setIsRegister(authMode === "register");
  }, [authMode]);

  React.useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  const switchTab = (toRegister) => {
    setIsRegister(toRegister);
    if (setAuthMode) {
      setAuthMode(toRegister ? "register" : "login");
    }
    setError("");
  };

  const handleGoogleSignIn = async () => {
    setError("");
    const res = await loginWithGoogle(selectedRole);
    if (res.success) {
      setSuccessMsg("Signed in with Google!");
      setTimeout(() => {
        if (res.user?.role === "admin" || res.user?.email?.toLowerCase().includes("admin")) {
          setActivePage("analytics");
        } else if (res.user?.role === "farmer") {
          setActivePage("farmer-dashboard");
        } else {
          setActivePage("marketplace");
        }
      }, 600);
    } else {
      setError(res.error || "Google sign-in failed.");
    }
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
    phone: "",
    district: "Nuwara Eliya",
    location: "",
    farmName: "",
    businessName: "",
    mainCrops: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!formData.email || !formData.password) {
      setError("Please fill in email and password.");
      return;
    }

    if (isRegister) {
      if (!formData.displayName) {
        setError("Please provide your full name.");
        return;
      }
      const res = await register({
        ...formData,
        role: selectedRole
      });
      if (res.success) {
        setSuccessMsg("Account created successfully!");
        setTimeout(() => {
          if (selectedRole === "admin") {
            setActivePage("analytics");
          } else if (selectedRole === "farmer") {
            setActivePage("farmer-dashboard");
          } else {
            setActivePage("marketplace");
          }
        }, 600);
      } else {
        setError(res.error || "Failed to register.");
      }
    } else {
      const res = await login(formData.email, formData.password, selectedRole);
      if (res.success) {
        setSuccessMsg(`Welcome back! Signed in as ${res.user?.role || selectedRole}`);
        setTimeout(() => {
          const effectiveRole = res.user?.role || selectedRole;
          if (effectiveRole === "admin" || res.user?.email?.toLowerCase().includes("admin")) {
            setActivePage("analytics");
          } else if (effectiveRole === "farmer") {
            setActivePage("farmer-dashboard");
          } else {
            setActivePage("marketplace");
          }
        }, 600);
      } else {
        setError(res.error || "Invalid email or password.");
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
            <Sprout className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            {isRegister ? "Join AgriConnect Sri Lanka" : "Welcome Back"}
          </h2>
          <p className="text-xs text-slate-500">
            {isRegister 
              ? "Create your Farmer or Buyer account for direct agricultural trade" 
              : "Sign in to manage your harvests, prices, and buyer requests"}
          </p>
        </div>

        {/* Auth Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => switchTab(false)}
              className={`py-2 rounded-lg transition-all ${
                !isRegister ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign In (ඇතුල් වන්න)
            </button>
            <button
              type="button"
              onClick={() => switchTab(true)}
              className={`py-2 rounded-lg transition-all ${
                isRegister ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Register New (ලියාපදිංචි වන්න)
            </button>
          </div>

          {/* Role Selector (Prominently visible for BOTH Sign In & Register) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                {isRegister ? "Select Account Type (ගිණුම් වර්ගය):" : "Signing In As (ඔබගේ භූමිකාව තෝරන්න):"}
              </label>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1.5 shadow-sm ${
                selectedRole === "admin"
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : selectedRole === "farmer"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  selectedRole === "admin" ? "bg-purple-600 animate-pulse" : selectedRole === "farmer" ? "bg-emerald-600 animate-pulse" : "bg-amber-600 animate-pulse"
                }`} />
                <span>
                  {selectedRole === "admin" ? "Admin (පරිපාලක)" : selectedRole === "farmer" ? "Farmer (ගොවි)" : "Buyer (ගැනුම්කරු)"}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole("farmer")}
                className={`p-2.5 rounded-xl border-2 transition-all flex flex-col items-center text-center space-y-1 ${
                  selectedRole === "farmer"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm ring-2 ring-emerald-500/20 font-bold"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50"
                }`}
              >
                <Sprout className={`w-5 h-5 ${selectedRole === "farmer" ? "text-emerald-600" : "text-slate-400"}`} />
                <span className="text-[11px] font-bold">Farmer (ගොවි)</span>
                <span className="text-[9px] text-slate-500 leading-tight">
                  {isRegister ? "Sell harvest" : "Manage harvest"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("buyer")}
                className={`p-2.5 rounded-xl border-2 transition-all flex flex-col items-center text-center space-y-1 ${
                  selectedRole === "buyer"
                    ? "border-amber-600 bg-amber-50 text-amber-900 shadow-sm ring-2 ring-amber-500/20 font-bold"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50"
                }`}
              >
                <ShoppingBag className={`w-5 h-5 ${selectedRole === "buyer" ? "text-amber-600" : "text-slate-400"}`} />
                <span className="text-[11px] font-bold">Buyer (ගැනුම්කරු)</span>
                <span className="text-[9px] text-slate-500 leading-tight">
                  {isRegister ? "Wholesale" : "Buy crops"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={`p-2.5 rounded-xl border-2 transition-all flex flex-col items-center text-center space-y-1 ${
                  selectedRole === "admin"
                    ? "border-purple-600 bg-purple-50 text-purple-900 shadow-sm ring-2 ring-purple-500/20 font-bold"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50/50"
                }`}
              >
                <ShieldCheck className={`w-5 h-5 ${selectedRole === "admin" ? "text-purple-600" : "text-slate-400"}`} />
                <span className="text-[11px] font-bold">Admin (පරිපාලක)</span>
                <span className="text-[9px] text-slate-500 leading-tight">Price trends</span>
              </button>
            </div>
          </div>

          {/* Role Status Helper Message */}
          {selectedRole === "admin" ? (
            <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-center space-x-2 animate-fade-in">
              <ShieldCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <p className="text-[11px] text-purple-800 leading-tight">
                <strong>Market Price Administrator: </strong>
                {isRegister
                  ? "Admins manage nationwide wholesale price benchmarks. Farm/company details not required."
                  : "Access daily market price updates and commodity trend analytics."}
              </p>
            </div>
          ) : selectedRole === "farmer" ? (
            <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center space-x-2 animate-fade-in">
              <Sprout className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-[11px] text-emerald-800 leading-tight">
                <strong>Farmer Portal (ගොවි පිවිසුම): </strong>
                {isRegister
                  ? "Register your farm to sell crops directly to wholesale and retail buyers."
                  : "Sign in to update harvest listings and respond to purchase orders."}
              </p>
            </div>
          ) : (
            <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center space-x-2 animate-fade-in">
              <ShoppingBag className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-[11px] text-amber-800 leading-tight">
                <strong>Buyer Portal (ගැනුම්කරු පිවිසුම): </strong>
                {isRegister
                  ? "Register as a wholesale buyer, supermarket, exporter, or retailer."
                  : "Sign in to browse farm listings and post buying requirements."}
              </p>
            </div>
          )}

          {/* Quick Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-sm flex items-center justify-center space-x-2.5 transition-colors group"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>
              Continue with Google as {selectedRole === "admin" ? "Admin (පරිපාලක)" : selectedRole === "farmer" ? "Farmer (ගොවි)" : "Buyer (ගැනුම්කරු)"}
            </span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-400">or with email & password</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder={selectedRole === "farmer" ? "e.g. Sunil Bandara" : "e.g. Priyantha Silva"}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={
                    selectedRole === "admin"
                      ? "admin@agriconnect.lk"
                      : selectedRole === "farmer"
                      ? "farmer@example.com"
                      : "buyer@example.com"
                  }
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Extra Role-specific fields for Farmers & Buyers only */}
            {isRegister && selectedRole !== "admin" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {SRI_LANKA_DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+94 77 123 4567"
                      className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {selectedRole === "farmer" ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Farm / Lands Name</label>
                      <input
                        type="text"
                        name="farmName"
                        value={formData.farmName}
                        onChange={handleChange}
                        placeholder="e.g. Green Valley Highland Farm"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Farm / Village Address (ගොවිපල පිහිටි ලිපිනය / ගම)</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Boralanda Village, Welimada"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Business / Company Name</label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="e.g. Colombo Wholesale & Supermarket"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Business / Warehouse Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Peliyagoda Wholesale Market, Kelaniya"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 ${
                selectedRole === "admin"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : selectedRole === "farmer"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              <span>
                {loading
                  ? "Processing..."
                  : isRegister
                  ? selectedRole === "admin"
                    ? "Create Admin Account (පරිපාලක ලියාපදිංචිය)"
                    : selectedRole === "farmer"
                    ? "Create Farmer Account (ගොවි ලියාපදිංචිය)"
                    : "Create Buyer Account (ගැනුම්කරු ලියාපදිංචිය)"
                  : selectedRole === "admin"
                  ? "Sign In as Admin (පරිපාලක පිවිසුම)"
                  : selectedRole === "farmer"
                  ? "Sign In as Farmer (ගොවි පිවිසුම)"
                  : "Sign In as Buyer (ගැනුම්කරු පිවිසුම)"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
