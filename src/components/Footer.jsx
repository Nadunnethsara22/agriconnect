import React from "react";
import { 
  Sprout, 
  MapPin, 
  Phone, 
  Mail, 
  Heart, 
  ShieldCheck, 
  TrendingUp, 
  Truck 
} from "lucide-react";
import { ECONOMIC_CENTRES } from "../data/mockData";

export default function Footer({ setActivePage, setSelectedCategory, onOpenFirebaseModal }) {
  const openCategory = (cat) => {
    if (setSelectedCategory) setSelectedCategory(cat);
    setActivePage("marketplace");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Agri<span className="text-emerald-400">Connect</span> Sri Lanka
                </span>
                <p className="text-xs text-emerald-400 font-medium">ගොවි සවිය - පාරිභෝගික තෘප්තිය</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Sri Lanka's dedicated digital agricultural exchange connecting passionate local farmers directly with wholesale dealers, supermarkets, food processors, and catering services.
            </p>
            <div className="flex items-center space-x-3 text-xs text-emerald-400">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Middleman Cuts</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Truck className="w-4 h-4" />
                <span>Islandwide Transport</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Marketplace</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => openCategory("all")} className="hover:text-emerald-400 transition-colors">
                  Browse All Crops
                </button>
              </li>
              <li>
                <button onClick={() => openCategory("vegetables")} className="hover:text-emerald-400 transition-colors">
                  Highland Vegetables
                </button>
              </li>
              <li>
                <button onClick={() => openCategory("grains")} className="hover:text-emerald-400 transition-colors">
                  Rajarata Paddy & Grains
                </button>
              </li>
              <li>
                <button onClick={() => openCategory("spices")} className="hover:text-emerald-400 transition-colors">
                  Ceylon Export Spices
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage("buyer-requests"); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-emerald-400 transition-colors">
                  Buyer Wanted Board
                </button>
              </li>
            </ul>
          </div>

          {/* Economic Centres */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Economic Centres</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {ECONOMIC_CENTRES.slice(0, 4).map(ec => (
                <li key={ec.id} className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="truncate">{ec.name}</span>
                </li>
              ))}
              <li>
                <button 
                  onClick={() => { setActivePage("analytics"); window.scrollTo({top:0, behavior:'smooth'}); }}
                  className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center space-x-1 text-xs pt-1"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>View All DEC Price Trends</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Farmer Support</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Govt. Agri Advisory: 1920</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>AgriConnect Help: +94 11 234 5670</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@agriconnect.lk</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AgriConnect Sri Lanka. Real-world solutions for Sri Lankan Agriculture.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Empowering local farmers across 25 districts</span>
            <span className="text-red-500">🇱🇰</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
