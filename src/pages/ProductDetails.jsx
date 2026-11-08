import React, { useState } from "react";
import { 
  ArrowLeft, 
  MapPin, 
  Sparkles, 
  Calendar, 
  Layers, 
  CheckCircle, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Send, 
  Scale, 
  TrendingDown, 
  Info,
  Clock,
  User,
  Star
} from "lucide-react";
import { useMarketplace } from "../context/MarketplaceContext";
import { useAuth } from "../context/AuthContext";
import { ECONOMIC_CENTRE_PRICES } from "../data/mockData";

export default function ProductDetails({ product, setActivePage, setSelectedProduct }) {
  const { products, economicPrices, sendPurchaseRequest } = useMarketplace();
  const { user, isFarmer } = useAuth();

  const [orderQuantity, setOrderQuantity] = useState(product?.minOrderKg || 100);
  const [offeredPrice, setOfferedPrice] = useState(product?.pricePerKg || 350);
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.district ? `${user.district} Supermarket Warehouse` : "Pettah Wholesale Market, Colombo"
  );
  const [orderNote, setOrderNote] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-500">No product selected.</p>
        <button
          onClick={() => setActivePage("marketplace")}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  // Calculate order total
  const totalCost = Number(orderQuantity) * Number(offeredPrice) || 0;

  // Find Economic Centre comparison if available
  const priceList = economicPrices || ECONOMIC_CENTRE_PRICES;
  const decBenchmark = priceList.find(ec => 
    product.name.toLowerCase().includes(ec.crop.split(" ")[0].toLowerCase())
  );

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (isFarmer) {
      alert("Farmers cannot submit purchase requests. Only registered Buyers can place orders.");
      return;
    }
    if (!user) {
      if (confirm("Please sign in or register to submit purchase requests to farmers. Proceed to Sign In / Register?")) {
        setActivePage("auth");
      }
      return;
    }
    await sendPurchaseRequest({
      productId: product.id,
      productName: product.name,
      farmerId: product.farmerId,
      farmerName: product.farmerName,
      farmerPhone: product.farmerPhone || "+94 77 345 6789",
      quantity: Number(orderQuantity),
      unit: product.unit || "kg",
      offeredPricePerKg: Number(offeredPrice),
      deliveryDate,
      deliveryAddress,
      note: orderNote
    });

    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setActivePage("buyer-requests");
    }, 1500);
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.district === product.district))
    .slice(0, 3);

  const whatsappMessage = encodeURIComponent(
    `Hello ${product.farmerName}, I am contacting you through AgriConnect Sri Lanka regarding your ${product.name} (Rs. ${product.pricePerKg}/${product.unit}) in ${product.district}. I am interested in placing an order for ${orderQuantity}${product.unit}.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Breadcrumb */}
      <div>
        <button
          onClick={() => setActivePage("marketplace")}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: IMAGES & FARMER PROFILE (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Product Image */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md h-80 sm:h-96">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-950/80 text-emerald-200 backdrop-blur-md flex items-center space-x-1.5 shadow">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{product.district} District</span>
              </span>
              {product.isOrganic && (
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>GAP-Certified Organic</span>
                </span>
              )}
            </div>

            <div className="absolute bottom-4 right-4">
              <span className="px-3.5 py-2 rounded-xl text-sm font-black bg-white/95 text-slate-900 shadow-lg">
                Rs. {product.pricePerKg} <span className="text-xs text-slate-500 font-normal">/{product.unit}</span>
              </span>
            </div>
          </div>

          {/* Product Overview Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                <span>{product.category}</span>
                <span>•</span>
                <span>{product.variety || "Highland Quality"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {product.name}
              </h1>
              <p className="text-sm font-semibold text-emerald-700">{product.sinhalaName}</p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <p className="text-slate-400 text-[10px]">Stock on Hand</p>
                <p className="font-extrabold text-slate-800 text-sm mt-0.5">{product.stockKg} {product.unit}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl">
                <p className="text-slate-400 text-[10px]">Min. Order</p>
                <p className="font-extrabold text-slate-800 text-sm mt-0.5">{product.minOrderKg} {product.unit}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl">
                <p className="text-slate-400 text-[10px]">Harvest Date</p>
                <p className="font-extrabold text-slate-800 text-sm mt-0.5">{product.harvestDate || "Fresh"}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl">
                <p className="text-slate-400 text-[10px]">Farm Origin</p>
                <p className="font-extrabold text-slate-800 text-sm mt-0.5 truncate">{product.location}</p>
              </div>
            </div>
          </div>

          {/* Economic Centre Benchmark Price Comparison Box */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-6 border border-emerald-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-sm text-emerald-950">Sri Lanka Market Price Benchmark</h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-200/60 px-2.5 py-0.5 rounded-full">
                Zero Middleman
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 bg-white/80 rounded-xl border border-emerald-100">
                <p className="text-slate-500 text-[10px]">Farmer Direct Price</p>
                <p className="text-base font-black text-emerald-700">Rs. {product.pricePerKg} <span className="text-[10px] text-slate-400">/{product.unit}</span></p>
                <p className="text-[10px] text-emerald-600 font-medium">Guaranteed farm-fresh</p>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-emerald-100">
                <p className="text-slate-500 text-[10px]">Dambulla DEC Wholesale</p>
                <p className="text-base font-bold text-slate-700">
                  Rs. {decBenchmark ? decBenchmark.dambullaWholesale : Math.round(product.pricePerKg * 1.08)} <span className="text-[10px] text-slate-400">/{product.unit}</span>
                </p>
                <p className="text-[10px] text-slate-400">Economic Centre rate</p>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-emerald-100">
                <p className="text-slate-500 text-[10px]">Urban Retail Average</p>
                <p className="text-base font-bold text-slate-700">
                  Rs. {decBenchmark ? decBenchmark.retailAverage : Math.round(product.pricePerKg * 1.35)} <span className="text-[10px] text-slate-400">/{product.unit}</span>
                </p>
                <p className="text-[10px] text-slate-400">Colombo & suburbs</p>
              </div>
            </div>

            <p className="text-[11px] text-emerald-800 flex items-center space-x-1 pt-1">
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Buying directly guarantees the farmer receives fair value while reducing your logistics markup.</span>
            </p>
          </div>

          {/* Farmer Contact Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Producer & Farm Verification</h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xl flex-shrink-0">
                  {product.farmerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-extrabold text-base text-slate-900">{product.farmerName}</p>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-slate-500">{product.farmName}</p>
                  <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.farmerRating || 4.9}</span>
                    <span className="text-slate-400 font-normal">({product.farmerReviews || 24} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Direct Contact Actions */}
              <div className="flex items-center space-x-2">
                <a
                  href={`tel:${product.farmerPhone || "+94773456789"}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Call Farmer</span>
                </a>

                <a
                  href={`https://wa.me/${(product.farmerPhone || "+94773456789").replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PURCHASE REQUEST FORM (5 Cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {isFarmer ? "Farmer View Mode" : "Direct Purchase Offer"}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                {isFarmer ? "Producer Harvest Listing" : "Send Purchase Request to Farmer"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isFarmer
                  ? `Harvest produced by ${product.farmerName}. Contact directly via WhatsApp for peer discussions.`
                  : `Negotiate quantity, wholesale rate, and delivery date with ${product.farmerName}.`}
              </p>
            </div>

            {isFarmer ? (
              <div className="bg-emerald-50/60 rounded-2xl p-6 border border-emerald-100 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Farmer Account Active</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Purchase requests are for wholesale and retail <strong>Buyers</strong>. As a registered Farmer, you can view market demand or list crops on your Farmer Dashboard.
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href={whatsappMessage}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center space-x-2 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat with Farmer on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : requestSent ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Purchase Request Sent!</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your offer of Rs. {totalCost.toLocaleString()} has been transmitted to {product.farmerName}. Redirecting to your requests tracker...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <label>Order Quantity ({product.unit})</label>
                    <span className="text-slate-400">Min: {product.minOrderKg} {product.unit}</span>
                  </div>
                  <input
                    type="number"
                    min={product.minOrderKg || 1}
                    max={product.stockKg}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-900"
                    required
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Available Stock: {product.stockKg} {product.unit}</span>
                    <span>Max Order: {product.stockKg} {product.unit}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <label>Proposed Price (Rs./{product.unit})</label>
                    <span className="text-emerald-700 font-bold">Listing: Rs. {product.pricePerKg}</span>
                  </div>
                  <input
                    type="number"
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-emerald-700"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Bulk discount: {product.wholesalePrice ? `Wholesale rate Rs. ${product.wholesalePrice} for > 150kg` : "Standard rate applies"}
                  </p>
                </div>

                {/* Live Cost Calculation Card */}
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/70 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Quantity: {orderQuantity} {product.unit} × Rs. {offeredPrice}</span>
                    <span className="font-semibold text-emerald-800">0% Commission</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-emerald-950">Total Estimated Cost:</span>
                    <span className="text-xl font-black text-emerald-700">
                      Rs. {totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expected Delivery / Collection Date
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
                    Delivery Address / Depot Location
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. Meegoda Dedicated Economic Centre, Stall #4"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Special Packaging / Transport Notes
                  </label>
                  <textarea
                    rows={2}
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="e.g. We require 25kg plastic crates. Our own lorry will arrive at 7:00 AM."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Purchase Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Related Crops Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900">
            More Fresh Harvests from {product.district} & Similar Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map(rel => (
              <div
                key={rel.id}
                onClick={() => { setSelectedProduct(rel); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center space-x-3 group"
              >
                <img
                  src={rel.image}
                  alt={rel.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-100 flex-shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="space-y-0.5 overflow-hidden">
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                    {rel.name}
                  </h4>
                  <p className="text-[11px] text-emerald-700">{rel.district} District</p>
                  <p className="font-extrabold text-xs text-slate-800">Rs. {rel.pricePerKg} /{rel.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
