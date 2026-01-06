# 🎓 CampusConnect - Student Ecosystem

![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-MERN%20%2B%20Firebase-blue?style=for-the-badge)
![Payment](https://img.shields.io/badge/Payment-Razorpay-orange?style=for-the-badge)

> **A comprehensive platform empowering university students with academic resources, AI-driven career guidance, and professional tools.**

---

## 🚀 Live Demo
**[🌐 Click Here to Visit CampusConnect](https://campusconnect.studio)**

---

## 🌟 Key Features

### 📄 Professional Resume Generator (Freemium Model)
* **Dynamic PDF Creation:** Generates ATS-friendly PDFs on the fly using **Node.js Streams** & `PDFKit`.
* **Freemium Architecture:** * **Free Tier:** Downloads resume with a "CampusConnect" watermark.
    * **Premium Tier:** Integrated **Razorpay Payment Gateway** (₹49) to unlock watermark-free downloads.
* **Security:** Backend verification of payment signatures (SHA256 HMAC) to prevent frontend tampering.

### 🤖 KarmAI - AI Career Counselor
* **Powered by Google Gemini:** An advanced AI agent that analyzes student profiles (Skills, Goals, Education).
* **Actionable Plans:** Generates a structured **3-Step 12-Month Action Plan** for career growth.
* **Secure & Scalable:** Uses Firebase Callable Functions to handle API keys securely on the server side.

### 📚 Academic Hub
* **Resource Sharing:** Students can access notes, papers, and books tailored to their university.
* **Real-time Updates:** Powered by **Firestore Real-time Listeners** for instant data fetching without page reloads.

---

## 🛠️ Tech Stack & Architecture

### **Frontend (Client-Side)**
* **React.js (Vite):** Chosen for lightning-fast HMR and bundling.
* **Tailwind CSS:** For a modern, responsive, and glassmorphism-inspired UI.
* **React Context API:** Manages global state for Authentication (`AuthContext`).
* **React Hooks:** extensive use of `useState`, `useEffect` (data fetching), and Custom Hooks.

### **Backend (Serverless)**
* **Firebase Cloud Functions (Node.js):**
    * Acts as the **Express.js** equivalent, handling API requests.
    * **Why Serverless?** Auto-scaling architecture that charges only for usage (Cost-Optimized).
* **Razorpay API:** Handles secure payment orders and verification.
* **PDFKit:** Server-side PDF generation engine.

### **Database & Auth**
* **Cloud Firestore (NoSQL):** Flexible schema design to handle dynamic user data.
* **Firebase Authentication:** Secure email/password login and session management.

---

## 💡 Under the Hood: Technical Highlights

### 1. Payment Security (Razorpay Integration)
We don't trust the client. The "Remove Watermark" feature uses a **Double-Verification System**:
1.  **Frontend:** Initiates payment via Razorpay SDK.
2.  **Backend:** The client sends the `paymentId` and `signature` to the Node.js server.
3.  **Verification:** The server regenerates the HMAC SHA256 signature using the secret key.
    * *Match?* → Render Clean PDF.
    * *No Match?* → Force Watermark.

### 2. Performance Optimization
* **Streaming Responses:** The Resume Generator streams binary data directly to the client, preventing server memory overflows during high traffic.
* **Lazy Loading:** React components are lazy-loaded to reduce the initial bundle size (`Suspense`).
* **V2 Cloud Functions:** Updated to Gen 2 for better concurrency and lower cold starts.

---

## 📂 Project Structure

```bash
CampusConnect/
├── public/              # Static assets (Logos, Robots.txt)
├── src/
│   ├── components/      # Reusable UI (Navbar, Footer, Cards)
│   ├── context/         # AuthContext (Global State)
│   ├── pages/           # Route Pages (ResumeGenerator, KarmAI)
│   ├── firebaseConfig.js# Firebase SDK Init
│   └── main.jsx         # Entry Point
├── functions/           # Backend Code (The "Server")
│   ├── index.js         # Main Server Logic (API Endpoints)
│   └── .env             # Backend Secrets (Razorpay Keys)
├── dist/                # Production Build
└── firebase.json        # Hosting & Rewrites Config



🔧 Installation & Local Setup
Want to run this locally? Follow these steps:

1. Clone the Repository
Bash

git clone [https://github.com/Karma-tic/CampusConnect.git](https://github.com/Karma-tic/CampusConnect.git)
cd CampusConnect
2. Install Dependencies
Frontend:

Bash

npm install
Backend:

Bash

cd functions
npm install
3. Environment Variables
Create a .env file in the root directory:

Code snippet

VITE_FIREBASE_API_KEY=your_firebase_key
VITE_RAZORPAY_KEY_ID=your_razorpay_test_key_id
Create a .env file in the functions directory:

Code snippet

RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
GEMINI_API_KEY=your_gemini_api_key
4. Run Locally
Bash

# Terminal 1 (Frontend)
npm run dev

# Terminal 2 (Backend Emulation - Optional)
firebase emulators:start
🛡️ Security Measures
Environment Variables: All API keys and secrets are stored in .env files (not committed to Git).

Firestore Rules: Strict database rules ensure users can only modify their own data.

HTTPS: All data transmission occurs over secure SSL connections.

📬 Contact
Developer: Sujeet P Singh aka Karmatix

Location: Bhopal, India

LinkedIn: sujeetkarmatix

⭐ Star this repo if you find it useful!
