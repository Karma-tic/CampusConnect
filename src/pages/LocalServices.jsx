import React, { useState, useEffect } from 'react';
import { db, app } from '../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';

const auth = getAuth(app);

const LocalServices = () => {
    const [user, setUser] = useState(null);
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchMessage, setSearchMessage] = useState('Select an area to see available services.');
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [newService, setNewService] = useState({
        name: '',
        contact: '',
        address: '',
        area: '',
        category: '',
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        const fetchAreas = async () => {
            try {
                const q = collection(db, 'areas');
                const querySnapshot = await getDocs(q);
                setAreas(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching areas:", error);
            }
        };

        fetchAreas();
        return () => unsubscribe();
    }, []);

    const searchServices = async () => {
        if (!selectedArea) {
            setSearchMessage('Please select an area.');
            return;
        }

        setLoading(true);
        setServices([]);
        setSearchMessage('');

        try {
            const q = query(collection(db, 'localServices'), where('area', '==', selectedArea));
            const querySnapshot = await getDocs(q);
            const serviceList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (serviceList.length === 0) {
                setSearchMessage('No services found for this area.');
            }
            setServices(serviceList);
        } catch (error) {
            console.error("Error searching services:", error);
            setSearchMessage('An error occurred while searching.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleSubmitNewService = async (e) => {
        e.preventDefault();
        setSubmitMessage('');
        
        if (!user) {
            setSubmitMessage('You must be signed in to submit a service.');
            return;
        }

        try {
            const newServiceData = {
                ...newService,
                submittedBy: user.email,
                submittedAt: new Date(),
                status: 'pending',
            };
            
            await addDoc(collection(db, 'pendingLocalServices'), newServiceData);
            setSubmitMessage('Service submitted successfully for review!');
            setNewService({ name: '', contact: '', address: '', area: '', category: '' }); // Reset form
            setIsSubmitModalOpen(false);
        } catch (error) {
            console.error("Error submitting new service:", error);
            setSubmitMessage('An error occurred while submitting the service.');
        }
    };

    return (
        // Removed min-h-screen and background color so the main app gradient shows through
        <div className="flex flex-col items-center p-4 w-full"> 
            
            {/* Header: High contrast white text, vibrant gradient title */}
            <header className="w-full max-w-4xl text-center mb-8">
                {/* Title uses the same white color as the Home page for prominence */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-md">
                    Local Living Essentials
                </h1>
                {/* Subtitle uses light gray for high contrast */}
                <p className="text-lg md:text-xl text-gray-200 drop-shadow-sm">
                    Find everything you need for easy living in your area.
                </p>
                {user && (
                    <button 
                        onClick={() => setIsSubmitModalOpen(true)} 
                        // Submit button uses the primary accent color (cyan) for visibility
                        className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 transform hover:scale-[1.01]"
                    >
                        Submit a Service
                    </button>
                )}
            </header>
            
            {/* Search Section: Floating Card Style */}
            <section className="w-full max-w-4xl bg-white/5 p-6 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-md mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Search Services by Area</h2>
                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    {/* Select Input: Styled for dark background/high contrast */}
                    <select 
                        className="block w-full md:w-1/2 lg:w-1/3 p-3 md:p-4 border border-white/30 rounded-lg shadow-sm text-gray-200 bg-black/30 backdrop-blur-sm focus:ring-cyan-400 focus:border-cyan-400"
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                    >
                        <option value="" className="bg-gray-800 text-white">Select your area...</option>
                        {areas.map(area => (
                            <option key={area.id} value={area.name} className="bg-gray-800 text-white">{area.name}</option>
                        ))}
                    </select>
                    {/* Search Button: Uses a vibrant green accent for "find" actions */}
                    <button 
                        onClick={searchServices}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-[1.01]">
                        {loading ? 'Searching...' : 'Search Services'}
                    </button>
                </div>
            </section>
            
            {/* Results Section: Floating Card Style */}
            <section className="w-full max-w-4xl bg-white/5 p-6 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-md">
                <h2 className="text-xl font-semibold text-white mb-4">Available Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="text-gray-300 text-center col-span-full">Loading...</p>
                    ) : services.length > 0 ? (
                        services.map(service => (
                            <a 
                                key={service.id} 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.address)}`}
                                target="_blank" 
                                rel="noopener noreferrer" 
                                // Result Tile: Light semi-transparent card for readability
                                className="block p-4 rounded-xl shadow-lg bg-white/10 text-white hover:bg-white/20 transition-colors duration-200 cursor-pointer border border-white/10"
                            >
                                <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                                <p className="text-sm text-gray-300">Category: {service.category}</p>
                                <p className="text-sm text-gray-300">Contact: {service.contact}</p>
                                {/* Link color changed to accent cyan */}
                                <p className="text-sm mt-2 text-cyan-400 hover:text-cyan-300 font-medium">View on Map</p>
                            </a>
                        ))
                    ) : (
                        <p className="text-gray-300 text-center col-span-full">{searchMessage}</p>
                    )}
                </div>
            </section>

            {/* Submission Modal: Styled to match the dark/floating theme */}
            {isSubmitModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
                    <div className="relative p-8 bg-black/70 w-full max-w-md rounded-xl shadow-2xl border border-cyan-400/50 backdrop-blur-lg">
                        <h3 className="text-2xl font-bold mb-4 text-white">Submit a New Service</h3>
                        <form onSubmit={handleSubmitNewService}>
                            
                            {/* Input fields styled for dark mode */}
                            <div className="mb-4">
                                <input type="text" placeholder="Service Name" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} 
                                    className="w-full p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-400 focus:border-cyan-400" required />
                            </div>
                            <div className="mb-4">
                                <input type="text" placeholder="Contact Number" value={newService.contact} onChange={e => setNewService({...newService, contact: e.target.value})} 
                                    className="w-full p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-400 focus:border-cyan-400" required />
                            </div>
                            <div className="mb-4">
                                <input type="text" placeholder="Address" value={newService.address} onChange={e => setNewService({...newService, address: e.target.value})} 
                                    className="w-full p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-400 focus:border-cyan-400" required />
                            </div>
                            <div className="mb-4">
                                <input type="text" placeholder="Category (e.g., Water Supplier)" value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})} 
                                    className="w-full p-3 border border-white/30 rounded-lg bg-black/30 text-white placeholder-gray-400 focus:ring-cyan-400 focus:border-cyan-400" required />
                            </div>
                            <div className="mb-4">
                                <select 
                                    className="w-full p-3 border border-white/30 rounded-lg bg-black/30 text-white focus:ring-cyan-400 focus:border-cyan-400" 
                                    value={newService.area} onChange={e => setNewService({...newService, area: e.target.value})} required
                                >
                                    <option value="" className="bg-gray-800 text-white">Select Area...</option>
                                    {areas.map(area => <option key={area.id} value={area.name} className="bg-gray-800 text-white">{area.name}</option>)}
                                </select>
                            </div>

                            {submitMessage && <p className="text-sm mb-4 text-center text-cyan-300">{submitMessage}</p>}
                            
                            <div className="flex justify-end space-x-2 mt-6">
                                {/* Cancel button styled for contrast */}
                                <button type="button" onClick={() => setIsSubmitModalOpen(false)} 
                                    className="bg-gray-600 text-white py-2 px-4 rounded-full hover:bg-gray-700 transition duration-300">
                                    Cancel
                                </button>
                                {/* Submit button styled with primary accent */}
                                <button type="submit" 
                                    className="bg-cyan-600 text-white py-2 px-4 rounded-full hover:bg-cyan-700 transition duration-300">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocalServices;
