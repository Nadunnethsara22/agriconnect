import React, { useState } from "react";
import { 
  Sprout, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle, 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Layers, 
  Calendar, 
  Phone 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useMarketplace } from "../context/MarketplaceContext";
import { CATEGORIES, SRI_LANKA_DISTRICTS } from "../data/mockData";

// Curated high quality presets for popular Sri Lankan crops
const SAMPLE_IMAGE_PRESETS = [
  { label: "Carrots", url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80" },
  { label: "Paddy/Rice", url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80" },
  { label: "Big Onions", url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80" },
  { label: "Leeks", url: "https://images.unsplash.com/photo-1588879462719-755711e64906?auto=format&fit=crop&w=800&q=80" },
  { label: "Tomatoes", url: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=80" },
  { label: "Chillies", url: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80" },
  { label: "Papaya", url: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=800&q=80" },
  { label: "Coconut", url: "https://images.unsplash.com/photo-1544434981-e23a483a936a?auto=format&fit=crop&w=800&q=80" },
  { label: "Ceylon Pepper", url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80" },
  { label: "Bananas", url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80" }
];

export default function AddProduct({ setActivePage }) {
  const { user } = useAuth();
  const { addProduct } = useMarketplace();

  const [formData, setFormData] = useState({
    name: "",
    sinhalaName: "",
    category: "vegetables",
    variety: "",
    pricePerKg: "",
    wholesalePrice: "",
    stockKg: "",
    minOrderKg: "25",
    unit: "kg",
    district: user?.district || "Nuwara Eliya",
    location: user?.location || "Kandapola Farm, Nuwara Eliya",
    harvestDate: new Date().toISOString().split('T')[0],
    isOrganic: false,
    description: "",
    image: SAMPLE_IMAGE_PRESETS[0].url,
    farmerPhone: user?.phone || "+94 77 345 6789"
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImagePresetSelect = (url) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addProduct(formData);
      setSubmitted(true);
      setTimeout(() => {
        setActivePage("farmer-dashboard");
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage("farmer-dashboard")}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          List Agricultural Harvest (අස්වැන්න එක් කරන්න)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Publish your crop to buyers and supermarkets islandwide. Set your farm gate wholesale price with zero commission.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-lg mx-auto shadow-lg space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Harvest Listed Successfully!</h2>
          <p className="text-xs text-slate-500">
            Your produce is now visible to buyers across Sri Lanka. Redirecting to your dashboard...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: FORM (7 Cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Crop Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Product / Crop Name (English)
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Nuwara Eliya Carrots"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sinhala Name (සිංහල නම)
                  </label>
                  <input
                    type="text"
                    name="sinhalaName"
                    value={formData.sinhalaName}
                    onChange={handleChange}
                    placeholder="e.g. නුවරඑළිය කැරට්"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.sinhala})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Variety / Grade</label>
                  <input
                    type="text"
                    name="variety"
                    value={formData.variety}
                    onChange={handleChange}
                    placeholder="e.g. Nantes Grade A / Export Quality"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Stock Details */}
            <div className="space-y-4 pt-2">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Pricing & Inventory</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price per kg / unit (Rs.)
                  </label>
                  <input
                    type="number"
                    name="pricePerKg"
                    value={formData.pricePerKg}
                    onChange={handleChange}
                    placeholder="e.g. 380"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Wholesale Bulk Price (Rs.)
                  </label>
                  <input
                    type="number"
                    name="wholesalePrice"
                    value={formData.wholesalePrice}
                    onChange={handleChange}
                    placeholder="e.g. 350"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-emerald-700 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit Type
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
                  >
                    <option value="kg">kg (Kilograms)</option>
                    <option value="nuts">nuts (Coconuts)</option>
                    <option value="bunches">bunches (Bananas)</option>
                    <option value="sacks">sacks (50kg bags)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Available Stock ({formData.unit})
                  </label>
                  <input
                    type="number"
                    name="stockKg"
                    value={formData.stockKg}
                    onChange={handleChange}
                    placeholder="e.g. 1500"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Minimum Order Quantity ({formData.unit})
                  </label>
                  <input
                    type="number"
                    name="minOrderKg"
                    value={formData.minOrderKg}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Location & Harvest Details */}
            <div className="space-y-4 pt-2">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Origin & Harvest Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
                  >
                    {SRI_LANKA_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Harvest Date</label>
                  <input
                    type="date"
                    name="harvestDate"
                    value={formData.harvestDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Farm / Village Address</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Kandapola Village, Nuwara Eliya"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Farmer Contact Phone / WhatsApp</label>
                <input
                  type="text"
                  name="farmerPhone"
                  value={formData.farmerPhone}
                  onChange={handleChange}
                  placeholder="+94 77 123 4567"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-800 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  name="isOrganic"
                  checked={formData.isOrganic}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>GAP-Certified Organic or Pesticide-Free Cultivation</span>
                </span>
              </label>
            </div>

            {/* Product Image & Description */}
            <div className="space-y-4 pt-2">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Product Image & Description</span>
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select a Quick Preset Crop Photo or Enter Image URL
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {SAMPLE_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleImagePresetSelect(preset.url)}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                        formData.image === preset.url
                          ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Quality Notes
                </label>
                <textarea
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe freshness, soil type, washing status, packing crates, transport options..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>{loading ? "Publishing Crop..." : "Publish Product to Marketplace"}</span>
            </button>
          </form>

          {/* RIGHT: LIVE PREVIEW CARD (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Live Marketplace Preview
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                What Buyers See
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
              <div className="relative h-56 bg-slate-100">
                <img
                  src={formData.image || SAMPLE_IMAGE_PRESETS[0].url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-950/80 text-emerald-200 backdrop-blur-sm flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{formData.district}</span>
                  </span>
                  {formData.isOrganic && (
                    <span className="px-2 py-1 text-[10px] font-bold rounded-lg bg-emerald-500 text-white shadow-sm flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Organic</span>
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className="px-3 py-1.5 text-xs font-black rounded-lg bg-white/95 text-slate-900 shadow-md">
                    Rs. {formData.pricePerKg || "0"} <span className="text-[10px] text-slate-500 font-normal">/{formData.unit}</span>
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {formData.name || "Product Name"}
                  </h3>
                  <p className="text-xs text-emerald-700 font-medium">
                    {formData.sinhalaName || "සිංහල නම"} • {formData.variety || "Highland Quality"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-3">
                    {formData.description || "Your product quality, freshness and packing notes will appear here..."}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Available Stock:</span>
                    <span className="font-bold text-emerald-800">{formData.stockKg || 0} {formData.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Min Order:</span>
                    <span className="font-medium text-slate-700">{formData.minOrderKg || 0} {formData.unit}</span>
                  </div>
                  {formData.wholesalePrice && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Wholesale Bulk:</span>
                      <span>Rs. {formData.wholesalePrice} /{formData.unit}</span>
                    </div>
                  )}
                </div>

                <div className="pt-1 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium">Farmer: {user?.displayName || "Sunil Bandara"}</span>
                  <span className="text-emerald-700 font-semibold">{formData.farmerPhone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
