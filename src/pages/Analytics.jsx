import React, { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  BarChart3, 
  Calendar, 
  MapPin, 
  Info, 
  ShieldCheck, 
  Sprout, 
  DollarSign, 
  Layers, 
  ArrowUpRight,
  ArrowDownRight,
  Edit3,
  Save,
  RotateCcw,
  Check,
  X,
  Sliders,
  Sparkles
} from "lucide-react";
import { 
  ECONOMIC_CENTRES 
} from "../data/mockData";
import { useMarketplace } from "../context/MarketplaceContext";
import { useAuth } from "../context/AuthContext";

export default function Analytics({ setActivePage }) {
  const { products, buyerRequests, economicPrices, updateCropPrice, resetEconomicPrices } = useMarketplace();
  const { user, isFarmer, isBuyer, isAdmin } = useAuth();

  const [selectedCropName, setSelectedCropName] = useState(economicPrices[0]?.crop || "Carrots (කැරට්)");
  const selectedCrop = economicPrices.find(c => c.crop === selectedCropName) || economicPrices[0];
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d"); // '7d', '30d'

  // Admin Price Editor Modal State
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingCropData, setEditingCropData] = useState(null);
  const [adminSuccess, setAdminSuccess] = useState("");
  const [inlineEditingCrop, setInlineEditingCrop] = useState(null);
  const [inlineFormData, setInlineFormData] = useState({});

  // Calculations for platform metrics
  const totalStockKg = products.reduce((acc, p) => acc + (p.stockKg || 0), 0);
  const totalOrderValue = buyerRequests.reduce((acc, r) => acc + (r.totalOfferLKR || 0), 0);
  const acceptedOrders = buyerRequests.filter(r => r.status === "accepted" || r.status === "completed");
  const fulfilledVolume = acceptedOrders.reduce((acc, r) => acc + (r.quantity || 0), 0);

  const openAdminEditor = (cropItem) => {
    setEditingCropData({
      crop: cropItem.crop,
      dambullaWholesale: cropItem.dambullaWholesale,
      manningWholesale: cropItem.manningWholesale,
      keppetipolaWholesale: cropItem.keppetipolaWholesale,
      farmerDirectAvg: cropItem.farmerDirectAvg,
      retailAverage: cropItem.retailAverage,
      trend: cropItem.trend || "stable",
      trendPercent: cropItem.trendPercent || 0
    });
    setAdminModalOpen(true);
    setAdminSuccess("");
  };

  const handleAdminSave = async (e) => {
    e.preventDefault();
    if (!editingCropData) return;
    await updateCropPrice(editingCropData.crop, editingCropData);
    setAdminSuccess(`Daily wholesale benchmark for "${editingCropData.crop}" updated successfully!`);
    setTimeout(() => {
      setAdminSuccess("");
      setAdminModalOpen(false);
    }, 1500);
  };

  const startInlineEdit = (p) => {
    setInlineEditingCrop(p.crop);
    setInlineFormData({
      dambullaWholesale: p.dambullaWholesale,
      manningWholesale: p.manningWholesale,
      keppetipolaWholesale: p.keppetipolaWholesale,
      farmerDirectAvg: p.farmerDirectAvg,
      retailAverage: p.retailAverage,
      trend: p.trend,
      trendPercent: p.trendPercent
    });
  };

  const saveInlineEdit = async (cropName) => {
    await updateCropPrice(cropName, inlineFormData);
    setInlineEditingCrop(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Real-time Sri Lanka Agricultural Intelligence 🇱🇰</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Market Prices & Agricultural Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Official daily wholesale price trends across Dambulla, Manning Market, and Keppetipola Dedicated Economic Centres compared to direct farmer prices.
        </p>
      </div>

      {/* ADMIN CONTROL BAR (Visible when logged in as Admin) */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white rounded-3xl p-6 border border-purple-700/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-800/80 text-purple-200 border border-purple-600/40 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base text-white">Administrator Access Active</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/30 text-purple-200 border border-purple-400/40">
                  {user?.displayName || "Market Price Controller"}
                </span>
              </div>
              <p className="text-xs text-purple-200/90 mt-0.5">
                You have permission to update and publish official daily economic centre auction prices and wholesale trends.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => openAdminEditor(selectedCrop)}
              className="px-4 py-2.5 bg-purple-500 hover:bg-purple-400 text-purple-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5 flex-shrink-0"
            >
              <Edit3 className="w-4 h-4" />
              <span>Update Daily Market Prices</span>
            </button>
            <button
              onClick={() => {
                if (confirm("Reset market benchmarks to default Sri Lanka baseline rates?")) {
                  resetEconomicPrices();
                }
              }}
              className="p-2.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded-xl border border-purple-700/50 transition-colors"
              title="Reset to default benchmark rates"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Direct Farmer Savings</span>
            <span className="p-1 rounded bg-emerald-50 text-emerald-600"><TrendingDown className="w-3.5 h-3.5" /></span>
          </div>
          <p className="text-2xl font-black text-emerald-600">14.2%</p>
          <p className="text-[11px] text-slate-400">Buyers save vs. retail intermediaries</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Farmer Revenue Uplift</span>
            <span className="p-1 rounded bg-emerald-50 text-emerald-600"><TrendingUp className="w-3.5 h-3.5" /></span>
          </div>
          <p className="text-2xl font-black text-slate-900">+18.5%</p>
          <p className="text-[11px] text-slate-400">Earned over traditional broker cuts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Fulfilled Volume</span>
            <span className="p-1 rounded bg-blue-50 text-blue-600"><Layers className="w-3.5 h-3.5" /></span>
          </div>
          <p className="text-2xl font-black text-slate-900">{fulfilledVolume.toLocaleString()} kg</p>
          <p className="text-[11px] text-slate-400">Traded this harvest season</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Active Produce Stock</span>
            <span className="p-1 rounded bg-purple-50 text-purple-600"><Sprout className="w-3.5 h-3.5" /></span>
          </div>
          <p className="text-2xl font-black text-purple-700">{totalStockKg.toLocaleString()} kg</p>
          <p className="text-[11px] text-slate-400">Ready in Nuwara Eliya & Rajarata</p>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE ECONOMIC CENTRE PRICE INDEX */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Economic Centre Price Index & 7-Day Trend
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any agricultural commodity below to visualize price movements between Dambulla and direct farm gates.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500">Benchmark:</span>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              Dambulla DEC vs Direct
            </span>
          </div>
        </div>

        {/* Crop Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {economicPrices.map((cropItem) => (
            <button
              key={cropItem.crop}
              onClick={() => setSelectedCropName(cropItem.crop)}
              className={`px-3.5 py-2 text-xs rounded-xl font-bold transition-all ${
                selectedCrop.crop === cropItem.crop
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cropItem.crop}
            </button>
          ))}
        </div>

        {/* Selected Crop Detail & Interactive Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          {/* Left: Trend Graph */}
          <div className="lg:col-span-8 bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{selectedCrop.crop} Price Movement</h3>
                <p className="text-xs text-slate-500">Comparing Dambulla Auction vs Direct AgriConnect Farm Gate</p>
              </div>

              <div className="flex items-center space-x-4 text-xs">
                <span className="flex items-center space-x-1.5 font-semibold text-emerald-700">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span>Farmer Direct (Rs.)</span>
                </span>
                <span className="flex items-center space-x-1.5 font-semibold text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                  <span>Dambulla Wholesale (Rs.)</span>
                </span>
              </div>
            </div>

            {/* Custom SVG Data Visualization Chart */}
            <div className="h-56 w-full pt-4">
              <div className="h-full flex items-end justify-between gap-3 px-2 pb-6 border-b border-slate-300 relative">
                {(selectedCrop.history || []).map((h, idx) => {
                  const maxVal = Math.max(...(selectedCrop.history || []).map(item => Math.max(item.dambulla || 0, item.farmerDirect || 0))) * 1.15 || 500;
                  const dambullaHeight = ((h.dambulla || 0) / maxVal) * 100;
                  const farmerHeight = ((h.farmerDirect || 0) / maxVal) * 100;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="w-full flex items-end justify-center space-x-1.5 h-full">
                        {/* Farmer Direct Bar */}
                        <div
                          style={{ height: `${farmerHeight}%` }}
                          className="w-5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md group-hover:brightness-110 transition-all relative flex justify-center"
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 text-[10px] font-bold bg-emerald-950 text-white px-1.5 py-0.5 rounded shadow whitespace-nowrap z-10">
                            Rs. {h.farmerDirect}
                          </span>
                        </div>

                        {/* Dambulla Market Bar */}
                        <div
                          style={{ height: `${dambullaHeight}%` }}
                          className="w-5 bg-slate-300 rounded-t-md group-hover:bg-slate-400 transition-all relative flex justify-center"
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 text-[10px] font-bold bg-slate-800 text-white px-1.5 py-0.5 rounded shadow whitespace-nowrap z-10">
                            Rs. {h.dambulla}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-500 mt-2">
                        {h.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>* Data sourced from Ministry of Agriculture Daily Wholesale Market Bulletins</span>
              <span className="font-semibold text-emerald-800">Direct Farmer price saves buyers ~7-10%</span>
            </div>
          </div>

          {/* Right: Price Breakdown Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Today's Key Benchmarks
              </span>
              {isAdmin && (
                <button
                  onClick={() => openAdminEditor(selectedCrop)}
                  className="inline-flex items-center space-x-1 text-[11px] font-bold text-purple-700 hover:text-purple-900"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Rate</span>
                </button>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-[10px]">AgriConnect Farm Gate</p>
                  <p className="text-lg font-black text-emerald-700">Rs. {selectedCrop.farmerDirectAvg} /kg</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                  Direct
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-[10px]">Dambulla DEC</p>
                  <p className="text-base font-bold text-slate-800">Rs. {selectedCrop.dambullaWholesale} /kg</p>
                </div>
                <span className="text-[10px] text-slate-500">Central</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-[10px]">Peliyagoda Manning Market</p>
                  <p className="text-base font-bold text-slate-800">Rs. {selectedCrop.manningWholesale} /kg</p>
                </div>
                <span className="text-[10px] text-slate-500">Western</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-[10px]">Urban Retail Average</p>
                  <p className="text-base font-bold text-slate-800">Rs. {selectedCrop.retailAverage} /kg</p>
                </div>
                <span className="text-[10px] text-slate-500">End Consumer</span>
              </div>
            </div>

            <button
              onClick={() => setActivePage("marketplace")}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Browse {selectedCrop.crop.split(" ")[0]} Listings</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: SRI LANKA ECONOMIC CENTRES SUMMARY TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Dedicated Economic Centres Wholesale Price Board</h2>
            <p className="text-xs text-slate-500">Comparison across major agricultural auction hubs in Sri Lanka.</p>
          </div>
          {isAdmin && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-purple-700 font-semibold bg-purple-50 px-3 py-1 rounded-xl border border-purple-200 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin inline price editor enabled</span>
              </span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Commodity</th>
                <th className="py-3 px-4">Direct Farm Avg.</th>
                <th className="py-3 px-4">Dambulla Wholesale</th>
                <th className="py-3 px-4">Manning Market</th>
                <th className="py-3 px-4">Keppetipola</th>
                <th className="py-3 px-4">Retail Average</th>
                <th className="py-3 px-4 text-center">Trend (Weekly)</th>
                {isAdmin && <th className="py-3 px-4 text-right">Admin Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {economicPrices.map((p, idx) => {
                const isInlineEditing = inlineEditingCrop === p.crop;
                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {p.crop}
                    </td>

                    {/* Direct Farm Avg */}
                    <td className="py-3 px-4 font-bold text-emerald-700">
                      {isInlineEditing ? (
                        <input
                          type="number"
                          value={inlineFormData.farmerDirectAvg}
                          onChange={(e) => setInlineFormData({ ...inlineFormData, farmerDirectAvg: e.target.value })}
                          className="w-16 px-1.5 py-0.5 border border-purple-500 rounded text-xs"
                        />
                      ) : (
                        <span>Rs. {p.farmerDirectAvg}</span>
                      )}
                    </td>

                    {/* Dambulla */}
                    <td className="py-3 px-4 text-slate-700">
                      {isInlineEditing ? (
                        <input
                          type="number"
                          value={inlineFormData.dambullaWholesale}
                          onChange={(e) => setInlineFormData({ ...inlineFormData, dambullaWholesale: e.target.value })}
                          className="w-16 px-1.5 py-0.5 border border-purple-500 rounded text-xs"
                        />
                      ) : (
                        <span>Rs. {p.dambullaWholesale}</span>
                      )}
                    </td>

                    {/* Manning Market */}
                    <td className="py-3 px-4 text-slate-700">
                      {isInlineEditing ? (
                        <input
                          type="number"
                          value={inlineFormData.manningWholesale}
                          onChange={(e) => setInlineFormData({ ...inlineFormData, manningWholesale: e.target.value })}
                          className="w-16 px-1.5 py-0.5 border border-purple-500 rounded text-xs"
                        />
                      ) : (
                        <span>Rs. {p.manningWholesale}</span>
                      )}
                    </td>

                    {/* Keppetipola */}
                    <td className="py-3 px-4 text-slate-700">
                      {isInlineEditing ? (
                        <input
                          type="number"
                          value={inlineFormData.keppetipolaWholesale}
                          onChange={(e) => setInlineFormData({ ...inlineFormData, keppetipolaWholesale: e.target.value })}
                          className="w-16 px-1.5 py-0.5 border border-purple-500 rounded text-xs"
                        />
                      ) : (
                        <span>Rs. {p.keppetipolaWholesale}</span>
                      )}
                    </td>

                    {/* Retail Average */}
                    <td className="py-3 px-4 text-slate-700">
                      {isInlineEditing ? (
                        <input
                          type="number"
                          value={inlineFormData.retailAverage}
                          onChange={(e) => setInlineFormData({ ...inlineFormData, retailAverage: e.target.value })}
                          className="w-16 px-1.5 py-0.5 border border-purple-500 rounded text-xs"
                        />
                      ) : (
                        <span>Rs. {p.retailAverage}</span>
                      )}
                    </td>

                    {/* Trend */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        p.trend === "up" ? "bg-emerald-100 text-emerald-800" : p.trend === "down" ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700"
                      }`}>
                        {p.trend === "up" && <ArrowUpRight className="w-3 h-3 text-emerald-600" />}
                        {p.trend === "down" && <ArrowDownRight className="w-3 h-3 text-red-600" />}
                        <span>{p.trendPercent > 0 ? `+${p.trendPercent}%` : `${p.trendPercent}%`}</span>
                      </span>
                    </td>

                    {/* Admin Action */}
                    {isAdmin && (
                      <td className="py-3 px-4 text-right">
                        {isInlineEditing ? (
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => saveInlineEdit(p.crop)}
                              className="p-1 bg-purple-600 hover:bg-purple-700 text-white rounded shadow"
                              title="Save Changes"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setInlineEditingCrop(null)}
                              className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => startInlineEdit(p)}
                              className="p-1 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded"
                              title="Quick Edit Row"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openAdminEditor(p)}
                              className="px-2 py-0.5 text-[10px] bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded border border-purple-200"
                              title="Full Editor Modal"
                            >
                              Modal
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADMIN PRICE EDIT MODAL */}
      {adminModalOpen && editingCropData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-white/10 rounded-xl">
                  <Sliders className="w-5 h-5 text-purple-200" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Edit Market Benchmark Prices</h3>
                  <p className="text-xs text-purple-200">Updating official Sri Lanka Economic Centre wholesale rates</p>
                </div>
              </div>
              <button 
                onClick={() => setAdminModalOpen(false)} 
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAdminSave} className="p-6 space-y-4">
              {adminSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2 animate-fade-in">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{adminSuccess}</span>
                </div>
              )}

              {/* Commodity Selector within modal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Crop / Commodity</label>
                <select
                  value={editingCropData.crop}
                  onChange={(e) => {
                    const match = economicPrices.find(item => item.crop === e.target.value);
                    if (match) openAdminEditor(match);
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-bold text-slate-900"
                >
                  {economicPrices.map(item => (
                    <option key={item.crop} value={item.crop}>{item.crop}</option>
                  ))}
                </select>
              </div>

              {/* Grid of Prices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Direct Farm Gate (Rs./kg)</label>
                  <input
                    type="number"
                    value={editingCropData.farmerDirectAvg}
                    onChange={(e) => setEditingCropData({ ...editingCropData, farmerDirectAvg: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-bold text-emerald-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dambulla DEC Wholesale (Rs./kg)</label>
                  <input
                    type="number"
                    value={editingCropData.dambullaWholesale}
                    onChange={(e) => setEditingCropData({ ...editingCropData, dambullaWholesale: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Peliyagoda Manning Market (Rs./kg)</label>
                  <input
                    type="number"
                    value={editingCropData.manningWholesale}
                    onChange={(e) => setEditingCropData({ ...editingCropData, manningWholesale: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Keppetipola DEC Wholesale (Rs./kg)</label>
                  <input
                    type="number"
                    value={editingCropData.keppetipolaWholesale}
                    onChange={(e) => setEditingCropData({ ...editingCropData, keppetipolaWholesale: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Urban Retail Average (Rs./kg)</label>
                  <input
                    type="number"
                    value={editingCropData.retailAverage}
                    onChange={(e) => setEditingCropData({ ...editingCropData, retailAverage: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Market Trend</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={editingCropData.trend}
                      onChange={(e) => setEditingCropData({ ...editingCropData, trend: e.target.value })}
                      className="px-2 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"
                    >
                      <option value="up">📈 Price Up</option>
                      <option value="down">📉 Price Down</option>
                      <option value="stable">➡️ Stable</option>
                    </select>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Trend %"
                      value={editingCropData.trendPercent}
                      onChange={(e) => setEditingCropData({ ...editingCropData, trendPercent: e.target.value })}
                      className="px-2 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[11px] text-slate-400">
                  * Live update broadcasts immediately across AgriConnect.
                </p>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setAdminModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Broadcast Live</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
