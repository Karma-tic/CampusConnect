import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Academics from './pages/Academics';
import Auth from './pages/Auth';
import Upload from './pages/Upload';
import LocalServices from './pages/LocalServices';
import Admin from './pages/Admin';
import ResumeGenerator from './pages/ResumeGenerator';
import Legit from './pages/Legit';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from './firebaseConfig';
import { getFirestore } from "firebase/firestore";
import KarmAI from './pages/KarmAI';
import Lottie from 'lottie-react'; 
//lottie files
import AcademicAnimation from './lottie/academic.json';
import EssentialAnimation from './lottie/essential.json';
import ResumeAnimation from './lottie/resume.json';
import KarmAIAnimation from './lottie/karm_ai.json';
import LegitAnimation from './lottie/legit.json';
import LoadingAnimation from './lottie/Loading.json';

const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

const ADMIN_EMAIL = 'karmatix@proton.me'; 

const NavLink = ({ to, children, isButton = false, onClick }) => (
    <Link 
        to={to} 
        onClick={onClick} 
        className={`text-sm md:text-base font-semibold transition-colors duration-200 flex-shrink-0 px-3 py-1 rounded-md
                    ${isButton 
                        ? 'text-cc-text-light bg-cc-primary hover:bg-cc-primary/80 shadow-lg' // Primary Orange Button
                        : 'text-cc-text-light hover:text-cc-primary' // White text, Orange hover
                    }
                    flex items-center justify-center whitespace-nowrap`}
    >
        {children}
    </Link>
);


// --- HOME PAGE COMPONENT ---
   const Home = () => {
    const services = [
        // Changed 'icon' to 'animation' and removed 'color'
        { title: "Academic Resources", animation: AcademicAnimation, desc: "Notes, papers, and assignments.", link: "/academics" },
        { title: "Essential Needs", animation: EssentialAnimation, desc: "Food, water, and local services.", link: "/local-services" },
        { title: "Resume Generator", animation: ResumeAnimation, desc: "Professional PDF resume generation.", link: "/resume-generator" },
        { title: "KarmAI", animation: KarmAIAnimation, desc: "AI-powered career prediction and path.", link: "/karm-ai" },
        { title: "Legit", animation: LegitAnimation, desc: "Verify your company in seconds.", link: "/legit" },
        
        // Duplicated for the scrolling effect
        ...[1, 2].map(i => ({ title: `Service ${i}`, animation: LoadingAnimation, desc: "Extra feature placeholder.", link: "#" }))
    ];

    const events = [
        { date: "WED, 10-12 DEC", title: "70th ISTAM Conference", location: "VIT Bhopal", cta: "RSVP" },
        { date: "WED, 10-12 DEC", title: "Navotkarsh 2025", location: "NITTTR Bhopal", cta: "RSVP" },
        { date: "MON, 08-12 DEC", title: "Aarohan youth Fest 2025", location: "IHM-Bhopal", cta: "RSVP" },
    ];

    return (
        <div className="flex flex-col items-center w-full">

            {/* 1. HERO SECTION (Black Background) */}
            <section className="w-full bg-cc-secondary py-20 md:py-32 px-4 border-b border-cc-primary/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
                    {/* Text and CTA Block */}
                    <div className="md:w-1/2 mb-10 md:mb-0">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-cc-text-light mb-4">
                            Future Ready <span className="text-cc-primary">Now</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-lg mb-8">
                            Explore valuable resources tailored specifically for students to excel academically and plan your future steps with ease.
                        </p>
                       <a 
    href="/auth" 
    className="inline-block px-6 py-3 text-base font-bold rounded-lg text-cc-text-light bg-cc-primary hover:bg-cc-primary/80 transition duration-300 shadow-xl
               md:px-10 md:py-4 md:text-lg"
>
                            Get Started
                        </a>
                    </div>
                    {/* Image Placeholder (replace with actual image later) */}
                    <div className="md:w-1/2 flex justify-center w-full md:w-auto mx-auto">
    {/* Ensure your image is named 'hero_image.jpg' and is in your 'public' folder */}
    <img 
        src="/hero.png" 
        alt="Student connecting with CampusConnect resources"
        // Applying the responsive styling previously used on the placeholder
        className="w-full max-w-sm md:max-w-md h-48 md:h-72 object-cover rounded-xl shadow-2xl transition duration-300 hover:shadow-cc-primary/50" 
    />
</div>
                </div>
            </section>

            {/* 2. SERVICES SCROLL (Marquee/Carousel Section - Darker Background) */}
            <section className="w-full py-16 bg-black-900 border-b border-cc-primary/30">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-cc-text-light mb-8 border-b border-cc-primary w-fit pb-2">Our Core Services</h2>
                </div>
                
                {/* Marquee Container */}
                <div className="overflow-hidden whitespace-nowrap">
                <div className="animate-marquee-mobile md:animate-marquee-desktop hover:paused inline-block">
                        {/* Duplicate the list items to create the continuous scroll effect */}
                        {[...services, ...services].map((service, index) => (
                            <Link 
                                to={service.link}
                                key={index} 
                                className="inline-block mx-4 w-72 h-40 p-5 rounded-xl bg-cc-secondary shadow-xl hover:shadow-cc-primary/50 transition-shadow duration-300 transform border-2 border-cc-primary/30 flex-shrink-0"
                            >
                                {/* Use the Lottie component here */}
    <div className="w-16 h-16 mx-auto mb-2">
        <Lottie animationData={service.animation} loop={true} />
    </div>
    <h3 className="text-lg font-bold text-cc-text-light">{service.title}</h3>
    <p className="text-sm text-gray-400">{service.desc}</p>
</Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. ABOUT US (Who We Are / Mission - Off-White Background) */}
            <section className="w-full bg-cc-offwhite py-20 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-cc-text-dark">
                    <div>
                        <h2 className="text-4xl font-bold mb-4 text-cc-primary">Who We Are</h2>
                        <p className="text-lg leading-relaxed">
                            At CampusConnect, we provide an array of tailored resources focusing on enhancing academic performance and future planning. From essential documents to a resume generator and an AI bot, our mission is to support students in their unique journeys.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold mb-4 text-cc-primary">Our Mission</h2>
                        <p className="text-lg leading-relaxed">
                            To bridge the gap between student aspirations and university resources by offering reliable, intuitive, and modern tools necessary for success in a competitive academic landscape.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. UPCOMING EVENTS (Dark Background) */}
            <section className="w-full bg-cc-secondary py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-5xl font-extrabold text-cc-text-light mb-12 text-center">Upcoming <span className="text-cc-primary">Events</span></h2>
                    
                    <div className="space-y-6">
                        {events.map((event, index) => (
                            <div key={index} className="flex flex-col sm:flex-row justify-between items-center p-6 border-b border-cc-primary/50 last:border-b-0">
                                
                                <div className="text-center sm:text-left mb-4 sm:mb-0">
                                    <p className="text-sm font-light text-cc-primary">{event.date}</p>
                                    <h3 className="text-xl font-semibold text-cc-text-light">{event.title}</h3>
                                    <p className="text-md text-gray-400">{event.location}</p>
                                </div>

                                <button className="px-6 py-2 bg-cc-primary text-cc-text-light font-medium rounded-lg hover:bg-cc-primary/80 transition duration-300 shadow-md whitespace-nowrap">
                                    {event.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. GALLERY SECTION (Dark Background) */}
            <section className="w-full bg-gray-900 py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-extrabold text-cc-text-light mb-12 text-center border-b border-cc-primary w-fit mx-auto pb-2">Gallery</h2>
                    
                   
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {/* Map over actual image file names or simply list the images */}
    {['uit.jpg', 'jlu.jpeg', 'manit3.jpg', 'LNCT.jpg'].map((imageName, index) => (
        <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-lg hover:opacity-80 transition duration-300">
            <img 
                src={`/${imageName}`} 
                alt={`Campus gallery image ${index + 1}`}
                // Classes ensure the image fills the container without distortion
                className="w-full h-full object-cover" 
            />
        </div>
    ))}
</div>
                </div>
            </section>

            {/* 6. CONTACT US / FOOTER (Handled by the Main App Component) */}
        </div>
    );
};

// --- REDESIGNED FOOTER COMPONENT ---
const Footer = () => {
    return (
        // Black background, white text, orange accents
        <footer className="w-full bg-cc-secondary text-cc-text-light text-center py-10 px-4 mt-auto border-t-4 border-cc-primary/70">
            <div className="max-w-5xl mx-auto">
                {/* Contact Info (Placeholder) */}
                <div className="mb-6 space-y-1 text-sm md:text-md">
                    <p>+91 (626) 148-6462</p>
                    <p>contact@karmatix.in</p>
                    <p>Mahatma Gandhi Square, Barkheda Bhopal, Madhya Pradesh, India</p>
                </div>

                {/* Social Icons (Placeholder) */}
               
{/* Social Icons (Actual Links) */}
<div className="flex justify-center space-x-6 mb-8">
    
    {/* LinkedIn */}
    <a href="https://linkedin.com/in/sujeet-singh-9a0a4116b" target="_blank" className="text-cc-primary hover:text-cc-text-light transition duration-200 group">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-cc-primary/20 group-hover:bg-cc-primary transition-colors duration-200 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:text-cc-secondary transition-colors duration-200"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
        </div>
    </a>
    
    {/* Instagram */}
    <a href="https://instagram.com/karmatix.in" target="_blank" className="text-cc-primary hover:text-cc-text-light transition duration-200 group">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-cc-primary/20 group-hover:bg-cc-primary transition-colors duration-200 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:text-cc-secondary transition-colors duration-200"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.5" y1="6.5" y2="6.5"/></svg>
        </div>
    </a>
    
    {/* Gumroad/G (Placeholder for the circular icon with 'G') */}
    <a href="https://karmatix.gumroad.com/subscribe" target="_blank" className="text-cc-primary hover:text-cc-primary transition duration-200 group">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-cc-primary/20 group-hover:bg-cc-primary transition-colors duration-200">
             {/* Note: I adjusted the SVG to match the style of the others: Orange background, Black text on hover */}
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" className="w-6 h-6">
                <circle cx="12" cy="12" r="10" fill="currentColor" className="text-cc-primary group-hover:text-cc-primary"/>
                <text x="12" y="15.5" textAnchor="middle" fontSize="10" fill="#121212" fontFamily="Inter" className="font-bold">G</text>
            </svg>
        </div>
    </a>
</div>

                {/* Policy Links */}
                <div className="flex flex-wrap justify-center space-x-4 mb-4 text-sm md:text-md">
                    <Link to="/about" className="hover:text-cc-primary transition-colors duration-200">About Us</Link>
                    <Link to="/contact" className="hover:text-cc-primary transition-colors duration-200">Contact</Link>
                    <Link to="/privacy" className="hover:text-cc-primary transition-colors duration-200">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-cc-primary transition-colors duration-200">Terms & Conditions</Link>
                </div>
                
                <p className="text-sm md:text-md mb-2 text-gray-500">
                    &copy; {new Date().getFullYear()} CampusConnect. All rights reserved.
                </p>
                <p className="text-xs text-cc-primary">
                    CampusConnect is a Karmatix product.
                </p>
            </div>
        </footer>
    );
};


// --- MAIN APP COMPONENT (Logic Preserved) ---
const App = () => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser && currentUser.email === ADMIN_EMAIL) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        // Root container is now a full black background
        <div className="min-h-screen flex flex-col bg-cc-secondary font-sans">
            
            {/* --- REDESIGNED NAVIGATION BAR (Header) --- */}
            <nav className="w-full px-4 py-3 bg-cc-secondary/95 backdrop-blur-sm shadow-xl flex items-center overflow-x-auto whitespace-nowrap sticky top-0 z-50 border-b-2 border-cc-primary/50">
                
                {/* Branding - Left Side */}
                <Link to="/" className="text-xl md:text-2xl font-extrabold text-cc-text-light tracking-wider flex-shrink-0 mr-6">
                    Campus<span className="text-cc-primary">Connect</span>
                </Link>

                {/* Main Links Container */}
                <div className="flex space-x-2 md:space-x-4 max-w-5xl w-full">
                    <div className="flex space-x-2 md:space-x-4 items-center">
                        <NavLink to="/academics">Academic</NavLink>
                        <NavLink to="/local-services">Essential</NavLink>
                        <NavLink to="/resume-generator">Resume</NavLink>
                        <NavLink to="/legit">Legit</NavLink>
                        <NavLink to="/karm-ai">KarmAI</NavLink> 
                    </div>

                    {/* Spacer and Auth Links Container */}
                    <div className="flex-grow"></div> 
                    <div className="flex space-x-3 ml-auto items-center"> 
                        {isAdmin && (
                            <NavLink to="/admin">Admin</NavLink>
                        )}
                        {user ? (
                            <>
                                <NavLink to="/upload">Upload</NavLink>
                                <button 
                                    onClick={handleSignOut} 
                                    className="text-sm md:text-base text-gray-400 hover:text-cc-primary font-semibold transition-colors duration-200 flex-shrink-0 px-3 py-1 rounded-md"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            // Primary Sign In Button
                            <NavLink to="/auth" isButton={true}>Sign In / Sign Up</NavLink>
                        )}
                    </div>
                </div>
            </nav>
            
            {/* Main Content Area - Routes outside the old floating card wrapper */}
            <main className="flex-grow w-full">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/academics" element={<Academics />} />
                    <Route path="/local-services" element={<LocalServices />} />
                    {/* Error message text color adjusted for better contrast on dark background */}
                    <Route path="/admin" element={isAdmin ? <Admin /> : <h1 className="text-3xl font-bold text-cc-primary text-center py-10">Access Denied</h1>} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/upload" element={user ? <Upload /> : <h1 className="text-3xl font-bold text-cc-primary text-center py-10">Please Sign In</h1>} />
                    <Route path="/resume-generator" element={<ResumeGenerator />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/karm-ai" element={<KarmAI />} />
                    <Route path="/legit" element={<Legit />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export default App;

