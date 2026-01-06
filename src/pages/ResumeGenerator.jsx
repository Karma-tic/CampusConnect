import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../firebaseConfig';

const auth = getAuth(app);

// URL 1: For Generating PDF (Existing)
// NOTE: Make sure to deploy functions to get the real URL
const FUNCTION_URL = 'https://generateresumepdf-zpu373bwfa-uc.a.run.app';

// URL 2: For Creating Payment Order
// Replace the old placeholder with this:
const ORDER_URL = 'https://us-central1-campusconnectapp-6bfaf.cloudfunctions.net/createRazorpayOrder';

const ResumeGenerator = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    address: '',
    summary: '',
    education: [{ degree: '', university: '', year: '', cgpa: '' }],
    experience: [{ title: '', company: '', startYear: '', endYear: '', description: '' }],
    projects: [{ name: '', link: '', description: '' }],
    skills: '',
    achievements: [{ description: '', link: '' }],
  });

  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false); // NEW STATE
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (section, index, e) => {
    const { name, value } = e.target;
    const newArray = [...formData[section]];
    newArray[index][name] = value;
    setFormData(prev => ({ ...prev, [section]: newArray }));
  };

  const addArrayItem = (section, newItem) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  const removeArrayItem = (section, index) => {
    const newArray = formData[section].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [section]: newArray }));
  };

  // --- REFACTORED GENERATION FUNCTION ---
  // This can now handle both Free (paymentData = null) and Paid requests
  const generatePdf = async (paymentData = null) => {
    setLoading(true);
    setPdfUrl('');

    try {
      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // UPDATED BODY STRUCTURE to match new Backend
        body: JSON.stringify({ 
          formData: formData, 
          paymentData: paymentData 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const pdfBlob = await response.blob();
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      // --- NEW: AUTO-DOWNLOAD LOGIC ---
      // If this was a paid request, download immediately!
      if (paymentData) {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'CampusConnect_Resume_Pro.pdf'; // Cool filename for premium
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

    } catch (error) {
      console.error("Error generating resume:", error);
      console.log("An error occurred while generating the resume. Please try again."); 
    } finally {
      setLoading(false);
    }
  };

  // Existing Submit Handler (Default Free Version)
  const handleSubmit = async (e) => {
    e.preventDefault();
    await generatePdf(null); // Call with null for free version
  };

  // --- NEW: PREMIUM DOWNLOAD HANDLER ---
  const handlePremiumDownload = async () => {
    setIsPaymentLoading(true);
    try {
        // 1. Create Order
        const orderRes = await fetch(ORDER_URL);
        const order = await orderRes.json();

        if (!order.id) throw new Error("Order creation failed");

        // 2. Open Razorpay
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
            amount: order.amount,
            currency: "INR",
            name: "CampusConnect Premium",
            description: "Resume without Watermark",
            order_id: order.id,
            handler: async function (response) {
                // 3. Payment Success! Regenerate PDF with proof
                await generatePdf({
                    orderId: response.razorpay_order_id,
                    paymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature
                });
            },
            prefill: {
                name: formData.name,
                email: formData.email,
            },
            theme: { color: "#0891b2" } // Cyan color to match your theme
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();

    } catch (error) {
        console.error("Payment Error:", error);
        alert("Payment initialization failed. Please check console.");
    } finally {
        setIsPaymentLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center p-4 justify-center">
        <div className="text-center p-8 rounded-3xl shadow-2xl border border-white/20 bg-white/5 backdrop-blur-sm">
          <h1 className="text-4xl font-extrabold text-red-600">Access Denied</h1>
          <p className="mt-4 text-lg text-gray-300">
            Please sign in to use the resume generator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 w-full">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-2 drop-shadow-lg">
          Resume Generator
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          Craft your professional resume.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl p-6 md:p-8 rounded-3xl shadow-2xl border border-white/20 bg-white/5 backdrop-blur-sm"
      >
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/30 pb-2">
          Resume Details
        </h2>

        {/* --- FORM FIELDS REMAIN EXACTLY THE SAME --- */}
        {/* Personal Details */}
        <h3 className="text-xl font-semibold text-white mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" required />
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone (e.g., +918123456789)" className="p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" />
          <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn Profile URL" className="p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" />
          <input type="text" name="github" value={formData.github} onChange={handleChange} placeholder="GitHub Profile URL" className="p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" />
          <input type="text" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="Portfolio Website URL" className="p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" />
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="City, State, Country (e.g., Bhopal, MP, India)" className="p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" />
        </div>

        {/* Summary */}
        <h3 className="text-xl font-semibold text-white mb-4">Professional Summary</h3>
        <textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="A brief professional summary highlighting your key skills and career goals." className="w-full p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 mb-6" rows="5"></textarea>

        {/* Education */}
        <h3 className="text-xl font-semibold text-white mb-4">Education</h3>
        {formData.education.map((edu, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 items-center">
            <input type="text" name="degree" value={edu.degree} onChange={(e) => handleArrayChange('education', index, e)} placeholder="Degree" className="p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" required />
            <input type="text" name="university" value={edu.university} onChange={(e) => handleArrayChange('education', index, e)} placeholder="University" className="p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" required />
            <input type="text" name="year" value={edu.year} onChange={(e) => handleArrayChange('education', index, e)} placeholder="Year" className="p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" required />
            <input type="text" name="cgpa" value={edu.cgpa} onChange={(e) => handleArrayChange('education', index, e)} placeholder="CGPA" className="p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" />
            <button type="button" onClick={() => removeArrayItem('education', index)} className="bg-red-600 text-white font-semibold py-2 px-3 rounded-full hover:bg-red-700 transition duration-200 shadow-md">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('education', { degree: '', university: '', year: '', cgpa: '' })} className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-full hover:bg-gray-600 transition duration-200 mb-6 shadow-md">Add Education</button>

        {/* Experience */}
        <h3 className="text-xl font-semibold text-white mb-4">Work Experience</h3>
        {formData.experience.map((exp, index) => (
          <div key={index} className="mb-4 p-4 border border-white/20 rounded-lg bg-black/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <input type="text" name="title" value={exp.title} onChange={(e) => handleArrayChange('experience', index, e)} placeholder="Job Title" className="p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" required />
              <input type="text" name="company" value={exp.company} onChange={(e) => handleArrayChange('experience', index, e)} placeholder="Company Name" className="p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" required />
              <input type="text" name="startYear" value={exp.startYear} onChange={(e) => handleArrayChange('experience', index, e)} placeholder="Start Date" className="p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" required />
              <input type="text" name="endYear" value={exp.endYear} onChange={(e) => handleArrayChange('experience', index, e)} placeholder="End Date" className="p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" required />
            </div>
            <textarea name="description" value={exp.description} onChange={(e) => handleArrayChange('experience', index, e)} placeholder="Key responsibilities and achievements (use bullet points, separate with newline)" className="w-full p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 mb-3" rows="4"></textarea>
            <button type="button" onClick={() => removeArrayItem('experience', index)} className="bg-red-600 text-white font-semibold py-2 px-3 rounded-full hover:bg-red-700 transition duration-200 shadow-md">Remove Experience</button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('experience', { title: '', company: '', startYear: '', endYear: '', description: '' })} className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-full hover:bg-gray-600 transition duration-200 mb-6 shadow-md">Add Experience</button>

        {/* Projects */}
        <h3 className="text-xl font-semibold text-white mb-4">Projects</h3>
        {formData.projects.map((proj, index) => (
          <div key={index} className="mb-4 p-4 border border-white/20 rounded-lg bg-black/10">
            <input type="text" name="name" value={proj.name} onChange={(e) => handleArrayChange('projects', index, e)} placeholder="Project Name" className="w-full p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 mb-3" required />
            <input type="text" name="link" value={proj.link} onChange={(e) => handleArrayChange('projects', index, e)} placeholder="Project Link (Optional)" className="w-full p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 mb-3" />
            <textarea name="description" value={proj.description} onChange={(e) => handleArrayChange('projects', index, e)} placeholder="Project description and your role (use bullet points, separate with newline)" className="w-full p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 mb-3" rows="3"></textarea>
            <button type="button" onClick={() => removeArrayItem('projects', index)} className="bg-red-600 text-white font-semibold py-2 px-3 rounded-full hover:bg-red-700 transition duration-200 shadow-md">Remove Project</button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('projects', { name: '', link: '', description: '' })} className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-full hover:bg-gray-600 transition duration-200 mb-6 shadow-md">Add Project</button>

        {/* Skills */}
        <h3 className="text-xl font-semibold text-white mb-4">Skills</h3>
        <textarea name="skills" value={formData.skills} onChange={handleChange} placeholder="List your skills, separated by commas (e.g., JavaScript, React, Node.js, Python)" className="w-full p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 mb-6" rows="3"></textarea>

        {/* Achievements */}
        <h3 className="text-xl font-semibold text-white mb-4">Achievements & Certifications</h3>
        {formData.achievements.map((ach, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
            <input type="text" name="description" value={ach.description} onChange={(e) => handleArrayChange('achievements', index, e)} placeholder="Achievement/Certification" className="p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" required />
            <input type="text" name="link" value={ach.link} onChange={(e) => handleArrayChange('achievements', index, e)} placeholder="Link (Optional)" className="p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500" />
            <button type="button" onClick={() => removeArrayItem('achievements', index)} className="md:col-span-1 bg-red-600 text-white font-semibold py-2 px-3 rounded-full hover:bg-red-700 transition duration-200 shadow-md">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem('achievements', { description: '', link: '' })} className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-full hover:bg-gray-600 transition duration-200 mb-6 shadow-md">Add Achievement</button>

        {/* SUBMIT BUTTON */}
        <div className="mt-6 flex justify-center">
          <button type="submit"
            className="bg-cyan-600 text-white font-bold py-3 px-6 rounded-full shadow-lg
            hover:bg-cyan-700 transition duration-300"
            disabled={loading || !user || isPaymentLoading}>
            {loading ? 'Generating Preview...' : 'Generate Resume'}
          </button>
        </div>

        {/* --- DOWNLOAD SECTION (UPDATED FOR PAYMENT) --- */}
        {pdfUrl && (
          <div className="mt-8 text-center p-6 border-t border-white/20">
            <p className="text-lg font-semibold text-gray-200 mb-4">
              Your resume is ready!
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                {/* 1. FREE DOWNLOAD */}
                <button 
                  onClick={handleDownload}
                  disabled={isPaymentLoading}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 w-full md:w-auto">
                  Download (Watermarked)
                </button>

                {/* 2. PREMIUM DOWNLOAD */}
                <button 
                  type="button" // Important so it doesn't trigger form submit
                  onClick={handlePremiumDownload}
                  disabled={isPaymentLoading}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 flex items-center justify-center gap-2 w-full md:w-auto">
                  {isPaymentLoading ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>Remove Watermark (₹2)</span>
                      <span className="text-xs bg-white text-orange-600 px-2 py-0.5 rounded-full">PRO</span>
                    </>
                  )}
                </button>
            </div>
            
            <p className="mt-4 text-xs text-gray-400">
              * The preview generated above contains a watermark. Pay ₹2 to download a professional clean version.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ResumeGenerator;