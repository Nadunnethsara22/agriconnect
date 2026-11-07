import React, { useState } from "react";
import { 
  Sprout, 
  ShoppingBag, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  PhoneCall, 
  MessageSquare, 
  Scale, 
  Search, 
  Sparkles,
  Award,
  ChevronRight,
  Star,
  Users,
  Coins
} from "lucide-react";
import { useMarketplace } from "../context/MarketplaceContext";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES, ECONOMIC_CENTRE_PRICES, SRI_LANKA_DISTRICTS } from "../data/mockData";

export default function LandingPage({ 
  setActivePage, 
  setSelectedProduct, 
  setSelectedCategory,
  searchTerm = "",
  setSearchTerm,
  selectedDistrict = "all",
  setSelectedDistrict,
  setAuthMode,
  setInitialRole
}) {
  const { products } = useMarketplace();
  const { user } = useAuth();

  const featuredProducts = products.slice(0, 6);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActivePage("marketplace");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setActivePage("product-details");
  };

  // Visual category images
  const CATEGORY_VISUALS = [
    {
      id: "vegetables",
      name: "Upcountry & Lowcountry Vegetables",
      sinhala: "නැවුම් එළවළු",
      count: "18+ Varieties",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      district: "Nuwara Eliya, Matale, Badulla"
    },
    {
      id: "fruits",
      name: "Tropical Fruits",
      sinhala: "පළතුරු අස්වැන්න",
      count: "12+ Varieties",
      image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80",
      district: "Embilipitiya, Gampaha, Kurunegala"
    },
    {
      id: "grains",
      name: "Paddy & Grains",
      sinhala: "ධාන්‍ය සහ වී",
      count: "8+ Varieties",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
      district: "Anuradhapura, Polonnaruwa, Ampara"
    },
    {
      id: "spices",
      name: "Ceylon Spices & Herbs",
      sinhala: "ලංකා කුළුබඩු",
      count: "Export Grade",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
      district: "Kandy, Matale, Galle"
    },
    {
      id: "coconut",
      name: "Coconut & Plantation",
      sinhala: "පොල් සහ වැවිලි",
      count: "Coconut Triangle",
      image: "https://images.unsplash.com/photo-1544434981-e23a483a936a?auto=format&fit=crop&w=600&q=80",
      district: "Kurunegala, Puttalam, Gampaha"
    }
  ];

  return (
    <div className="space-y-20 pb-20 animate-fade-in">
      {/* ===================== HERO SECTION WITH STUNNING IMAGE ===================== */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden">
        {/* Real Farm Photography Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=2000&q=85"
            alt="Sri Lanka Agricultural Fields and Farmers"
            className="w-full h-full object-cover object-center filter brightness-[0.9] transform scale-105 animate-pulse duration-10000"
          />
          {/* Multi-layered gradient overlay for high readability and premium aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/80 to-slate-950/60 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40"></div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
          <div className="max-w-3xl space-y-6 text-white">
            {/* Sri Lanka Flag Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold backdrop-blur-md shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>ශ්‍රී ලංකා ගොවි-පාරිභෝගික සෘජු වෙළඳපොළ 🇱🇰</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              නැවුම් අස්වැන්න <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-amber-300">
                කෙළින්ම ගොවිබිමෙන්.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl font-normal leading-relaxed">
              Connect directly with hardworking farmers across Nuwara Eliya, Dambulla, Anuradhapura, and Jaffna. Bypass intermediary broker markups, check official wholesale price benchmarks, and trade fresh harvests with 100% transparency.
            </p>

            {/* Glassmorphism Interactive Search Bar */}
            <div className="bg-white/95 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl shadow-2xl text-slate-900 max-w-2xl border border-white/50">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center px-3 bg-slate-50 rounded-xl border border-slate-200/90">
                  <Search className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search carrots, big onions, keeri samba paddy..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2.5 bg-transparent text-xs sm:text-sm focus:outline-none"
                  />
                </div>
                <div className="sm:w-44 flex items-center px-3 bg-slate-50 rounded-xl border border-slate-200/90">
                  <MapPin className="w-4 h-4 text-emerald-600 mr-1.5 flex-shrink-0" />
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full py-2.5 bg-transparent text-xs text-slate-700 focus:outline-none"
                  >
                    <option value="">All 25 Districts</option>
                    {SRI_LANKA_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-1.5 flex-shrink-0 group"
                >
                  <span>Browse Stock</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>

            {/* Quick Role CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (user?.role === "farmer") {
                    setActivePage("add-product");
                  } else {
                    if (setAuthMode) setAuthMode("register");
                    if (setInitialRole) setInitialRole("farmer");
                    setActivePage("auth");
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center space-x-2"
              >
                <Sprout className="w-4 h-4" />
                <span>I am a Farmer – Sell Harvest</span>
              </button>
              <button
                onClick={() => {
                  setActivePage("marketplace");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/25 backdrop-blur-md transition-all flex items-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>I am a Buyer – Wholesale Stock</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== VISUAL CATEGORY SHOWCASE ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase bg-emerald-100 px-3.5 py-1 rounded-full">
            Agricultural Commodities
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Explore Harvests by Farming Category
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
            Direct sourcing from mist-shrouded tea hills in Nuwara Eliya to golden paddy plains in Rajarata.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {CATEGORY_VISUALS.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                if (setSelectedCategory) setSelectedCategory(cat.id);
                setActivePage("marketplace");
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-72 flex flex-col justify-end p-5 border border-slate-200"
            >
              {/* Category Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Gradient Mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/50 to-transparent"></div>

              {/* Card Details */}
              <div className="relative z-10 space-y-1.5 text-white">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/80 text-white backdrop-blur-sm">
                  {cat.count}
                </span>
                <h3 className="font-extrabold text-base leading-snug group-hover:text-emerald-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-amber-300 font-semibold">{cat.sinhala}</p>
                <p className="text-[10px] text-slate-300 flex items-center space-x-1 pt-1">
                  <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">{cat.district}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== FEATURED FRESH PRODUCE ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase bg-emerald-100 px-3.5 py-1 rounded-full">
              Ready for Dispatch
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Featured Agricultural Products
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Freshly harvested produce available for wholesale procurement, supermarket distribution, or farm-gate pickup.
            </p>
          </div>
          <button
            onClick={() => setActivePage("marketplace")}
            className="mt-4 sm:mt-0 inline-flex items-center space-x-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>View All Products ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Product Image & Badges */}
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-emerald-950/80 text-emerald-200 backdrop-blur-md flex items-center space-x-1 shadow">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{prod.district}</span>
                  </span>
                  {prod.isOrganic && (
                    <span className="px-2.5 py-1 text-[10px] font-bold rounded-xl bg-emerald-600 text-white shadow flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Organic</span>
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className="px-3 py-1.5 text-xs font-black rounded-xl bg-white/95 text-slate-900 shadow-md">
                    Rs. {prod.pricePerKg} <span className="text-[10px] text-slate-500 font-normal">/{prod.unit}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 
                    onClick={() => openProduct(prod)}
                    className="font-bold text-base text-slate-900 group-hover:text-emerald-700 cursor-pointer transition-colors"
                  >
                    {prod.name}
                  </h3>
                  <p className="text-xs text-emerald-700 font-semibold">{prod.sinhalaName}</p>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                {/* Farmer Info & Stock */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">{prod.farmerName}</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{prod.farmName}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800">
                      {prod.stockKg} {prod.unit} Available
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Min: {prod.minOrderKg} {prod.unit}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => openProduct(prod)}
                    className="w-full py-2 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors text-center"
                  >
                    View Details
                  </button>

                  <a
                    href={`https://wa.me/${(prod.farmerPhone || "+94773456789").replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${prod.farmerName}, I saw your ${prod.name} on AgriConnect Sri Lanka at Rs. ${prod.pricePerKg}/${prod.unit}. I want to inquire about purchasing.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== PHOTO STORY SECTION: SRI LANKAN AGRICULTURE ===================== */}
      <section className="bg-gradient-to-b from-slate-900 to-emerald-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-900/60 border border-emerald-500/30 px-3.5 py-1 rounded-full">
              From Farm Gate to Urban Markets
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              Empowering Sri Lanka's Agricultural Heart
            </h2>
            <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
              Every day, thousands of metric tons of vegetables, fruits, and paddy leave rural fields. AgriConnect ensures farmers receive fair compensation while keeping prices reasonable for households.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative rounded-3xl overflow-hidden h-80 group border border-white/10 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80"
                alt="Direct Harvesting"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 space-y-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">Step 1</span>
                <h3 className="font-extrabold text-lg text-white">Harvest & Direct Upload</h3>
                <p className="text-xs text-slate-300">Farmers photograph their crop, specify location, and list wholesale quantity.</p>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden h-80 group border border-white/10 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=800&q=80"
                alt="Price Transparency"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 space-y-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">Step 2</span>
                <h3 className="font-extrabold text-lg text-white">Transparent Price Index</h3>
                <p className="text-xs text-slate-300">Daily price tracking against Dambulla and Manning Market economic centres.</p>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden h-80 group border border-white/10 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
                alt="Direct Logistics"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 space-y-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white">Step 3</span>
                <h3 className="font-extrabold text-lg text-white">Direct Trade & Logistics</h3>
                <p className="text-xs text-slate-300">Buyers send purchase requests and coordinate transportation directly via WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS WITH REAL PORTRAITS ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase bg-emerald-100 px-3.5 py-1 rounded-full">
            Real Impact Stories
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Trusted by Farmers & Businesses Across Sri Lanka
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-1 text-amber-400">
              {"★".repeat(5)}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "කලින් දඹුල්ල මාකට් එකට ලොකු ළූණු ගෙනිච්චම අතරමැදියෝ මිල බස්සනවා. AgriConnect හරහා කොළඹ සුපර්මාකට් ජාලයකට මගේ අස්වැන්නෙන් 70%ක්ම සාධාරණ මිලකට දෙන්න පුළුවන් වුණා."
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80"
                alt="Sunil Bandara"
                className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500"
              />
              <div>
                <p className="font-bold text-xs text-slate-900">Sunil Bandara</p>
                <p className="text-[11px] text-emerald-700">Highland Farmer, Nuwara Eliya</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-1 text-amber-400">
              {"★".repeat(5)}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "As a wholesale procurement manager for 14 supermarkets, getting uniform quality carrots and leeks with clear harvest timestamps has cut our food waste by over 18%."
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="Priyantha Silva"
                className="w-11 h-11 rounded-full object-cover border-2 border-amber-500"
              />
              <div>
                <p className="font-bold text-xs text-slate-900">Priyantha Silva</p>
                <p className="text-[11px] text-amber-700">Procurement Head, Colombo Fresh</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-1 text-amber-400">
              {"★".repeat(5)}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "Exporting Ceylon spices requires authentic traceability. AgriConnect lets us connect directly with organic pepper and cinnamon growers in Kandy and Galle."
            </p>
            <div className="flex items-center space-x-3 pt-3 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                alt="Niroshan Perera"
                className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500"
              />
              <div>
                <p className="font-bold text-xs text-slate-900">Niroshan Perera</p>
                <p className="text-[11px] text-slate-500">Agro Exports Lanka, Gampaha</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== BOTTOM CTA BANNER ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl p-8 sm:p-12 text-white">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80"
            alt="Sri Lankan farm banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/90 to-slate-950/80"></div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black leading-tight">
              Ready to Join Sri Lanka's Direct Farm Network?
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Whether you are harvesting highland carrots in Nuwara Eliya or sourcing bulk produce for a supermarket in Colombo, AgriConnect connects you directly.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (setAuthMode) setAuthMode("register");
                  if (setInitialRole) setInitialRole("farmer");
                  setActivePage("auth");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all"
              >
                Register as Farmer (ගොවි ගිණුම)
              </button>
              <button
                onClick={() => {
                  if (setAuthMode) setAuthMode("register");
                  if (setInitialRole) setInitialRole("buyer");
                  setActivePage("auth");
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/30 backdrop-blur-sm transition-all"
              >
                Register as Buyer (ගැනුම්කරු)
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
