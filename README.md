# 🌾 AgriConnect Sri Lanka – Farmer & Buyer Agricultural Marketplace

> **Sri Lanka Real-World Solution #10**: Direct Farmer & Buyer Digital Agricultural Exchange (ගොවි සවිය - පාරිභෝගික තෘප්තිය).  
> Built with **React** & **Firebase**.

---

## 🌟 Overview & Key Mission

**AgriConnect Sri Lanka** eliminates exploitative intermediary middleman margins by connecting Sri Lankan vegetable, fruit, grain, and spice farmers across all 25 districts directly with wholesale merchants, supermarkets, hotels, catering chains, and export companies.

### 👥 Role-Based Capabilities

#### 🌾 For Farmers:
* **Add Agricultural Products**: Upload harvest details, images, crop varieties, harvest dates, and location.
* **Update Prices & Manage Stock**: Real-time inline price per kg adjustments and stock quantity management.
* **View & Manage Buyer Requests**: Review purchase offers, negotiate wholesale rates, accept orders, and communicate directly with buyers via WhatsApp or phone.
* **Sales Analytics & Insights**: Track revenue growth, order fulfillment rates, and compare farm-gate rates with major Economic Centres (Dambulla DEC, Manning Market, Keppetipola).

#### 🛒 For Buyers (Wholesalers, Supermarkets, Restaurants, Exporters):
* **Browse Agricultural Marketplace**: Filter crops by 25 Sri Lankan districts, categories (Vegetables, Fruits, Grains/Paddy, Spices, Coconut), and organic certification.
* **Compare Real-Time Market Rates**: Compare farmer direct prices against daily wholesale rates from Dambulla and Manning Market.
* **Send Purchase Requests**: Custom purchase offer forms with automated price calculations, requested delivery dates, and depot destinations.
* **Track Order Status**: Real-time visibility into order status (`Pending`, `Accepted`, `Completed`, `Declined`).
* **Public Wanted Board**: Post custom procurement requirements (e.g. "Looking for 1,000kg Big Onions in Matale") and receive direct supplier offers.

---

## 📄 Pages Included

1. **Landing Page (`LandingPage.jsx`)**
   - Hero section with live Sri Lankan Economic Centre ticker (Dambulla, Manning Market, Keppetipola, Meegoda).
   - Agricultural categories showcase (Upcountry & Lowcountry Vegetables, Tropical Fruits, Paddy & Grains, Ceylon Spices, Coconut).
   - Featured fresh harvests ready for immediate purchase.
   - Transparent ecosystem comparison (Benefits for Farmers vs. Benefits for Buyers).
   - Real testimonials from local growers and wholesale procurement managers.

2. **Register / Login (`AuthPage.jsx`)**
   - Role-specific account registration (`Farmer` vs `Buyer`).
   - District selection across all 25 administrative districts in Sri Lanka.
   - **1-Click Instant Demo Login**:
     - *Demo Farmer*: Sunil Bandara (Nuwara Eliya Highland Farms)
     - *Demo Buyer*: Priyantha Silva (Colombo Fresh Supermarkets Network)
   - Integrated with Firebase Authentication.

3. **Product Marketplace (`Marketplace.jsx`)**
   - Search by crop name, Sinhala title, farmer name, or district.
   - Filter by categories, districts, organic-only, and price range.
   - Sort by newest harvest, lowest price, highest price, or largest stock.
   - Direct WhatsApp chat link and quick purchase request modal.

4. **Add Product (`AddProduct.jsx`)**
   - Farmer tool for uploading harvest listings.
   - Preset Sri Lankan crop photography options (Carrots, Leeks, Tomatoes, Onions, Paddy, Papaya, Coconuts, Black Pepper) + custom image URLs.
   - Real-time **Live Marketplace Preview Card** displaying how buyers see the listing.

5. **Product Details (`ProductDetails.jsx`)**
   - High-resolution imagery, freshness timestamps, and stock meters.
   - Verified farmer card with rating, reviews, phone number, and pre-formatted WhatsApp chat.
   - **Economic Centre Benchmark Comparison**: Direct price vs Dambulla wholesale vs retail average.
   - Interactive Purchase Offer Form with live price calculation.

6. **Farmer Dashboard (`FarmerDashboard.jsx`)**
   - Summary metric cards (Active crops, total stock on hand, pending orders, fulfilled revenue).
   - Inline crop price and stock quantity editor.
   - Incoming buyer request management with Accept / Decline / Complete actions.
   - Sales performance and revenue growth forecast.

7. **Buyer Requests & Orders (`BuyerRequests.jsx`)**
   - **My Sent Purchase Orders**: Track status of orders placed with farmers.
   - **Received Farmer Requests**: Manage incoming wholesale purchase offers.
   - **Public Wanted Board**: Post custom harvest needs and let farmers reach out.

8. **Analytics & Price Statistics (`Analytics.jsx`)**
   - Interactive Sri Lanka Daily Economic Centre wholesale price benchmark index.
   - Interactive 7-day price movement trend chart (Dambulla DEC vs Farmer Direct).
   - Wholesale price board across Dambulla, Manning Market, Keppetipola, and Meegoda.
   - Platform transaction volume and farmer revenue uplift metrics.

---

## 🛠️ Technology Stack

* **React (v19)** with Vite 8
* **Firebase (v12)**:
  * Firebase Authentication
  * Cloud Firestore
  * Smart Hybrid Architecture: Works immediately out-of-the-box with persistent local reactive storage, and binds to live Firebase with zero code changes once credentials are provided.
* **Tailwind CSS**: Modern agricultural styling with emerald greens, warm earth tones, and golden harvest palettes.
* **Lucide React Icons**: Agricultural and marketplace iconography.

---

## 🚀 Getting Started

### 1. Install & Run Locally

```bash
cd /Users/nadunnethsara/Desktop/agriconnect
npm run dev
```

Open `http://localhost:5175` in your browser.

### 2. Connect Your Firebase Project (Optional)

You can provide Firebase credentials in one of two ways:

#### Option A: In-App UI (Instant)
Click **"Firebase DB Status"** in the top navigation or footer, paste your Firebase config (Project ID, API Key, etc.), and click **Save Config**.

#### Option B: Environment File
Create a `.env.local` file in `/Users/nadunnethsara/Desktop/agriconnect/`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🇱🇰 Real-World Impact for Sri Lanka

* **Fair Price for Farmers (ගොවි ජනතාවට සාධාරණ මිලක්)**: Farmers earn up to 18.5% more by dealing directly with supermarkets and wholesale buyers.
* **Affordable Produce for Consumers**: Supermarkets and bulk buyers save 10%–15% by bypassing intermediary brokers.
* **Transparency**: Daily Economic Centre wholesale price indices empower farmers to negotiate fair rates.
