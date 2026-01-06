import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from "firebase/firestore";

const Academics = () => {
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
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    // Updated for high contrast
    const [searchMessage, setSearchMessage] = useState('Select filters and click search.');

    useEffect(() => {
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
    }, []);

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

    // NEW: Fetches the correct number of years based on the selected course
    useEffect(() => {
        const generateYears = async () => {
            if (selectedCourse) {
                const courseDoc = courses.find(course => course.id === selectedCourse);
                if (courseDoc && courseDoc.duration) {
                    const yearsList = [];
                    for (let i = 1; i <= courseDoc.duration; i++) {
                        // Dynamically generate the year names (e.g., "1st Year")
                        const yearName = `${i}${i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th'} Year`;
                        yearsList.push(yearName);
                    }
                    setYears(yearsList);
                    return;
                }
            }
            // If no course is selected or no duration is found, reset years
            setYears([]);
        };
        generateYears();
    }, [selectedCourse, courses]);

    const searchDocuments = async () => {
        setLoading(true);
        setDocuments([]);
        setSearchMessage('');

        // Sanitize the input by trimming whitespace
        const uniId = selectedUniversity.trim();
        const courseId = selectedCourse.trim();
        const branch = selectedBranch.trim();
        const year = selectedYear.trim();
        const type = selectedDocumentType.trim();

        console.log("Selected Filters for Search:");
        console.log("University ID:", uniId);
        console.log("Course ID:", courseId);
        console.log("Branch:", branch);
        console.log("Year:", year);
        console.log("Type:", type);
        console.log("---");


        if (!uniId && !courseId && !branch && !year && !type) {
            setSearchMessage('Please select at least one filter.');
            setLoading(false);
            return;
        }

        try {
            let q = collection(db, 'academicMaterials');
            let hasFilter = false;

            if (uniId) {
                q = query(q, where('universityId', '==', uniId));
                hasFilter = true;
            }
            if (courseId) {
                q = query(q, where('courseId', '==', courseId));
                hasFilter = true;
            }
            if (branch) {
                q = query(q, where('branch', '==', branch));
                hasFilter = true;
            }
            if (year) {
                q = query(q, where('year', '==', year));
                hasFilter = true;
            }
            if (type) {
                q = query(q, where('type', '==', type));
                hasFilter = true;
            }

            if (!hasFilter) {
                setSearchMessage('Please select at least one filter.');
                setLoading(false);
                return;
            }

            const querySnapshot = await getDocs(q);
            const docsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (docsList.length === 0) {
                setSearchMessage('No documents found for your search criteria.');
            }

            setDocuments(docsList);
        } catch (error) {
            console.error("Error searching documents:", error);
            setSearchMessage('An error occurred while searching.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // Remove background color so the main app gradient shows through
        <div className="flex flex-col items-center p-4 w-full"> 
            
            {/* Header: High contrast white text */}
            <header className="w-full max-w-4xl text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-md">
                    Academic Resources
                </h1>
                <p className="text-lg md:text-xl text-gray-200 drop-shadow-sm">
                    Find and share notes, assignments, and exam papers.
                </p>
            </header>
            
            {/* Search Filters Section: Floating Card Style */}
            <section className="w-full max-w-4xl bg-white/5 p-6 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-md mb-8">
                <h2 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">Search Materials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    {/* Select Inputs: Styled for dark background/high contrast */}
                    <select 
                        onChange={(e) => setSelectedUniversity(e.target.value)} 
                        value={selectedUniversity} 
                        className="p-3 border border-white/30 rounded-lg shadow-sm text-gray-200 bg-black/30 backdrop-blur-sm focus:ring-cyan-400 focus:border-cyan-400"
                    >
                        {/* Dropdown options must also have dark background for visibility */}
                        <option value="" className="bg-gray-800 text-white">Select University...</option>
                        {universities.map(uni => <option key={uni.id} value={uni.id} className="bg-gray-800 text-white">{uni.name}</option>)}
                    </select>
                    
                    <select 
                        onChange={(e) => setSelectedCourse(e.target.value)} 
                        value={selectedCourse} 
                        className="p-3 border border-white/30 rounded-lg shadow-sm text-gray-200 bg-black/30 backdrop-blur-sm focus:ring-cyan-400 focus:border-cyan-400" 
                        disabled={!selectedUniversity}
                    >
                        <option value="" className="bg-gray-800 text-white">Select Course...</option>
                        {courses.map(course => <option key={course.id} value={course.id} className="bg-gray-800 text-white">{course.name}</option>)}
                    </select>

                    <select 
                        onChange={(e) => setSelectedBranch(e.target.value)} 
                        value={selectedBranch} 
                        className="p-3 border border-white/30 rounded-lg shadow-sm text-gray-200 bg-black/30 backdrop-blur-sm focus:ring-cyan-400 focus:border-cyan-400" 
                        disabled={!selectedCourse}
                    >
                        <option value="" className="bg-gray-800 text-white">Select Branch...</option>
                        {branches.map(branch => <option key={branch.id} value={branch.name} className="bg-gray-800 text-white">{branch.name}</option>)}
                    </select>

                    <select 
                        onChange={(e) => setSelectedYear(e.target.value)} 
                        value={selectedYear} 
                        className="p-3 border border-white/30 rounded-lg shadow-sm text-gray-200 bg-black/30 backdrop-blur-sm focus:ring-cyan-400 focus:border-cyan-400" 
                        disabled={!selectedCourse}
                    >
                        <option value="" className="bg-gray-800 text-white">Select Year...</option>
                        {years.map(year => <option key={year} value={year} className="bg-gray-800 text-white">{year}</option>)}
                    </select>
                    
                    <select 
                        onChange={(e) => setSelectedDocumentType(e.target.value)} 
                        value={selectedDocumentType} 
                        className="p-3 border border-white/30 rounded-lg shadow-sm text-gray-200 bg-black/30 backdrop-blur-sm focus:ring-cyan-400 focus:border-cyan-400"
                    >
                        <option value="" className="bg-gray-800 text-white">Select Document Type...</option>
                        {documentTypes.map(type => <option key={type} value={type} className="bg-gray-800 text-white">{type}</option>)}
                    </select>
                </div>
                <div className="mt-6 flex justify-center">
                    {/* Search Button: Use Cyan Accent color */}
                    <button 
                        onClick={searchDocuments} 
                        className="bg-cyan-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-cyan-700 transition duration-300 transform hover:scale-105"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </section>
            
            {/* Results Section: Floating Card Style */}
            <section className="w-full max-w-4xl bg-white/5 p-6 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-md">
                <h2 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">Available Documents</h2>
                {loading ? (
                    // Text color updated for visibility
                    <p className="text-gray-300 text-center">Loading documents...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        
{documents.length > 0 ? (
    documents.map(doc => (
        <a 
            key={doc.id} 
            href={doc.fileURL} 
            target="_blank" 
            rel="noopener noreferrer" 
            // Document card style for contrast
            className="block p-4 rounded-xl shadow-md text-gray-200 bg-black/30 hover:bg-black/40 transition-colors duration-200 cursor-pointer border border-white/10"
        >
            <h3 className="text-lg font-semibold text-white truncate">{doc.title}</h3>
            {/* Accent color for key info */}
            <p className="text-sm text-cyan-400">Type: {doc.type}</p>
            {/* Muted white for secondary info */}
            <p className="text-sm text-gray-300">University: {universities.find(u => u.id === doc.universityId)?.name}</p>
            <p className="text-sm text-gray-300">Course: {courses.find(c => c.id === doc.courseId)?.name}</p>
        </a>
    ))
) : (
    // Text color updated for visibility
    <p className="text-gray-300 text-center col-span-full">{searchMessage}</p>
)}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Academics;
