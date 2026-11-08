import React, { useState, useMemo } from "react";
import { 
  Search, 
  MapPin, 
  Filter, 
  Sparkles, 
  ArrowUpDown, 
  MessageSquare, 
  Phone, 
  Eye, 
  Send, 
  CheckCircle, 
  X, 
  DollarSign, 
  Calendar,
  Layers,
  Sprout
} from "lucide-react";
import { useMarketplace } from "../context/MarketplaceContext";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES, SRI_LANKA_DISTRICTS } from "../data/mockData";

export default function Marketplace({ 
  setActivePage, 
  setSelectedProduct,
  selectedCategory: propCategory,
  setSelectedCategory: propSetCategory,
  searchTerm: propSearchTerm,
  setSearchTerm: propSetSearchTerm,
  selectedDistrict: propDistrict,
  setSelectedDistrict: propSetDistrict
}) {
  const { products, sendPurchaseRequest } = useMarketplace();
  const { user } = useAuth();

  // Search & Filter state (support external props from home page search or local state)
  const [localSearch, setLocalSearch] = useState("");
  const [localCategory, setLocalCategory] = useState("all");
  const [localDistrict, setLocalDistrict] = useState("all");

  const searchTerm = propSearchTerm !== undefined ? propSearchTerm : localSearch;
  const setSearchTerm = propSetSearchTerm || setLocalSearch;

  const selectedCategory = propCategory !== undefined ? propCategory : localCategory;
  const setSelectedCategory = propSetCategory || setLocalCategory;

  const selectedDistrict = propDistrict !== undefined ? propDistrict : localDistrict;
  const setSelectedDistrict = propSetDistrict || setLocalDistrict;

  const [organicOnly, setOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest"); // newest, price_low, price_high, stock_high
  const [maxPrice, setMaxPrice] = useState(5000);

  // Quick Purchase Request Modal state
  const [requestModalProduct, setRequestModalProduct] = useState(null);
  const [requestQuantity, setRequestQuantity] = useState("");
  const [offeredPrice, setOfferedPrice] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [requestNote, setRequestNote] = useState("");
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Search term
      const matchesSearch = 
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prod.sinhalaName && prod.sinhalaName.includes(searchTerm)) ||
        prod.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.district.toLowerCase().includes(searchTerm.toLowerCase());

      // Category
      const matchesCategory = selectedCategory === "all" || prod.category === selectedCategory;

      // District
      const matchesDistrict = selectedDistrict === "all" || prod.district === selectedDistrict;

      // Organic
      const matchesOrganic = !organicOnly || prod.isOrganic;

      // Price
      const matchesPrice = prod.pricePerKg <= maxPrice;

      return matchesSearch && matchesCategory && matchesDistrict && matchesOrganic && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === "price_low") return a.pricePerKg - b.pricePerKg;
      if (sortBy === "price_high") return b.pricePerKg - a.pricePerKg;
      if (sortBy === "stock_high") return b.stockKg - a.stockKg;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [products, searchTerm, selectedCategory, selectedDistrict, organicOnly, sortBy, maxPrice]);

  const openRequestModal = (product) => {
    if (!user) {
      if (confirm("You need a Buyer or Farmer account to send purchase offers to farmers. Proceed to Sign In / Register?")) {
        setActivePage("auth");
      }
      return;
    }
    setRequestModalProduct(product);
    setRequestQuantity(product.minOrderKg || 50);
    setOfferedPrice(product.pricePerKg);
    setDeliveryDate(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
    setDeliveryAddress(user?.district ? `${user.district} Distribution Center` : "Colombo Central Wholesale Market");
    setRequestNote("");
    setRequestSuccess(false);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!requestModalProduct) return;

    await sendPurchaseRequest({
      productId: requestModalProduct.id,
      productName: requestModalProduct.name,
      farmerId: requestModalProduct.farmerId,
      farmerName: requestModalProduct.farmerName,
      farmerPhone: requestModalProduct.farmerPhone || "+94 77 345 6789",
      quantity: Number(requestQuantity),
      unit: requestModalProduct.unit || "kg",
      offeredPricePerKg: Number(offeredPrice),
      deliveryDate,
      deliveryAddress,
      note: requestNote
    });

    setRequestSuccess(true);
    setTimeout(() => {
      setRequestModalProduct(null);
      setRequestSuccess(false);
      if (setActivePage) {
        setActivePage("buyer-requests");
      }
    }, 1200);
  };

  const viewDetails = (prod) => {
    setSelectedProduct(prod);
    setActivePage("product-details");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Sprout className="w-3.5 h-3.5" />
          <span>Farm-Gate Exchange • 25 Sri Lankan Districts</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Agricultural Product Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Browse fresh highland vegetables, Rajarata paddy, Jaffna onions, and Ceylon spices directly from verified growers. Compare prices and send purchase offers with zero middleman margin.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        {/* Top Search & Filter row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by vegetable, fruit, grain, Sinhala name, or farmer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
              >
                <option value="all">All Districts (Islandwide)</option>
                {SRI_LANKA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="relative">
              <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
              >
                <option value="newest">Sort: Newest Harvest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="stock_high">Stock: Largest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills & Organic Check */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.name.split(" ")[0]} ({cat.sinhala})
              </button>
            ))}
          </div>

          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => setOrganicOnly(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <span className="flex items-center space-x-1 text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Organic Only</span>
            </span>
          </label>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong className="text-slate-800">{filteredProducts.length}</strong> available agricultural products</span>
        {selectedCategory !== "all" && (
          <button 
            onClick={() => { setSelectedCategory("all"); setSelectedDistrict("all"); setSearchTerm(""); }}
            className="text-emerald-700 hover:underline font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No produce matching your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, district filter, or category pills.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Product Image & Badges */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-950/80 text-emerald-200 backdrop-blur-sm flex items-center space-x-1">
                    <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                    <span>{prod.district}</span>
                  </span>
                  {prod.isOrganic && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500 text-white">
                      Organic
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 right-2.5">
                  <span className="px-2.5 py-1 text-xs font-black rounded-lg bg-white/95 text-slate-900 shadow-md">
                    Rs. {prod.pricePerKg} <span className="text-[10px] text-slate-500 font-normal">/{prod.unit}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 
                    onClick={() => viewDetails(prod)}
                    className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 cursor-pointer transition-colors line-clamp-1"
                    title={prod.name}
                  >
                    {prod.name}
                  </h3>
                  <p className="text-[11px] text-emerald-700 font-medium truncate">{prod.sinhalaName}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                {/* Stock & Farmer */}
                <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Available Stock:</span>
                    <span className="font-bold text-emerald-800">{prod.stockKg} {prod.unit}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Farmer:</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[120px]">{prod.farmerName}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-1.5 pt-1">
                  <button
                    onClick={() => openRequestModal(prod)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Purchase Request</span>
                  </button>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => viewDetails(prod)}
                      className="w-full py-1.5 text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3 h-3 text-slate-500" />
                      <span>Details</span>
                    </button>

                    <a
                      href={`https://wa.me/${(prod.farmerPhone || "+94773456789").replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${prod.farmerName}, I saw your ${prod.name} on AgriConnect Sri Lanka (Rs. ${prod.pricePerKg}/${prod.unit}). I want to discuss a bulk purchase.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-1.5 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center space-x-1"
                    >
                      <MessageSquare className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PURCHASE REQUEST MODAL */}
      {requestModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-emerald-700 to-green-800 p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Send className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Send Purchase Offer</h3>
                  <p className="text-xs text-emerald-200">{requestModalProduct.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setRequestModalProduct(null)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {requestSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-base">Purchase Request Dispatched!</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Sent to {requestModalProduct.farmerName}. The farmer will review your offer and notify you.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendRequest} className="space-y-4">
                  {/* Summary row */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-slate-500 text-[10px]">Farmer & Location</p>
                      <p className="font-bold text-slate-800">{requestModalProduct.farmerName}</p>
                      <p className="text-[10px] text-emerald-700">{requestModalProduct.district} District</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 text-[10px]">Listed Farm Gate Price</p>
                      <p className="font-black text-slate-900 text-sm">Rs. {requestModalProduct.pricePerKg} /{requestModalProduct.unit}</p>
                      <p className="text-[10px] text-slate-400">Available: {requestModalProduct.stockKg} {requestModalProduct.unit}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Quantity ({requestModalProduct.unit})
                      </label>
                      <input
                        type="number"
                        min={requestModalProduct.minOrderKg || 1}
                        max={requestModalProduct.stockKg}
                        value={requestQuantity}
                        onChange={(e) => setRequestQuantity(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-800"
                        required
                      />
                      <p className="text-[10px] text-slate-400 mt-0.5">Min: {requestModalProduct.minOrderKg || 10} {requestModalProduct.unit}</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Offered Price (Rs./{requestModalProduct.unit})
                      </label>
                      <input
                        type="number"
                        value={offeredPrice}
                        onChange={(e) => setOfferedPrice(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-emerald-700"
                        required
                      />
                      <p className="text-[10px] text-slate-400 mt-0.5">You can negotiate a bulk rate</p>
                    </div>
                  </div>

                  {/* Calculated Estimated Total */}
                  <div className="p-3 bg-emerald-50 rounded-xl flex items-center justify-between text-xs border border-emerald-100">
                    <span className="font-semibold text-emerald-900">Total Estimated Value:</span>
                    <span className="font-black text-base text-emerald-700">
                      Rs. {(Number(requestQuantity) * Number(offeredPrice) || 0).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Expected Delivery / Pickup Date
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Delivery Address / Collection Depot
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="e.g. Meegoda Wholesale Center or Supermarket Warehouse"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Custom Note to Farmer (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={requestNote}
                      onChange={(e) => setRequestNote(e.target.value)}
                      placeholder="e.g. Need packed in 25kg plastic crates. We can provide own transport."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRequestModalProduct(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center space-x-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Purchase Offer</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
