import React, { useState } from "react";
import { 
  Sprout, 
  Package, 
  Clock, 
  DollarSign, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Phone, 
  AlertTriangle, 
  Layers, 
  TrendingUp, 
  Check, 
  Save, 
  MapPin,
  Calendar,
  Eye
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useMarketplace } from "../context/MarketplaceContext";

export default function FarmerDashboard({ setActivePage, setSelectedProduct }) {
  const { user } = useAuth();
  const { 
    products, 
    buyerRequests, 
    updateProduct, 
    deleteProduct, 
    updateRequestStatus 
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState("products"); // 'products', 'requests', 'analytics'
  const [editingProductId, setEditingProductId] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");

  // Filter products for this farmer (strictly for the logged in farmer, no mock leakage)
  const myProducts = products.filter(
    p => user?.uid ? (p.farmerId === user.uid || (user.email && p.farmerEmail === user.email)) : false
  );

  // Filter purchase requests for this farmer (strictly for the logged in farmer, no mock leakage)
  const myRequests = buyerRequests.filter(
    r => user?.uid ? (r.farmerId === user.uid || (user.email && r.farmerEmail === user.email)) : false
  );

  // Quick statistics
  const totalStockKg = myProducts.reduce((sum, p) => sum + (p.stockKg || 0), 0);
  const pendingRequests = myRequests.filter(r => r.status === "pending");
  const acceptedRequests = myRequests.filter(r => r.status === "accepted" || r.status === "completed");
  const estimatedRevenue = acceptedRequests.reduce((sum, r) => sum + (r.totalOfferLKR || 0), 0);

  const startEditing = (p) => {
    setEditingProductId(p.id);
    setEditPrice(p.pricePerKg);
    setEditStock(p.stockKg);
  };

  const saveInlineEdit = (id) => {
    updateProduct(id, {
      pricePerKg: Number(editPrice),
      stockKg: Number(editStock),
      status: Number(editStock) <= 0 ? "out_of_stock" : "available"
    });
    setEditingProductId(null);
  };

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to remove ${name} from your listings?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Dashboard Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold">
            <Sprout className="w-3.5 h-3.5" />
            <span>Verified Farmer Portal • {user?.district || "Nuwara Eliya"} District</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.displayName || "Sunil Bandara"}'s Farm Dashboard
          </h1>
          <p className="text-emerald-200 text-xs sm:text-sm">
            {user?.farmName || "Green Valley Highland Farms"} • Managing harvest inventory, wholesale price updates, and buyer requests.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActivePage("profile")}
            className="px-3.5 py-2.5 bg-emerald-700/80 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow transition-all flex items-center space-x-1.5 flex-shrink-0 border border-emerald-600/50"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Farm Profile</span>
          </button>
          <button
            onClick={() => setActivePage("add-product")}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2 flex-shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add New Harvest</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Crops</p>
            <p className="text-xl font-extrabold text-slate-900">{myProducts.length} Listed</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Stock on Hand</p>
            <p className="text-xl font-extrabold text-slate-900">{totalStockKg.toLocaleString()} kg</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Requests</p>
            <p className="text-xl font-extrabold text-amber-600">{pendingRequests.length} Orders</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Fulfilled Revenue</p>
            <p className="text-xl font-extrabold text-purple-700">Rs. {estimatedRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 space-x-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 px-2 flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === "products"
              ? "border-emerald-600 text-emerald-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Products & Stock ({myProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`pb-3 px-2 flex items-center space-x-2 border-b-2 transition-colors relative ${
            activeTab === "requests"
              ? "border-emerald-600 text-emerald-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Buyer Requests ({myRequests.length})</span>
          {pendingRequests.length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px]">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-3 px-2 flex items-center space-x-2 border-b-2 transition-colors ${
            activeTab === "analytics"
              ? "border-emerald-600 text-emerald-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Sales & Demand Analytics</span>
        </button>
      </div>

      {/* TAB 1: MY PRODUCTS & STOCK MANAGEMENT */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Manage Products & Update Prices</h2>
              <p className="text-xs text-slate-500">Edit unit price per kg and available stock in real-time.</p>
            </div>
            <button
              onClick={() => setActivePage("add-product")}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Product / Crop</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (Rs./kg)</th>
                    <th className="py-3 px-4">Available Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Harvest Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-500">
                        No products listed yet. Click "+ Add New Harvest" to post your first crop!
                      </td>
                    </tr>
                  ) : (
                    myProducts.map((p) => {
                      const isEditing = editingProductId === p.id;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                              />
                              <div>
                                <p className="font-bold text-slate-900">{p.name}</p>
                                <p className="text-[11px] text-emerald-700">{p.sinhalaName || p.variety}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-slate-600 capitalize">
                            {p.category}
                          </td>

                          {/* Editable Price */}
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="w-20 px-2 py-1 text-xs border border-emerald-500 rounded focus:outline-none"
                              />
                            ) : (
                              <span>Rs. {p.pricePerKg}</span>
                            )}
                          </td>

                          {/* Editable Stock */}
                          <td className="py-3 px-4">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editStock}
                                onChange={(e) => setEditStock(e.target.value)}
                                className="w-20 px-2 py-1 text-xs border border-emerald-500 rounded focus:outline-none"
                              />
                            ) : (
                              <span className="font-medium text-slate-800">{p.stockKg} {p.unit}</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.stockKg > 0 
                                ? "bg-emerald-100 text-emerald-800" 
                                : "bg-red-100 text-red-700"
                            }`}>
                              {p.stockKg > 0 ? "In Stock" : "Sold Out"}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-slate-500">
                            {p.harvestDate || "Fresh"}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end space-x-1">
                                <button
                                  onClick={() => saveInlineEdit(p.id)}
                                  className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 shadow-sm"
                                  title="Save Changes"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingProductId(null)}
                                  className="p-1.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                                  title="Cancel"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end space-x-1">
                                <button
                                  onClick={() => {
                                    setSelectedProduct(p);
                                    setActivePage("product-details");
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded"
                                  title="View Public Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => startEditing(p)}
                                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded"
                                  title="Quick Edit Price & Stock"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(p.id, p.name)}
                                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INCOMING BUYER REQUESTS */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Incoming Buyer Purchase Requests</h2>
            <p className="text-xs text-slate-500">Review purchase bids sent by supermarkets, restaurants, and wholesalers.</p>
          </div>

          <div className="space-y-3">
            {myRequests.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500 text-xs">
                No buyer purchase requests yet. Buyers browsing your crops in the marketplace will send requests here.
              </div>
            ) : (
              myRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Order #{req.id} • {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900">{req.productName}</h3>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        req.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : req.status === "accepted"
                          ? "bg-emerald-100 text-emerald-800"
                          : req.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {req.status === "pending" && "⏳ Pending Your Review"}
                        {req.status === "accepted" && "✅ Accepted & In Progress"}
                        {req.status === "completed" && "🎉 Fulfilled & Delivered"}
                        {req.status === "declined" && "❌ Declined"}
                      </span>
                    </div>
                  </div>

                  {/* Request Highlights */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <p className="text-slate-400 text-[10px]">Buyer Name & Firm</p>
                      <p className="font-bold text-slate-800">{req.buyerName}</p>
                      <p className="text-[11px] text-slate-500">{req.buyerBusiness}</p>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <p className="text-slate-400 text-[10px]">Requested Quantity</p>
                      <p className="font-bold text-emerald-700 text-sm">{req.quantity} {req.unit || "kg"}</p>
                      <p className="text-[10px] text-slate-500">Need by {req.deliveryDate}</p>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <p className="text-slate-400 text-[10px]">Offered Unit Price</p>
                      <p className="font-bold text-slate-800 text-sm">Rs. {req.offeredPricePerKg} /kg</p>
                      <p className="text-[10px] text-slate-500">Total: Rs. {req.totalOfferLKR?.toLocaleString()}</p>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <p className="text-slate-400 text-[10px]">Delivery / Depot</p>
                      <p className="font-bold text-slate-800">{req.buyerDistrict}</p>
                      <p className="text-[10px] text-slate-500 truncate">{req.deliveryAddress}</p>
                    </div>
                  </div>

                  {req.note && (
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-slate-700">
                      <span className="font-semibold text-emerald-800">Buyer Note: </span>
                      {req.note}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <a
                        href={`https://wa.me/${(req.buyerPhone || "+94771234567").replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${req.buyerName}, Regarding your AgriConnect request for ${req.quantity}kg ${req.productName}...`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp Buyer ({req.buyerPhone || "+94 77 123 4567"})</span>
                      </a>
                    </div>

                    {req.status === "pending" && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateRequestStatus(req.id, "declined")}
                          className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-semibold transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => updateRequestStatus(req.id, "accepted")}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm transition-colors flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Accept Request</span>
                        </button>
                      </div>
                    )}

                    {req.status === "accepted" && (
                      <button
                        onClick={() => updateRequestStatus(req.id, "completed")}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-colors flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Delivered & Fulfilled</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SALES & DEMAND ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Farmer Sales Performance & Revenue Forecast</h2>
              <p className="text-xs text-slate-500">Track demand patterns and monthly revenue growth from direct buyer partnerships.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-1">
                <p className="text-xs text-emerald-800 font-semibold">Average Wholesale Realization</p>
                <p className="text-2xl font-black text-emerald-950">+18.5%</p>
                <p className="text-[11px] text-emerald-700">Higher earnings compared to traditional intermediary brokers.</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-1">
                <p className="text-xs text-blue-800 font-semibold">Order Fulfillment Rate</p>
                <p className="text-2xl font-black text-blue-950">94.2%</p>
                <p className="text-[11px] text-blue-700">High reliability score attracts recurring supermarket contracts.</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-1">
                <p className="text-xs text-purple-800 font-semibold">Repeat Buyer Rate</p>
                <p className="text-2xl font-black text-purple-950">68%</p>
                <p className="text-[11px] text-purple-700">Buyers from Colombo and Kandy order weekly.</p>
              </div>
            </div>

            {/* Quick Link to Sri Lanka Economic Centre Index */}
            <div className="p-5 bg-gradient-to-r from-emerald-900 to-green-900 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-base">Check Sri Lanka Daily Economic Centre Index</h3>
                <p className="text-xs text-emerald-200">
                  Compare your farm gate prices with today's wholesale auction rates in Dambulla, Manning Market & Keppetipola.
                </p>
              </div>
              <button
                onClick={() => setActivePage("analytics")}
                className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs font-bold rounded-xl shadow transition-colors flex-shrink-0"
              >
                View Full Economic Centre Prices →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
