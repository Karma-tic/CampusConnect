import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, deleteDoc, addDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const Admin = () => {
    const [pendingServices, setPendingServices] = useState([]);
    const [pendingDocuments, setPendingDocuments] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        const unsubscribeFirestore = onSnapshot(collection(db, 'pendingAcademicMaterials'), (snapshot) => {
            const pendingList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPendingDocuments(pendingList);
        });

        const unsubscribeServices = onSnapshot(collection(db, 'pendingLocalServices'), (snapshot) => {
        const pendingList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPendingServices(pendingList);
    });
        
        return () => {
            unsubscribeAuth();
            unsubscribeFirestore();
            unsubscribeServices();
        };
    }, []);

    const handleApprove = async (docToApprove) => {
        try {
            const { id, ...documentData } = docToApprove;
            // Add the document to the public collection
            await addDoc(collection(db, 'academicMaterials'), {
                ...documentData,
                status: 'approved',
                approvedBy: user.email,
                approvedAt: new Date(),
            });
            // Delete the document from the pending collection
            await deleteDoc(doc(db, 'pendingAcademicMaterials', id));
            console.log("Document approved and moved to public collection.");
        } catch (error) {
            console.error("Error approving document:", error);
        }
    };

    const handleReject = async (docToReject) => {
        try {
            // Delete the document from the pending collection
            await deleteDoc(doc(db, 'pendingAcademicMaterials', docToReject.id));
            console.log("Document rejected and deleted.");
        } catch (error) {
            console.error("Error rejecting document:", error);
        }
    };
    
    const handleApproveService = async (serviceToApprove) => {
        try {
            const { id, ...serviceData } = serviceToApprove;
            await addDoc(collection(db, 'localServices'), {
                ...serviceData,
                status: 'approved',
                approvedBy: user.email,
                approvedAt: new Date(),
            });
            await deleteDoc(doc(db, 'pendingLocalServices', id));
            console.log("Service approved and moved to public collection.");
        } catch (error) {
            console.error("Error approving service:", error);
        }
    };

    const handleRejectService = async (serviceToReject) => {
        try {
            await deleteDoc(doc(db, 'pendingLocalServices', serviceToReject.id));
            console.log("Service rejected and deleted.");
        } catch (error) {
            console.error("Error rejecting service:", error);
        }
    };

    return (
        // Note: The main wrapper in App.jsx applies the floating card/backdrop blur effect.
        // This component only needs to ensure its internal elements contrast well.
        <div className="flex flex-col items-center p-4">
            <header className="w-full max-w-4xl text-center mb-10">
                {/* Header text updated for high contrast and style */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                    Admin Dashboard
                </h1>
                <p className="text-lg md:text-xl text-gray-300">
                    Review and moderate pending submissions.
                </p>
            </header>
            
            {/* Pending Academic Documents Section (Floating Card Style) */}
            <section className="w-full max-w-5xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-2xl mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
                    Pending Academic Documents
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingDocuments.length > 0 ? (
                        pendingDocuments.map(doc => (
                            <div key={doc.id} className="bg-red-900/40 p-5 rounded-xl shadow-lg text-gray-200 border border-red-500/50">
                                <h3 className="text-xl font-semibold text-white mb-1">{doc.fileName}</h3>
                                <p className="text-sm">University ID: <span className="text-cyan-400">{doc.universityId}</span></p>
                                <p className="text-sm">Type: {doc.type}</p>
                                <p className="text-xs mt-2 text-gray-700">Submitted by: {doc.submittedBy || 'N/A'}</p>
                                
                                <div className="mt-4 flex space-x-2">
                                    <button 
                                        onClick={() => handleApprove(doc)} 
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-full text-sm transition"
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleReject(doc)} 
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-full text-sm transition"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-red-700 text-center col-span-full py-6">No pending academic documents to review.</p>
                    )}
                </div>
            </section>
            
            {/* Pending Local Services Section (Floating Card Style) */}
            <section className="w-full max-w-5xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-2xl mt-8">
                <h2 className="text-2xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
                    Pending Local Services
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingServices.length > 0 ? (
                        pendingServices.map(service => (
                            <div key={service.id} className="bg-blue-900/40 p-5 rounded-xl shadow-lg text-gray-200 border border-blue-500/50">
                                <h3 className="text-xl font-semibold text-white mb-1">{service.name}</h3>
                                <p className="text-sm">Category: <span className="text-cyan-400">{service.category}</span></p>
                                <p className="text-sm">Contact: {service.contact}</p>
                                <p className="text-xs mt-2 text-gray-700">Submitted by: {service.submittedBy || 'N/A'}</p>
                                
                                <div className="mt-4 flex space-x-2">
                                    <button 
                                        onClick={() => handleApproveService(service)} 
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-full text-sm transition"
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleRejectService(service)} 
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-full text-sm transition"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-red-700 text-center col-span-full py-6">No pending services to review.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Admin;
