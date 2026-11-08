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
  Sparkles,
  Upload
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useMarketplace } from "../context/MarketplaceContext";
import { SRI_LANKA_DISTRICTS } from "../data/mockData";

// Default fallback avatar
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80";

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
        avatar: user.avatar || (isAdmin ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" : DEFAULT_AVATAR),
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

  // Related stats strictly for logged in user
  const farmerCropCount = products.filter(p => p.farmerId === user.uid).length;
  const buyerOrdersCount = buyerRequests.filter(r => r.buyerId === user.uid).length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Optimize and resize image to max 400x400 via canvas
        const canvas = document.createElement("canvas");
        const MAX_DIM = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedBase64 = canvas.toDataURL("image/jpeg", 0.88);
        setFormData(prev => ({ ...prev, avatar: optimizedBase64 }));
        setSuccessMsg("Photo loaded from your device! Click 'Save Profile Changes' below to update.");
        setErrorMsg("");
      };
      img.onerror = () => {
        setErrorMsg("Failed to read image file.");
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setErrorMsg("Failed to process file.");
    };
    reader.readAsDataURL(file);
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
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-white">
        {/* Cover banner with Scenic Agricultural Photo & Soft Gradient Overlay */}
        <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-slate-900">
          <img
            src={
              isAdmin
                ? "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
                : isFarmer
                ? "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80"
                : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80"
            }
            alt="Profile Cover"
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Subtle gradient overlay to provide contrast and warmth */}
          <div className={`absolute inset-0 ${
            isAdmin
              ? "bg-gradient-to-t from-purple-950/90 via-purple-900/40 to-black/30"
              : isFarmer
              ? "bg-gradient-to-t from-emerald-950/90 via-emerald-900/40 to-black/30"
              : "bg-gradient-to-t from-amber-950/90 via-amber-900/40 to-black/30"
          }`} />

          {/* Top Banner Tag / Pill */}
          <div className="absolute top-4 left-4 sm:top-5 sm:left-6 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white/95 bg-black/40 backdrop-blur-md border border-white/20 shadow-sm">
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                  <span>National Price Authority</span>
                </>
              ) : isFarmer ? (
                <>
                  <Sprout className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Sri Lanka Certified Producer</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                  <span>Verified Wholesale Buyer</span>
                </>
              )}
            </span>
          </div>

          {/* District Tag in Top Right */}
          <div className="absolute top-4 right-4 sm:top-5 sm:right-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/90 bg-black/40 backdrop-blur-md border border-white/20 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>{formData.district || "Sri Lanka"}</span>
            </span>
          </div>
        </div>

        {/* User Info Bar */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="sm:flex sm:items-end sm:justify-between sm:space-x-5">
            {/* Avatar & Main Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 gap-4 text-center sm:text-left">
              {/* Avatar with Ring & Status Indicator */}
              <div className="relative group flex-shrink-0">
                <img
                  src={formData.avatar || DEFAULT_AVATAR}
                  alt={formData.displayName}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white shadow-2xl bg-white"
                />
                <label
                  htmlFor="avatar-file-upload"
                  className="absolute inset-0 bg-black/50 text-white rounded-3xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-semibold backdrop-blur-[2px]"
                  title="Upload Photo"
                >
                  <Camera className="w-5 h-5 mb-0.5 text-emerald-400" />
                  <span>Change</span>
                </label>
                {/* Role Icon Floating Badge */}
                <span className={`absolute -bottom-1 -right-1 p-2 rounded-2xl text-white shadow-lg ring-2 ring-white z-10 ${
                  isAdmin ? "bg-purple-600" : isFarmer ? "bg-emerald-600" : "bg-amber-600"
                }`}>
                  {isAdmin ? <ShieldCheck className="w-4 h-4" /> : isFarmer ? <Sprout className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                </span>
              </div>

              {/* Names and Details */}
              <div className="pb-1 space-y-1.5">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight capitalize">
                    {formData.displayName || user.displayName}
                  </h1>
                  <span title="Verified Account">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Active
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                  <span>{user.email}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-semibold text-slate-800">
                    {isAdmin ? "National Price Administrator" : isFarmer ? (formData.farmName || "Farm Producer") : (formData.businessName || "Wholesale Buyer")}
                  </span>
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-xs ${
                    isAdmin 
                      ? "bg-purple-100 text-purple-900 border border-purple-200" 
                      : isFarmer 
                      ? "bg-emerald-100 text-emerald-900 border border-emerald-200" 
                      : "bg-amber-100 text-amber-900 border border-amber-200"
                  }`}>
                    {user.role} {isAdmin ? "(Price Controller)" : `(${formData.district})`}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    🇱🇰 Sri Lanka
                  </span>
                  {formData.location && (
                    <span className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200 inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{formData.location}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats Cards on the Right */}
            <div className="mt-5 sm:mt-0 flex items-center justify-center sm:justify-end gap-3 flex-shrink-0">
              {isAdmin ? (
                <div className="p-3.5 bg-purple-50/80 rounded-2xl border border-purple-100 text-right min-w-[120px] shadow-xs">
                  <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Authority</p>
                  <p className="text-lg font-black text-purple-950">Price Controller</p>
                  <p className="text-[10px] text-purple-700 font-medium mt-0.5">National Level</p>
                </div>
              ) : isFarmer ? (
                <div className="flex items-center gap-2.5">
                  <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-100 text-center min-w-[110px] shadow-xs">
                    <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Active Crops</p>
                    <p className="text-xl font-black text-emerald-800">{farmerCropCount}</p>
                    <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Listed in Market</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center min-w-[100px] shadow-xs hidden sm:block">
                    <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Trade Rate</p>
                    <p className="text-xl font-black text-slate-800">100%</p>
                    <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Direct Price</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-100 text-center min-w-[110px] shadow-xs">
                    <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Orders</p>
                    <p className="text-xl font-black text-amber-900">{buyerOrdersCount}</p>
                    <p className="text-[10px] text-amber-700 font-medium mt-0.5">Requests Placed</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center min-w-[100px] shadow-xs hidden sm:block">
                    <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Tier</p>
                    <p className="text-xl font-black text-slate-800">Verified</p>
                    <p className="text-[10px] text-slate-600 font-medium mt-0.5">Wholesale</p>
                  </div>
                </div>
              )}
            </div>
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

        {/* Section 1: Profile Photo Upload */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Profile Photo</span>
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            {/* Live Preview Avatar */}
            <div className="relative group self-center sm:self-auto flex-shrink-0">
              <img
                src={formData.avatar || DEFAULT_AVATAR}
                alt="Profile Preview"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-md bg-white"
              />
              <label 
                htmlFor="avatar-file-upload" 
                className="absolute inset-0 bg-black/40 text-white rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-semibold"
                title="Upload Photo"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Upload</span>
              </label>
            </div>

            {/* Upload Button */}
            <div className="flex-1 flex items-center justify-center sm:justify-start">
              {/* Native Device File Input */}
              <input
                id="avatar-file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="avatar-file-upload"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-all flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
              </label>
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
