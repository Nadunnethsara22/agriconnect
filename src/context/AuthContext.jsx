import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  auth, 
  db, 
  isFirebaseConfigured 
} from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc 
} from "firebase/firestore";
import { DEMO_USERS } from "../data/mockData";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("agriconnect_current_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Don't auto-login legacy demo users now that Firebase is active
        if (parsed?.uid === "farmer-1" || parsed?.uid === "buyer-1") {
          localStorage.removeItem("agriconnect_current_user");
          return null;
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("agriconnect_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("agriconnect_current_user");
    }
  }, [user]);

  // Listen to Firebase auth state if configured
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          if (db) {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
              setUser({ uid: firebaseUser.uid, ...userSnap.data() });
              return;
            }
          }
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
            role: "farmer",
            phone: firebaseUser.phoneNumber || "",
            district: "Colombo"
          });
        } catch (err) {
          console.error("Error fetching user profile from firestore:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password, preferredRole = "farmer") => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        let profile = null;
        if (db) {
          const snap = await getDoc(doc(db, "users", userCred.user.uid));
          if (snap.exists()) {
            profile = snap.data();
          }
        }
        const isAdminEmail = email.toLowerCase().includes("admin") || preferredRole === "admin";
        const detectedRole = profile?.role || (isAdminEmail ? "admin" : (preferredRole || "farmer"));

        const loggedUser = {
          uid: userCred.user.uid,
          email: userCred.user.email,
          displayName: profile?.displayName || userCred.user.displayName || (isAdminEmail ? "Market Price Admin" : email.split("@")[0]),
          role: detectedRole,
          district: profile?.district || "Colombo",
          phone: profile?.phone || "+94 77 000 0000",
          ...profile
        };
        setUser(loggedUser);
        return { success: true, user: loggedUser };
      } else {
        // Fallback local auth simulation (create clean isolated user, do not clone mock demo profile)
        const isAdmin = email.toLowerCase().includes("admin") || preferredRole === "admin";
        const isFarmer = preferredRole === "farmer" || (email.toLowerCase().includes("farmer") && preferredRole !== "buyer");
        const detectedRole = isAdmin ? "admin" : isFarmer ? "farmer" : "buyer";
        const baseUser = {
          uid: "user_" + Date.now(),
          email,
          displayName: email.split("@")[0] || (isAdmin ? "Market Price Admin" : isFarmer ? "Farmer" : "Buyer"),
          role: detectedRole,
          district: "Colombo",
          phone: "+94 77 000 0000"
        };
        setUser(baseUser);
        return { success: true, user: baseUser };
      }
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const { email, password, role, displayName, phone, district, farmName, businessName, location } = userData;

      const derivedLocation = location || (farmName ? `${farmName}, ${district || 'Sri Lanka'}` : (district ? `${district}, Sri Lanka` : ""));

      let uid = "user_" + Date.now();
      if (isFirebaseConfigured && auth) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        uid = userCred.user.uid;
        if (db) {
          await setDoc(doc(db, "users", uid), {
            uid,
            email,
            displayName,
            role,
            phone: phone || "",
            district: district || "Colombo",
            location: derivedLocation,
            farmName: farmName || "",
            businessName: businessName || "",
            createdAt: new Date().toISOString()
          });
        }
      }

      const newUser = {
        uid,
        email,
        displayName,
        role: role || "farmer",
        phone: phone || "",
        district: district || "Colombo",
        location: derivedLocation,
        farmName: farmName || (role === "farmer" ? `${displayName}'s Farm` : ""),
        businessName: businessName || (role === "buyer" ? `${displayName} Wholesale` : ""),
        rating: 5.0,
        createdAt: new Date().toISOString()
      };

      setUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      console.error("Registration error:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
    } catch (e) {
      console.warn("SignOut error:", e);
    }
    setUser(null);
    localStorage.removeItem("agriconnect_current_user");
  };

  const loginAsDemoFarmer = () => {
    setUser({ ...DEMO_USERS.farmer });
  };

  const loginAsDemoBuyer = () => {
    setUser({ ...DEMO_USERS.buyer });
  };

  const loginAsDemoAdmin = () => {
    setUser({ ...DEMO_USERS.admin });
  };

  const switchRole = (newRole) => {
    if (newRole === "admin") {
      setUser({ ...DEMO_USERS.admin });
    } else if (newRole === "farmer") {
      setUser({ ...DEMO_USERS.farmer });
    } else {
      setUser({ ...DEMO_USERS.buyer });
    }
  };

  const updateProfile = async (updatedFields) => {
    try {
      if (isFirebaseConfigured && db && user?.uid) {
        await setDoc(doc(db, "users", user.uid), updatedFields, { merge: true });
      }
      setUser((prev) => {
        const updated = { ...prev, ...updatedFields };
        return updated;
      });
      return { success: true };
    } catch (err) {
      console.error("Update profile error:", err);
      return { success: false, error: err.message };
    }
  };

  const loginWithGoogle = async (role = "farmer") => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider);
        const firebaseUser = res.user;
        let profile = null;

        if (db) {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            profile = userSnap.data();
          } else {
            profile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "Agri User",
              role: role,
              district: "Colombo",
              phone: firebaseUser.phoneNumber || "+94 77 123 4567",
              avatar: firebaseUser.photoURL || "",
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, profile);
          }
        }

        const loggedUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || profile?.displayName || "Agri User",
          role: profile?.role || role,
          district: profile?.district || "Colombo",
          avatar: firebaseUser.photoURL || profile?.avatar || "",
          ...profile
        };

        setUser(loggedUser);
        return { success: true, user: loggedUser };
      } else {
        const demo = role === "farmer" ? { ...DEMO_USERS.farmer } : { ...DEMO_USERS.buyer };
        setUser(demo);
        return { success: true, user: demo };
      }
    } catch (err) {
      console.error("Google sign in error:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || "farmer",
        isFarmer: user?.role === "farmer",
        isBuyer: user?.role === "buyer",
        isAdmin: user?.role === "admin" || user?.email?.toLowerCase().includes("admin"),
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        loginAsDemoFarmer,
        loginAsDemoBuyer,
        loginAsDemoAdmin,
        switchRole,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
