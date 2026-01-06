import React, { useState, useEffect } from 'react';
import { db, app } from '../firebaseConfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const auth = getAuth(app);
const storage = getStorage(app);

const Upload = () => {
    const [user, setUser] = useState(null);
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedDocumentType, setSelectedDocumentType] = useState('');

    const [universities, setUniversities] = useState([]);
    const [courses, setCourses] = useState([]);
    const [branches, setBranches] = useState([]);
    const [years, setYears] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    // Fetches all filter options
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                navigate('/auth'); // Redirect to auth page if not logged in
            }
        });

        const fetchFilters = async () => {
            try {
                const [
                    universitiesSnapshot,
                    yearsSnapshot,
                    documentTypesSnapshot
                ] = await Promise.all([
                    getDocs(collection(db, 'universities')),
                    getDocs(collection(db, 'years')),
                    getDocs(collection(db, 'documentTypes'))
                ]);

                setUniversities(universitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setYears(yearsSnapshot.docs.map(doc => doc.data().name));
                setDocumentTypes(documentTypesSnapshot.docs.map(doc => doc.data().name));
            } catch (error) {
                console.error("Error fetching filters:", error);
            }
        };

        fetchFilters();
        return () => unsubscribe();
    }, [navigate]);

    // Fetches courses based on selected university
    useEffect(() => {
        const fetchCourses = async () => {
            if (selectedUniversity) {
                const q = query(collection(db, 'courses'), where('universityId', '==', selectedUniversity));
                const querySnapshot = await getDocs(q);
                setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setSelectedCourse('');
            } else {
                setCourses([]);
            }
        };
        fetchCourses();
    }, [selectedUniversity]);

    // Fetches branches based on selected course and university
    useEffect(() => {
        const fetchBranches = async () => {
            if (selectedCourse) {
                const q = query(collection(db, 'branches'), where('courseId', '==', selectedCourse));
                const querySnapshot = await getDocs(q);
                const branchList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(branch => branch.name);
                setBranches(branchList);
                setSelectedBranch('');
            } else {
                setBranches([]);
            }
        };
        fetchBranches();
    }, [selectedCourse]);

    const handleFileUpload = async () => {
        if (!file || !selectedUniversity || !selectedCourse || !selectedBranch || !selectedYear || !selectedDocumentType) {
            setMessage('Please select a file and fill all dropdowns.');
            return;
        }

        if (!user) {
            setMessage('You must be logged in to upload files.');
            return;
        }
        
        setUploading(true);
        setMessage('');

        try {
            // Step 1: Upload the file to Firebase Storage
            const storageRef = ref(storage, `academic_materials/${user.uid}/${file.name}`);
            await uploadBytes(storageRef, file);
            const fileURL = await getDownloadURL(storageRef);

           // This is inside the handleFileUpload function
await addDoc(collection(db, 'pendingAcademicMaterials'), { // <-- NEW PENDING COLLECTION
    universityId: selectedUniversity,
    courseId: selectedCourse,
    branch: selectedBranch,
    year: selectedYear,
    type: selectedDocumentType,
    fileURL: fileURL,
    fileName: file.name,
    submittedBy: user.email,
    submittedAt: new Date()
});

            setMessage('Document uploaded successfully!');
            setUploading(false);
            setFile(null); // Clear the file input
            // Clear dropdowns for new upload
            setSelectedUniversity('');
            setSelectedCourse('');
            setSelectedBranch('');
            setSelectedYear('');
            setSelectedDocumentType('');

        } catch (error) {
            console.error("Error uploading document:", error);
            setMessage('Upload failed. Please try again.');
            setUploading(false);
        }
    };

    return (
        // Removed min-h-screen and background color so the main app gradient shows through
        <div className="flex flex-col items-center p-4 w-full"> 
            
            {/* Header: High contrast white text */}
            <header className="w-full max-w-4xl text-center mb-8">
                <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-md">Upload Document</h1>
                <p className="text-lg text-gray-200 drop-shadow-sm">Share academic resources with the community.</p>
            </header>
            
            {/* Main Content Card: Floating Card Style */}
            <div className="w-full max-w-4xl bg-white/5 p-6 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    
                    {/* Select Inputs: Styled for dark background/high contrast */}
                    <select onChange={(e) => setSelectedUniversity(e.target.value)} value={selectedUniversity} 
                        className="p-3 border border-white/30 rounded-lg shadow-sm text-gray-200 bg-black/30 backdrop-blur-sm focus:ring-cyan-400 focus:border-cyan-400"
                    >
                        <option value="" className="bg-gray-800 text-white">Select University...</option>
                        {universities.map(uni => <option key={uni.id} value={uni.id} className="bg-gray-800 text-white">{uni.name}</option>)}
                    </select>

                    <select onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse} 
                        className="p-3 border border-white/30 rounded-lg shadow-sm text-gray-200 bg-black/30 backdrop-blur-sm focus:ring-cyan-400 focus:border-cyan-400" 
                        disabled={!selectedUniversity}
                    >
                        <option value="" className="bg-gray-800 text-white">Select Course...</option>
                        {courses.map(course => <option key={course.id} value={course.id} className="bg-gray-800 text-white">{course.name}</option>)}
                    </select>

                    <select onChange={(e) => setSelectedBranch(e.target.value)} value={selectedBranch} 
                        className="p-3 border border-white/30 rounded-lg shadow-sm text-gray-200 bg-black/30 backdrop-blur-sm focus:ring-cyan-400 focus:border-cyan-400" 
                        disabled={!selectedCourse}
                    >
                        <option value="" className="bg-gray-800 text-white">Select Branch...</option>
                        {branches.map(branch => <option key={branch.id} value={branch.name} className="bg-gray-800 text-white">{branch.name}</option>)}
                    </select>

                    <select onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear} 
                        className="p-3 border border-white/30 rounded-lg shadow-sm text-gray-200 bg-black/30 backdrop-blur-sm focus:ring-cyan-400 focus:border-cyan-400" 
                        disabled={!selectedCourse}
                    >
                        <option value="" className="bg-gray-800 text-white">Select Year...</option>
                        {years.map(year => <option key={year} value={year} className="bg-gray-800 text-white">{year}</option>)}
                    </select>

                    <select onChange={(e) => setSelectedDocumentType(e.target.value)} value={selectedDocumentType} 
                        className="p-3 border border-white/30 rounded-lg shadow-sm text-gray-200 bg-black/30 backdrop-blur-sm focus:ring-cyan-400 focus:border-cyan-400"
                    >
                        <option value="" className="bg-gray-800 text-white">Select Document Type...</option>
                        {documentTypes.map(type => <option key={type} value={type} className="bg-gray-800 text-white">{type}</option>)}
                    </select>
                </div>
                
                <div className="mb-6">
                    <label className="block text-white text-sm font-bold mb-2">Upload File</label>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        // File input styled for dark background
                        className="w-full text-gray-200 border border-white/30 rounded py-2 px-3 bg-black/30 leading-tight focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none focus:shadow-outline"
                    />
                </div>
                
                {/* Upload Button: Cyan Accent Color */}
                <button
                    onClick={handleFileUpload}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-full shadow-lg focus:outline-none focus:shadow-outline transition-colors duration-200 transform hover:scale-[1.01]"
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload Document'}
                </button>
                
                {message && (
                    <p className="mt-4 text-center text-sm font-semibold text-gray-300">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Upload;
