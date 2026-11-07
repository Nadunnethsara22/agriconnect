import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  INITIAL_PRODUCTS, 
  INITIAL_BUYER_REQUESTS, 
  INITIAL_WANTED_POSTS,
  ECONOMIC_CENTRE_PRICES 
} from "../data/mockData";
import { 
  db, 
  isFirebaseConfigured 
} from "../firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  doc 
} from "firebase/firestore";
import { useAuth } from "./AuthContext";

const MarketplaceContext = createContext(null);

export const MarketplaceProvider = ({ children }) => {
  const { user } = useAuth();

  // Load products with fallback
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("agriconnect_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Load Buyer Purchase Requests
  const [buyerRequests, setBuyerRequests] = useState(() => {
    const saved = localStorage.getItem("agriconnect_buyer_requests");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_BUYER_REQUESTS;
      }
    }
    return INITIAL_BUYER_REQUESTS;
  });

  // Load Wanted Posts
  const [wantedPosts, setWantedPosts] = useState(() => {
    const saved = localStorage.getItem("agriconnect_wanted_posts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_WANTED_POSTS;
      }
    }
    return INITIAL_WANTED_POSTS;
  });

  // Load Economic Centre Benchmark Prices (Managed by Admin)
  const [economicPrices, setEconomicPrices] = useState(() => {
    const saved = localStorage.getItem("agriconnect_economic_prices");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ECONOMIC_CENTRE_PRICES;
      }
    }
    return ECONOMIC_CENTRE_PRICES;
  });

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("agriconnect_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("agriconnect_buyer_requests", JSON.stringify(buyerRequests));
  }, [buyerRequests]);

  useEffect(() => {
    localStorage.setItem("agriconnect_wanted_posts", JSON.stringify(wantedPosts));
  }, [wantedPosts]);

  useEffect(() => {
    localStorage.setItem("agriconnect_economic_prices", JSON.stringify(economicPrices));
  }, [economicPrices]);

  // Sync with Firestore if configured
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    const fetchFirestoreData = async () => {
      try {
        const prodSnap = await getDocs(collection(db, "products"));
        if (!prodSnap.empty) {
          const list = prodSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          setProducts(list);
        }

        const reqSnap = await getDocs(collection(db, "buyer_requests"));
        if (!reqSnap.empty) {
          const list = reqSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          setBuyerRequests(list);
        }

        const wantedSnap = await getDocs(collection(db, "wanted_posts"));
        if (!wantedSnap.empty) {
          const list = wantedSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          setWantedPosts(list);
        }

        const priceSnap = await getDocs(collection(db, "economic_prices"));
        if (!priceSnap.empty) {
          const list = priceSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          // Merge with default list to preserve history array if missing
          setEconomicPrices(prev => {
            return prev.map(defaultP => {
              const matched = list.find(item => item.crop === defaultP.crop || item.id === defaultP.crop);
              return matched ? { ...defaultP, ...matched } : defaultP;
            });
          });
        }
      } catch (err) {
        console.warn("Firestore sync warning:", err);
      }
    };

    fetchFirestoreData();
  }, []);

  // ADD PRODUCT (Farmer)
  const addProduct = async (productData) => {
    const newId = "prod-" + Date.now();
    const newProduct = {
      id: newId,
      farmerId: user?.uid || "farmer-1",
      farmerName: user?.displayName || "Farmer",
      farmerPhone: user?.phone || "+94 77 123 4567",
      farmName: user?.farmName || "Highland Harvest Farm",
      farmerRating: user?.rating || 4.9,
      farmerReviews: 12,
      createdAt: new Date().toISOString(),
      status: "available",
      ...productData,
      pricePerKg: Number(productData.pricePerKg),
      stockKg: Number(productData.stockKg),
      minOrderKg: Number(productData.minOrderKg || 10),
      wholesalePrice: Number(productData.wholesalePrice || productData.pricePerKg * 0.92)
    };

    // If Firestore is available
    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, "products"), newProduct);
        newProduct.id = docRef.id;
      } catch (e) {
        console.warn("Could not save to firestore, saved locally", e);
      }
    }

    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  // UPDATE PRODUCT (Farmer)
  const updateProduct = async (id, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updatedFields };
        if (updatedFields.pricePerKg) updated.pricePerKg = Number(updatedFields.pricePerKg);
        if (updatedFields.stockKg) updated.stockKg = Number(updatedFields.stockKg);
        return updated;
      }
      return p;
    }));

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, "products", id), updatedFields);
      } catch (e) {
        console.warn("Firestore update error:", e);
      }
    }
  };

  // DELETE PRODUCT (Farmer)
  const deleteProduct = async (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "products", id));
      } catch (e) {
        console.warn("Firestore delete error:", e);
      }
    }
  };

  // SEND PURCHASE REQUEST (Buyer)
  const sendPurchaseRequest = async (requestData) => {
    const newId = "req-" + Date.now();
    const newRequest = {
      id: newId,
      buyerId: user?.uid || "buyer-1",
      buyerName: user?.displayName || "Buyer",
      buyerBusiness: user?.businessName || "Wholesale Buyer",
      buyerPhone: user?.phone || "+94 77 987 6543",
      buyerDistrict: user?.district || "Colombo",
      status: "pending",
      createdAt: new Date().toISOString(),
      ...requestData,
      quantity: Number(requestData.quantity),
      offeredPricePerKg: Number(requestData.offeredPricePerKg),
      totalOfferLKR: Number(requestData.quantity) * Number(requestData.offeredPricePerKg)
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, "buyer_requests"), newRequest);
        newRequest.id = docRef.id;
      } catch (e) {
        console.warn("Could not save request to firestore:", e);
      }
    }

    setBuyerRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  // UPDATE REQUEST STATUS (Farmer accepts/declines, Buyer marks completed)
  const updateRequestStatus = async (requestId, status, note = "") => {
    setBuyerRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, status, farmerResponseNote: note, updatedAt: new Date().toISOString() };
      }
      return req;
    }));

    // If accepted, optionally deduct product stock!
    if (status === "accepted") {
      const targetReq = buyerRequests.find(r => r.id === requestId);
      if (targetReq && targetReq.productId) {
        setProducts(prev => prev.map(p => {
          if (p.id === targetReq.productId) {
            const remaining = Math.max(0, p.stockKg - targetReq.quantity);
            return { ...p, stockKg: remaining, status: remaining === 0 ? "out_of_stock" : "available" };
          }
          return p;
        }));
      }
    }

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, "buyer_requests", requestId), { status, farmerResponseNote: note, updatedAt: new Date().toISOString() });
      } catch (e) {
        console.warn("Firestore request status update error:", e);
      }
    }
  };

  // POST WANTED REQUIREMENT (Buyer)
  const postWantedRequest = async (wantedData) => {
    const newId = "wanted-" + Date.now();
    const newPost = {
      id: newId,
      buyerId: user?.uid || "buyer-1",
      buyerName: user?.displayName || "Buyer",
      buyerBusiness: user?.businessName || "Produce Merchant",
      buyerPhone: user?.phone || "+94 77 987 6543",
      buyerDistrict: user?.district || "Colombo",
      status: "active",
      responsesCount: 0,
      createdAt: new Date().toISOString(),
      ...wantedData,
      targetQuantity: Number(wantedData.targetQuantity),
      budgetPriceLKR: Number(wantedData.budgetPriceLKR)
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, "wanted_posts"), newPost);
        newPost.id = docRef.id;
      } catch (e) {
        console.warn("Firestore wanted post error:", e);
      }
    }

    setWantedPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  // UPDATE ECONOMIC CENTRE BENCHMARK PRICES (Admin)
  const updateCropPrice = async (cropName, updatedFields) => {
    const sanitizedFields = {
      ...updatedFields,
      dambullaWholesale: Number(updatedFields.dambullaWholesale),
      manningWholesale: Number(updatedFields.manningWholesale),
      keppetipolaWholesale: Number(updatedFields.keppetipolaWholesale),
      farmerDirectAvg: Number(updatedFields.farmerDirectAvg),
      retailAverage: Number(updatedFields.retailAverage),
      trendPercent: Number(updatedFields.trendPercent || 0)
    };

    setEconomicPrices(prev => prev.map(item => {
      if (item.crop === cropName) {
        // Also update latest day in history if exists
        const updatedHistory = item.history ? [...item.history] : [];
        if (updatedHistory.length > 0) {
          const lastIdx = updatedHistory.length - 1;
          updatedHistory[lastIdx] = {
            ...updatedHistory[lastIdx],
            dambulla: sanitizedFields.dambullaWholesale,
            farmerDirect: sanitizedFields.farmerDirectAvg
          };
        }
        return {
          ...item,
          ...sanitizedFields,
          history: updatedHistory
        };
      }
      return item;
    }));

    if (isFirebaseConfigured && db) {
      try {
        const docId = cropName.toLowerCase().replace(/[^a-z0-9]/g, "_");
        await setDoc(doc(db, "economic_prices", docId), {
          crop: cropName,
          ...sanitizedFields,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn("Could not sync economic price to firestore:", err);
      }
    }

    return { success: true };
  };

  // RESET TO DEFAULT BENCHMARKS (Admin)
  const resetEconomicPrices = () => {
    setEconomicPrices(ECONOMIC_CENTRE_PRICES);
    localStorage.removeItem("agriconnect_economic_prices");
  };

  // Filter helpers
  const farmerProducts = products.filter(p => p.farmerId === user?.uid || (!user?.uid && p.farmerId === "farmer-1"));
  const farmerRequests = buyerRequests.filter(r => r.farmerId === user?.uid || (!user?.uid && r.farmerId === "farmer-1"));
  const buyerSentRequests = buyerRequests.filter(r => r.buyerId === user?.uid || (!user?.uid && r.buyerId === "buyer-1"));

  // Pending count for badges
  const pendingRequestsCount = user?.role === "farmer" 
    ? farmerRequests.filter(r => r.status === "pending").length 
    : buyerSentRequests.filter(r => r.status === "pending").length;

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        buyerRequests,
        wantedPosts,
        economicPrices,
        farmerProducts,
        farmerRequests,
        buyerSentRequests,
        pendingRequestsCount,
        addProduct,
        updateProduct,
        deleteProduct,
        sendPurchaseRequest,
        updateRequestStatus,
        postWantedRequest,
        updateCropPrice,
        resetEconomicPrices
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
};
