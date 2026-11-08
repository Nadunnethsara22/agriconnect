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
  const { login, register, loginWithGoogle, loginAsDemoAdmin, loading } = useAuth();
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
      const res = await login(formData.email, formData.password);
      if (res.success) {
        setSuccessMsg("Welcome back!");
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
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchTab(true)}
              className={`py-2 rounded-lg transition-all ${
                isRegister ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Register New
            </button>
          </div>

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
            <span>Continue with Google</span>
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
            {/* Role Selector (visible in Register mode) */}
            {isRegister && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Select Your Account Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <div
                    onClick={() => setSelectedRole("farmer")}
                    className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center space-y-1 ${
                      selectedRole === "farmer"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <Sprout className="w-5 h-5 text-emerald-600" />
                    <span className="text-[11px] font-bold">Farmer (ගොවි)</span>
                    <span className="text-[9px] text-slate-500">Sell harvest</span>
                  </div>

                  <div
                    onClick={() => setSelectedRole("buyer")}
                    className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center space-y-1 ${
                      selectedRole === "buyer"
                        ? "border-amber-600 bg-amber-50 text-amber-800"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5 text-amber-600" />
                    <span className="text-[11px] font-bold">Buyer (ගැනුම්කරු)</span>
                    <span className="text-[9px] text-slate-500">Wholesale</span>
                  </div>

                  <div
                    onClick={() => setSelectedRole("admin")}
                    className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center space-y-1 ${
                      selectedRole === "admin"
                        ? "border-purple-600 bg-purple-50 text-purple-800 font-bold"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    <span className="text-[11px] font-bold">Admin (පරිපාලක)</span>
                    <span className="text-[9px] text-slate-500">Update Prices</span>
                  </div>
                </div>
              </div>
            )}

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
                  placeholder="your.email@example.com"
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

            {/* Informational banner when Admin role is selected */}
            {isRegister && selectedRole === "admin" && (
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 space-y-1 animate-fade-in">
                <p className="font-bold flex items-center space-x-1.5 text-purple-800">
                  <ShieldCheck className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>Market Price Administrator</span>
                </p>
                <p className="text-[11px] text-purple-700 leading-relaxed">
                  Admins manage nationwide wholesale price benchmarks. District, farm, or company details are not required.
                </p>
              </div>
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
              <span>{loading ? "Processing..." : isRegister ? "Create Account" : "Sign In to AgriConnect"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          {!isRegister && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-[11px] text-slate-400 text-center font-medium">Testing & Demo Accounts:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    loginAsDemoAdmin();
                    setSuccessMsg("Signed in as Market Price Admin!");
                    setTimeout(() => setActivePage("analytics"), 400);
                  }}
                  className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg font-bold text-[11px] border border-purple-200 flex items-center justify-center space-x-1 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Admin Login (පරිපාලක)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, email: "admin@agriconnect.lk", password: "password123" });
                  }}
                  className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg font-medium text-[11px] border border-slate-200 transition-colors text-center"
                >
                  Auto-fill Admin Email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
