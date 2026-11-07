import React, { useState, useEffect } from "react";
import { 
  User, 
  Sprout, 
  ShoppingBag, 
  Phone, 
  MapPin, 
  Mail, 
  Building2, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  ArrowLeft, 
  ShieldCheck, 
  Layers, 
  FileText,
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useMarketplace } from "../context/MarketplaceContext";
import { SRI_LANKA_DISTRICTS } from "../data/mockData";

// Curated avatar presets for farmers and buyers
const AVATAR_PRESETS = [
  { label: "Highland Farmer", url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80" },
  { label: "Village Farmer", url: "https://images.unsplash.com/photo-1595956553066-fe24a8c33395?auto=format&fit=crop&w=300&q=80" },
  { label: "Organic Grower", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
  { label: "Wholesale Merchant", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
  { label: "Supermarket Buyer", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80" }
];

export default function ProfilePage({ setActivePage }) {
  const { user, isFarmer, isBuyer, isAdmin, updateProfile } = useAuth();
  const { products, buyerRequests } = useMarketplace();

  const [formData, setFormData] = useState({
    displayName: "",
    phone: "",
    district: "Colombo",
    location: "",
    bio: "",
    avatar: "",
    designation: "",
    // Farmer specific
    farmName: "",
    mainCrops: "",
    // Buyer specific
    businessName: "",
    buyerType: "Supermarket Chain / Wholesale"
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        phone: user.phone || "+94 77 123 4567",
        district: user.district || "Colombo",
        location: user.location || (user.district ? `${user.district}, Sri Lanka` : "Colombo, Sri Lanka"),
        bio: user.bio || "",
        designation: user.designation || (isAdmin ? "Economic Centre Market Price Analyst" : ""),
        avatar: user.avatar || (isAdmin ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" : isFarmer ? AVATAR_PRESETS[0].url : AVATAR_PRESETS[3].url),
        farmName: user.farmName || (isFarmer ? `${user.displayName || "My"}'s Highland Farm` : ""),
        mainCrops: user.mainCrops || (isFarmer ? "Carrots, Leeks, Potatoes" : ""),
        businessName: user.businessName || (isBuyer ? `${user.displayName || "My"} Wholesale Network` : ""),
        buyerType: user.buyerType || "Supermarket Chain / Wholesale"
      });
    }
  }, [user, isFarmer, isBuyer, isAdmin]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-xl">
        <User className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Please Sign In</h2>
        <p className="text-xs text-slate-500">You must be logged in to view and edit your profile.</p>
        <button
          onClick={() => setActivePage("auth")}
          className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Related stats
  const farmerCropCount = products.filter(p => p.farmerId === user.uid || p.farmerId === "farmer-1").length;
  const buyerOrdersCount = buyerRequests.filter(r => r.buyerId === user.uid || r.buyerId === "buyer-1").length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleAvatarSelect = (url) => {
    setFormData(prev => ({ ...prev, avatar: url }));
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await updateProfile(formData);
      if (res?.success !== false) {
        setSuccessMsg("Profile updated successfully!");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(res?.error || "Failed to update profile.");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage(isFarmer ? "farmer-dashboard" : "marketplace")}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {isFarmer ? "Farmer Dashboard" : "Marketplace"}</span>
        </button>
      </div>

      {/* Profile Header Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white">
        {/* Cover banner */}
        <div className={`h-36 sm:h-44 w-full ${
          isAdmin
            ? "bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950"
            : isFarmer 
            ? "bg-gradient-to-r from-emerald-800 via-green-800 to-teal-900" 
            : "bg-gradient-to-r from-amber-700 via-yellow-800 to-slate-900"
        }`}></div>

        {/* User Info Bar */}
        <div className="px-6 pb-6 pt-0 sm:flex sm:items-end sm:justify-between sm:space-x-5 relative">
          <div className="flex items-end -mt-16 sm:-mt-20 space-x-4">
            <div className="relative group">
              <img
                src={formData.avatar || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80"}
                alt={formData.displayName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-xl bg-slate-100"
              />
              <span className={`absolute bottom-1 right-1 p-1.5 rounded-xl text-white shadow-md ${
                isAdmin ? "bg-purple-600" : isFarmer ? "bg-emerald-600" : "bg-amber-600"
              }`}>
                {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : isFarmer ? <Sprout className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
              </span>
            </div>

            <div className="pb-2 space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {formData.displayName || user.displayName}
                </h1>
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {user.email} • {isAdmin ? "National Price Administrator" : isFarmer ? (formData.farmName || "Farm Producer") : (formData.businessName || "Wholesale Buyer")}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isAdmin ? "bg-purple-100 text-purple-800" : isFarmer ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {user.role} {isAdmin ? "(Price Controller)" : `(${formData.district})`}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                  🇱🇰 Sri Lanka
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="mt-4 sm:mt-0 flex items-center space-x-3 text-xs">
            {isAdmin ? (
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-right">
                <p className="text-slate-400 text-[10px]">Authority</p>
                <p className="text-lg font-black text-purple-900">Price Controller</p>
              </div>
            ) : isFarmer ? (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-right">
                <p className="text-slate-400 text-[10px]">Active Crops</p>
                <p className="text-lg font-black text-emerald-800">{farmerCropCount} Listed</p>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-right">
                <p className="text-slate-400 text-[10px]">Orders Placed</p>
                <p className="text-lg font-black text-amber-800">{buyerOrdersCount} Requests</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EDIT PROFILE FORM */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
        {/* Alerts */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2 text-xs text-emerald-800 animate-fade-in font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-2 text-xs text-red-700 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Avatar Presets & Photo */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Profile Photo & Avatar</span>
          </h2>

          <div className="space-y-2">
            <p className="text-xs text-slate-500">Choose a preset avatar or paste a custom profile image URL:</p>
            <div className="flex flex-wrap gap-3">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAvatarSelect(preset.url)}
                  className={`flex items-center space-x-2 p-1.5 pr-3 rounded-2xl border transition-all ${
                    formData.avatar === preset.url
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-sm"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-8 h-8 rounded-xl object-cover" />
                  <span className="text-xs">{preset.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Image URL</label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Basic Contact & Personal Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Personal & Contact Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name / Contact Person</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Your Full Name"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+94 77 123 4567"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
                >
                  {SRI_LANKA_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Village / City / Street Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Kandapola Village, Nuwara Eliya"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Role Specific Details */}
        {isAdmin ? (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Market Price Administrator Profile (මිල පරිපාලක විස්තර)</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Designation / Department</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="e.g. Economic Centre Market Price Analyst"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Administrative Notes & Oversight Bio</label>
              <textarea
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Market monitoring details, authorized market bulletin sources, agricultural intelligence notes..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-slate-700"
              ></textarea>
            </div>
          </div>
        ) : isFarmer ? (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Farmer & Agricultural Details (ගොවිපළ විස්තර)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Farm / Lands Name</label>
                <input
                  type="text"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                  placeholder="e.g. Green Valley Highland Organic Farms"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Main Crops Cultivated</label>
                <input
                  type="text"
                  name="mainCrops"
                  value={formData.mainCrops}
                  onChange={handleChange}
                  placeholder="e.g. Carrots, Leeks, Potatoes, Cabbage"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">About Your Farm & Cultivation Practices</label>
              <textarea
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Describe your farming experience, GAP certifications, organic fertilizers, harvesting schedule..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
              ></textarea>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Buyer & Business Details (ගැනුම්කරු විස්තර)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Store Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g. Colombo Fresh Supermarkets Network"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Category</label>
                <select
                  name="buyerType"
                  value={formData.buyerType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-700"
                >
                  <option value="Supermarket Chain / Wholesale">Supermarket Chain / Wholesale</option>
                  <option value="Wholesale Vegetable & Grain Merchant">Wholesale Vegetable & Grain Merchant</option>
                  <option value="Hotel & Restaurant Catering Chain">Hotel & Restaurant Catering Chain</option>
                  <option value="Agro Exporter / Food Processing">Agro Exporter / Food Processing</option>
                  <option value="Individual Household Buyer">Individual Household Buyer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Procurement Requirements & Purchasing Bio</label>
              <textarea
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Mention what crops you regularly buy in bulk, preferred packaging crates, delivery terms, cash settlement policy..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-700"
              ></textarea>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-[11px] text-slate-400">
            * Changes update your public profile and future purchase requests.
          </p>

          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all flex items-center space-x-2 ${
              isFarmer 
                ? "bg-emerald-600 hover:bg-emerald-700" 
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Profile Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
