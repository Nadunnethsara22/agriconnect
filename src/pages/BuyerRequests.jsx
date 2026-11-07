import React, { useState } from "react";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Phone, 
  MapPin, 
  PlusCircle, 
  Send, 
  ShoppingBag, 
  Sprout, 
  Check, 
  Calendar,
  X
} from "lucide-react";
import { useMarketplace } from "../context/MarketplaceContext";
import { useAuth } from "../context/AuthContext";
import { SRI_LANKA_DISTRICTS } from "../data/mockData";

export default function BuyerRequests({ setActivePage }) {
  const { user, isFarmer, isBuyer, switchRole } = useAuth();
  const { 
    buyerRequests, 
    wantedPosts, 
    updateRequestStatus, 
    postWantedRequest 
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState(isFarmer ? "received" : "my-orders"); // 'my-orders', 'received', 'wanted-board'
  const [wantedModalOpen, setWantedModalOpen] = useState(false);

  // New Wanted Post Form State
  const [newWanted, setNewWanted] = useState({
    cropNeeded: "",
    targetQuantity: "",
    unit: "kg",
    budgetPriceLKR: "",
    requiredByDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    preferredDistricts: ["Nuwara Eliya", "Matale"],
    description: ""
  });

  // Filter requests
  const mySentRequests = buyerRequests.filter(
    r => r.buyerId === user?.uid || r.buyerId === "buyer-1" || (!user?.uid && r.buyerId === "buyer-1")
  );

  const receivedRequests = buyerRequests.filter(
    r => r.farmerId === user?.uid || r.farmerId === "farmer-1" || (!user?.uid && r.farmerId === "farmer-1")
  );

  const handleCreateWanted = async (e) => {
    e.preventDefault();
    await postWantedRequest(newWanted);
    setWantedModalOpen(false);
    setNewWanted({
      cropNeeded: "",
      targetQuantity: "",
      unit: "kg",
      budgetPriceLKR: "",
      requiredByDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      preferredDistricts: ["Nuwara Eliya"],
      description: ""
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Orders & Custom Buying Requirements</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Buyer Purchase Requests & Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track wholesale order status, negotiate agreements with farmers, or publish custom crop procurement requirements.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActivePage("profile")}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center space-x-1.5 flex-shrink-0 border border-slate-200"
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Edit Buyer Profile</span>
          </button>
          <button
            onClick={() => setWantedModalOpen(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-2 flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Post Buying Requirement</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("my-orders")}
          className={`pb-3 px-2 flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === "my-orders"
              ? "border-amber-600 text-amber-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Sent Purchase Orders ({mySentRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("received")}
          className={`pb-3 px-2 flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === "received"
              ? "border-emerald-600 text-emerald-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>Received Farmer Requests ({receivedRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("wanted-board")}
          className={`pb-3 px-2 flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === "wanted-board"
              ? "border-blue-600 text-blue-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Public Wanted Board ({wantedPosts.length})</span>
        </button>
      </div>

      {/* TAB 1: MY SENT PURCHASE ORDERS (BUYER PERSPECTIVE) */}
      {activeTab === "my-orders" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Orders you placed with farmers. Status updates automatically when the farmer accepts or marks completed.
            </p>
          </div>

          {mySentRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Purchase Requests Sent Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore the marketplace and send a purchase offer directly to local vegetable, fruit, or paddy growers.
              </p>
              <button
                onClick={() => setActivePage("marketplace")}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {mySentRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Order #{req.id} • Sent {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900">{req.productName}</h3>
                      <p className="text-xs text-emerald-700 font-medium">Farmer: {req.farmerName}</p>
                    </div>

                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        req.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : req.status === "accepted"
                          ? "bg-emerald-100 text-emerald-800"
                          : req.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {req.status === "pending" && "⏳ Awaiting Farmer Confirmation"}
                        {req.status === "accepted" && "✅ Accepted – Harvest In Preparation"}
                        {req.status === "completed" && "🎉 Order Fulfilled & Received"}
                        {req.status === "declined" && "❌ Declined by Farmer"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-slate-400 text-[10px]">Quantity</p>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">{req.quantity} {req.unit || "kg"}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-slate-400 text-[10px]">Offered Rate</p>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">Rs. {req.offeredPricePerKg} /kg</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-slate-400 text-[10px]">Total Order Amount</p>
                      <p className="font-bold text-emerald-700 text-sm mt-0.5">Rs. {req.totalOfferLKR?.toLocaleString()}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-slate-400 text-[10px]">Target Date & Depot</p>
                      <p className="font-bold text-slate-800 text-xs mt-0.5">{req.deliveryDate}</p>
                      <p className="text-[10px] text-slate-500 truncate">{req.deliveryAddress}</p>
                    </div>
                  </div>

                  {req.note && (
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Your Instructions: </span>
                      {req.note}
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
                    <div className="flex items-center space-x-2">
                      <a
                        href={`https://wa.me/${(req.farmerPhone || "+94773456789").replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, Checking on my AgriConnect order #${req.id} for ${req.quantity}kg ${req.productName}...`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center space-x-1 shadow-sm transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp Farmer to Coordinate Transport</span>
                      </a>
                    </div>

                    {req.status === "accepted" && (
                      <button
                        onClick={() => updateRequestStatus(req.id, "completed")}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm Delivery & Mark Completed</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RECEIVED REQUESTS (FARMER PERSPECTIVE) */}
      {activeTab === "received" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Orders placed by buyers for your agricultural products. Review and accept orders to finalize harvest delivery.
          </p>

          {receivedRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
              <Sprout className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Incoming Buyer Orders</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Buyer purchase requests submitted for your crops will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {receivedRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Order #{req.id} • {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900">{req.productName}</h3>
                      <p className="text-xs text-slate-600">
                        Buyer: <strong className="text-slate-800">{req.buyerName}</strong> ({req.buyerBusiness || "Wholesale Buyer"})
                      </p>
                    </div>

                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        req.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : req.status === "accepted"
                          ? "bg-emerald-100 text-emerald-800"
                          : req.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {req.status === "pending" && "⏳ Pending Decision"}
                        {req.status === "accepted" && "✅ You Accepted This Order"}
                        {req.status === "completed" && "🎉 Delivered & Completed"}
                        {req.status === "declined" && "❌ Declined"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-slate-400 text-[10px]">Requested Stock</p>
                      <p className="font-bold text-emerald-700 text-sm mt-0.5">{req.quantity} {req.unit || "kg"}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-slate-400 text-[10px]">Offered Rate</p>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">Rs. {req.offeredPricePerKg} /kg</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-slate-400 text-[10px]">Total Order Amount</p>
                      <p className="font-black text-emerald-800 text-sm mt-0.5">Rs. {req.totalOfferLKR?.toLocaleString()}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-slate-400 text-[10px]">Delivery Depot</p>
                      <p className="font-bold text-slate-800 text-xs mt-0.5">{req.buyerDistrict}</p>
                      <p className="text-[10px] text-slate-500 truncate">{req.deliveryAddress}</p>
                    </div>
                  </div>

                  {req.note && (
                    <div className="p-3 bg-emerald-50 rounded-xl text-xs text-slate-700 border border-emerald-100">
                      <span className="font-semibold text-emerald-800">Buyer Instructions: </span>
                      {req.note}
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
                    <a
                      href={`https://wa.me/${req.buyerPhone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${req.buyerName}, Regarding your AgriConnect request for ${req.quantity}kg ${req.productName}...`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center space-x-1 shadow-sm transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Buyer ({req.buyerPhone})</span>
                    </a>

                    {req.status === "pending" && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateRequestStatus(req.id, "declined")}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-semibold"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => updateRequestStatus(req.id, "accepted")}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Accept & Deduct Stock</span>
                        </button>
                      </div>
                    )}

                    {req.status === "accepted" && (
                      <button
                        onClick={() => updateRequestStatus(req.id, "completed")}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                      >
                        Mark Order Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PUBLIC WANTED BOARD */}
      {activeTab === "wanted-board" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Procurement requests posted by supermarkets, exporters, and caterers. Farmers can contact buyers directly to fulfill orders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wantedPosts.map((wp) => (
              <div
                key={wp.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Buying Requirement
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Need by {wp.requiredByDate}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900">{wp.cropNeeded}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{wp.description}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 text-xs border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Required Quantity:</span>
                    <span className="font-bold text-slate-800">{wp.targetQuantity} {wp.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Budget:</span>
                    <span className="font-bold text-emerald-700">Rs. {wp.budgetPriceLKR} /{wp.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Buyer Location:</span>
                    <span className="font-medium text-slate-700">{wp.buyerDistrict}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">{wp.buyerName}</p>
                    <p className="text-[11px] text-slate-500">{wp.buyerBusiness}</p>
                  </div>

                  <a
                    href={`https://wa.me/${wp.buyerPhone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${wp.buyerName}, I saw your AgriConnect wanted post for ${wp.targetQuantity}${wp.unit} of ${wp.cropNeeded}. I am a farmer and can supply this.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center space-x-1 shadow-sm transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Offer Produce</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POST WANTED REQUIREMENT MODAL */}
      {wantedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <FileText className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Post Buying Requirement</h3>
                  <p className="text-xs text-amber-100">Broadcast your harvest demand to registered farmers</p>
                </div>
              </div>
              <button onClick={() => setWantedModalOpen(false)} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWanted} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Crop / Commodity Needed</label>
                <input
                  type="text"
                  placeholder="e.g. Big Onions, Green Chillies, Keeri Samba Rice..."
                  value={newWanted.cropNeeded}
                  onChange={(e) => setNewWanted({ ...newWanted, cropNeeded: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Quantity</label>
                  <input
                    type="number"
                    placeholder="e.g. 1000"
                    value={newWanted.targetQuantity}
                    onChange={(e) => setNewWanted({ ...newWanted, targetQuantity: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Unit Price (Rs./kg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 320"
                    value={newWanted.budgetPriceLKR}
                    onChange={(e) => setNewWanted({ ...newWanted, budgetPriceLKR: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold text-emerald-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Required By Date</label>
                <input
                  type="date"
                  value={newWanted.requiredByDate}
                  onChange={(e) => setNewWanted({ ...newWanted, requiredByDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specifications & Quality Requirement</label>
                <textarea
                  rows={3}
                  placeholder="Detail preferred grade, moisture limit, packing requirements, delivery terms..."
                  value={newWanted.description}
                  onChange={(e) => setNewWanted({ ...newWanted, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-700"
                  required
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWantedModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Requirement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
