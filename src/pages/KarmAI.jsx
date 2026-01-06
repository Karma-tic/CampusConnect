
import React, { useState, useEffect } from 'react';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions"; 
import { app } from '../firebaseConfig';

const functions = getFunctions(app);

if (window.location.hostname === "localhost") {
    console.log("Connecting to Firebase Functions Emulator on port 5001...");
    // Use the actual port shown when running 'firebase emulators:start' (e.g. 5001)
    connectFunctionsEmulator(functions, "localhost", 5001); 
}

const generatePlan = httpsCallable(functions, 'generateKarmAIPlan'); // 'generateKarmAIPlan' is the function name

const KarmAI = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        education: '',
        skills: '',
        interests: '',
        goals: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        setIsLoading(true);
        setAiResult(null);
        setError(null);

        try {
            const response = await generatePlan(formData);
            
           setAiResult(response.data.plan); 
            setStep(5); 

        } catch (err) {
            console.error("KarmAI Function Call Error:", err);
            // FirebaseError: internal often means the function crashed server-side
            setError("Failed to generate career plan. Please Login and try again.");
            setStep(4); // Keep on the final step for retrying/error message
        } finally {
            setIsLoading(false);
        }
    };
    
    // 4. Form Step Components (Simplified)
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Step 
                        title="Your Academic Foundation" 
                        description="What have you studied?"
                    >
                        <textarea 
                            name="education" 
                            value={formData.education} 
                            onChange={handleInputChange} 
                            placeholder="e.g., Bachelor of Science in Computer Engineering, Minor in Business, Key courses..."
                            className="w-full p-3 border rounded-lg text-gray-800"
                            rows="4"
                        ></textarea>
                        <button onClick={nextStep} className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-full transition-colors">
                            Next: Skills
                        </button>
                    </Step>
                );
            case 2:
                return (
                    <Step 
                        title="Your Skill Set" 
                        description="What technical and soft skills do you possess?"
                    >
                        <textarea 
                            name="skills" 
                            value={formData.skills} 
                            onChange={handleInputChange} 
                            placeholder="e.g., Python, React, Data Analysis, Leadership, Communication, Problem-Solving..."
                            className="w-full p-3 border rounded-lg text-gray-800"
                            rows="4"
                        ></textarea>
                        <NavButtons prev={prevStep} next={nextStep} nextLabel="Next: Interests" />
                    </Step>
                );
            case 3:
                return (
                    <Step 
                        title="Your Interests & Goals" 
                        description="What fields are you interested in and what are your long-term goals?"
                    >
                        <textarea 
                            name="interests" 
                            value={formData.interests} 
                            onChange={handleInputChange} 
                            placeholder="e.g., Sustainable Technology, Fintech, UI/UX Design, Gaming..."
                            className="w-full p-3 border rounded-lg text-gray-800 mb-4"
                            rows="2"
                        ></textarea>
                        <textarea 
                            name="goals" 
                            value={formData.goals} 
                            onChange={handleInputChange} 
                            placeholder="e.g., Land a software developer role at a medium-sized company in 2 years, Start my own consulting firm..."
                            className="w-full p-3 border rounded-lg text-gray-800"
                            rows="2"
                        ></textarea>
                        <NavButtons prev={prevStep} next={nextStep} nextLabel="Next: Review" />
                    </Step>
                );
            case 4:
                return (
                    <Step 
                        title="Review & Generate Plan" 
                        description="Ready to see your KarmAI plan?"
                    >
                        <div className="text-left text-gray-200 space-y-2 mb-6 p-4 border border-white/30 rounded-lg">
                            <p><strong>Education:</strong> {formData.education || 'N/A'}</p>
                            <p><strong>Skills:</strong> {formData.skills || 'N/A'}</p>
                            <p><strong>Interests:</strong> {formData.interests || 'N/A'}</p>
                            <p><strong>Goals:</strong> {formData.goals || 'N/A'}</p>
                        </div>
                        {error && <p className="text-red-400 mb-4">{error}</p>}
                        <NavButtons 
                            prev={prevStep} 
                            submit={handleSubmit} 
                            isLoading={isLoading} 
                            submitLabel={isLoading ? "Generating..." : "Generate KarmAI Plan"}
                        />
                    </Step>
                );
            case 5:
                return (
                    <Step 
                        title="Your KarmAI Career Plan" 
                        description="Here is your personalized roadmap."
                    >
                        <div className="bg-white/10 p-6 rounded-lg text-left shadow-xl max-h-96 overflow-y-auto">
                            {/* The AI plan is returned as markdown text */}
                            {aiResult ? (
                                <div className="prose prose-invert max-w-none text-white leading-relaxed" 
                                     dangerouslySetInnerHTML={{ __html: aiResult.replace(/\n/g, '<br/>') }} />
                            ) : (
                                <p className="text-gray-400">Your plan will appear here. It looks like an error occurred or the content is missing.</p>
                            )}
                        </div>
                        <button onClick={() => setStep(1)} className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-colors">
                            Start New Plan
                        </button>
                    </Step>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-3xl mx-auto text-center p-4">
            <h1 className="text-4xl font-bold text-white mb-6">KarmAI - Career Guidance</h1>
            
            {/* Simple Progress Indicator */}
            <div className="flex justify-center space-x-2 mb-8">
                {[1, 2, 3, 4, 5].map(s => (
                    <div 
                        key={s} 
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${s === step ? 'bg-purple-400 text-gray-900 scale-110' : 'bg-white/20 text-gray-300'}`}
                    >
                        {s}
                    </div>
                ))}
            </div>

            <div className="bg-white/5 p-6 md:p-10 rounded-2xl shadow-2xl backdrop-blur-sm">
                {renderStep()}
            </div>
        </div>
    );
};

// Helper Components for clean layout
const Step = ({ title, description, children }) => (
    <>
        <h2 className="text-3xl font-semibold text-white mb-2">{title}</h2>
        <p className="text-gray-300 mb-6">{description}</p>
        {children}
    </>
);

const NavButtons = ({ prev, next, submit, isLoading = false, nextLabel = "Next", submitLabel = "Submit" }) => (
    <div className="flex justify-between mt-6">
        {prev && (
            <button 
                onClick={prev} 
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-colors"
            >
                &larr; Back
            </button>
        )}
        {next && (
            <button 
                onClick={next} 
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-full transition-colors ml-auto"
            >
                {nextLabel} &rarr;
            </button>
        )}
        {submit && (
            <button 
                onClick={submit} 
                disabled={isLoading} 
                className={`font-bold py-2 px-4 rounded-full transition-colors ${isLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
            >
                {submitLabel}
            </button>
        )}
    </div>
);

export default KarmAI;
