// src/pages/Legit.jsx

import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs/lib/anime.es.js'; 
// We no longer need to import from Firebase

// --- Python API URL (for "Check Company") ---
const API_BASE_URL = "https://legit-api.vercel.app";

// --- Score Badge Component (Unchanged) ---
const ScoreBadge = ({ score }) => {
  let bgColor, textColor, label;
  if (score >= 80) {
    bgColor = "bg-green-700";
    textColor = "text-green-100";
    label = "Verified";
  } else if (score >= 60) {
    bgColor = "bg-yellow-700";
    textColor = "text-yellow-100";
    label = "Caution";
  } else {
    bgColor = "bg-red-700";
    textColor = "text-red-100";
    label = "High Risk";
  }
  return (
    <div className="p-4 bg-gray-900 border border-gray-700 rounded-md">
      <h3 className="text-lg text-gray-400 mb-2">Overall Score</h3>
      <div className="flex items-center justify-center space-x-4">
        <span className={`text-5xl font-bold ${textColor}`}>{score}</span>
        <span className={`px-4 py-1 text-lg font-semibold rounded-full ${bgColor} ${textColor}`}>
          {label}
        </span>
      </div>
    </div>
  );
};

export default function Legit() {
  const animationWrapper = useRef(null); 
  const pageRef = useRef(null); 

  // --- State for "Check Company" (ONLY this state remains) ---
  const [companyName, setCompanyName] = useState("");
  const [companyReport, setCompanyReport] = useState(null);
  const [isCompanyLoading, setIsCompanyLoading] = useState(false);
  const [companyError, setCompanyError] = useState(null);
  
  // --- Animation useEffect (Unchanged) ---
  useEffect(() => {
    if (!animationWrapper.current || !pageRef.current) return;
    if (!anime) { console.error("Anime.js function not loaded!"); return; }
    const page = pageRef.current;
    anime({ targets: '#legit-logo', scale: [1, 1.05], direction: 'alternate', loop: true, duration: 2000, easing: 'easeInOutSine' });
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      const maxTilt = 15; 
      anime({ targets: animationWrapper.current, rotateX: -y * maxTilt, rotateY: x * maxTilt, duration: 500, easing: 'easeOutQuint' });
    };
    page.addEventListener('mousemove', handleMouseMove);
    return () => page.removeEventListener('mousemove', handleMouseMove);
  }, []); 

  // --- "Check Company" Function (Unchanged) ---
  const handleCompanyCheck = async () => {
    if (companyName.length < 2) {
      setCompanyError("Please enter a company name.");
      setCompanyReport(null);
      return;
    }
    setIsCompanyLoading(true);
    setCompanyError(null);
    setCompanyReport(null); 
    try {
      const query = new URLSearchParams({ name: companyName });
      const response = await fetch(`${API_BASE_URL}/check-company?${query}`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setCompanyReport(data); 
    } catch (err) {
      console.error("Error fetching from API:", err);
      setCompanyError(err.message || "An unknown error occurred.");
    }
    setIsCompanyLoading(false);
  };

  return (
    <div 
      ref={pageRef}
      className="flex flex-col items-center min-h-screen bg-black text-white p-4 md:p-8 overflow-hidden"
      style={{ perspective: '1000px' }} 
    >
      <div className="text-center max-w-xl w-full mt-16">
        
        {/* --- (Animation & Header - Unchanged) --- */}
        <div ref={animationWrapper} className="relative w-48 h-48 mx-auto mb-10 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          <img id="legit-logo" src="/legit4.png" alt="Legit Logo" className="w-32 h-32 relative z-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Check if it's <span className="text-orange-500">Legit</span></h1>
        <p className="text-lg md:text-xl text-gray-300 mb-12">Verify your company, internship, or job offer in seconds.</p>


        {/* --- Main Content Area (ONLY Company Check remains) --- */}
        <div className="space-y-12">
          
          {/* --- Company Search --- */}
          <div>
            <label htmlFor="company-search" className="block text-xl font-semibold mb-3 text-orange-500">
              Check a Company
            </label>
            <div className="flex max-w-lg mx-auto shadow-lg">
              <input
                type="text"
                id="company-search"
                placeholder="Enter company name or website..."
                className="w-full p-4 bg-gray-900 border border-gray-700 text-white rounded-l-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={isCompanyLoading}
              />
              <button 
                className="p-4 bg-orange-500 text-black font-bold rounded-r-md hover:bg-orange-600 transition-colors flex-shrink-0 disabled:opacity-50"
                onClick={handleCompanyCheck}
                disabled={isCompanyLoading}
              >
                {isCompanyLoading ? "..." : "Check"}
              </button>
            </div>

            {/* --- Company Results Area --- */}
            <div className="max-w-lg mx-auto text-left mt-4 space-y-4">
              {companyError && (
                <div className="p-4 bg-red-800 border border-red-600 rounded-md">
                  <p className="font-bold">Error: {companyError}</p>
                </div>
              )}
              {companyReport && (
                <>
                  <ScoreBadge score={companyReport.score} />
                  <div className="p-4 bg-gray-900 border border-gray-700 rounded-md space-y-4">
                    <h3 className="text-2xl font-bold text-orange-500 mb-2">
                      Key Findings
                    </h3>
                    {companyReport.findings.length === 0 ? (
                      <p>No specific red or green flags found in the top results.</p>
                    ) : (
                      companyReport.findings.map((finding, index) => (
                        <div key={index} className="border-b border-gray-700 pb-2">
                          <span 
                            className={`font-bold ${
                              finding.type === 'red_flag' ? 'text-red-500' : 'text-green-500'
                            }`}
                          >
                            {finding.type === 'red_flag' ? '🔴 RED FLAG' : '🟢 GREEN FLAG'} (Keyword: "{finding.keyword}")
                          </span>
                          <p className="text-gray-300 text-sm my-1">"{finding.snippet}"</p>
                          <a 
                            href={finding.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:underline truncate"
                          >
                            {finding.link}
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* --- The "Analyze Offer" section is now GONE --- */}

        </div>
      </div>
    </div>
  );
}