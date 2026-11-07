import React, { useState } from "react";
import { 
  X, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Key, 
  RotateCcw, 
  Save 
} from "lucide-react";
import { 
  firebaseConfig, 
  isFirebaseConfigured, 
  saveCustomFirebaseConfig, 
  clearCustomFirebaseConfig 
} from "../firebase";

export default function FirebaseModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    apiKey: firebaseConfig.apiKey || "",
    authDomain: firebaseConfig.authDomain || "",
    projectId: firebaseConfig.projectId || "",
    storageBucket: firebaseConfig.storageBucket || "",
    messagingSenderId: firebaseConfig.messagingSenderId || "",
    appId: firebaseConfig.appId || ""
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveCustomFirebaseConfig(formData);
    setSavedSuccess(true);
  };

  const handleReset = () => {
    if (confirm("Reset to default simulated reactive storage?")) {
      clearCustomFirebaseConfig();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-agri-700 to-agri-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Database className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Firebase Connection Status</h3>
              <p className="text-xs text-agri-100">Configure or verify your Firebase project credentials</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Status banner */}
          <div className={`p-4 rounded-xl flex items-start space-x-3 text-sm ${
            isFirebaseConfigured 
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800" 
              : "bg-amber-50 border border-amber-200 text-amber-800"
          }`}>
            {isFirebaseConfigured ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">
                {isFirebaseConfigured 
                  ? "Connected to Live Firebase Project" 
                  : "Interactive Local/Simulated Storage Mode"}
              </p>
              <p className="text-xs mt-1 text-slate-600">
                {isFirebaseConfigured
                  ? `Active Project: ${firebaseConfig.projectId}. Authentication and Firestore sync are operational.`
                  : "All marketplace features, products, buyer requests, and analytics work seamlessly with persistent local storage. To connect your live Firebase instance, enter your credentials below."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Project ID</label>
              <input
                type="text"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                placeholder="e.g. agriconnect-srilanka"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">API Key</label>
              <input
                type="text"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Auth Domain</label>
                <input
                  type="text"
                  name="authDomain"
                  value={formData.authDomain}
                  onChange={handleChange}
                  placeholder="project.firebaseapp.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Storage Bucket</label>
                <input
                  type="text"
                  name="storageBucket"
                  value={formData.storageBucket}
                  onChange={handleChange}
                  placeholder="project.appspot.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Messaging Sender ID</label>
                <input
                  type="text"
                  name="messagingSenderId"
                  value={formData.messagingSenderId}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">App ID</label>
                <input
                  type="text"
                  name="appId"
                  value={formData.appId}
                  onChange={handleChange}
                  placeholder="1:12345:web:abcdef"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-agri-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-agri-600 hover:bg-agri-700 rounded-lg shadow transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Config</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
