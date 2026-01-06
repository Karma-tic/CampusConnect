import React from 'react';


const About = () => {
    return (
        <div className="w-full py-16 px-4 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
                
                {/* Main Title */}
                <h1 className="text-4xl font-extrabold text-cc-text-light mb-4">
                    About <span className="text-cc-primary">CampusConnect</span>
                </h1>
                
                {/* Core Slogan */}
                <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
                    Your essential student platform, simplifying academic, essential, and career planning needs from a single, reliable hub.
                </p>

                {/* --- Features Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    
                    {/* Feature 1: Academic Resources */}
                    <div className="bg-cc-secondary border border-cc-primary/50 rounded-xl p-6 shadow-2xl hover:shadow-cc-primary/40 transition duration-300">
                        <h3 className="text-2xl font-bold text-cc-primary mb-3">
                            Academic Excellence
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                            We provide a comprehensive library of **academic documents**, including notes, papers, syllabus, and Previous Year Questions (PYQs). Our goal is to equip students with all the necessary resources to excel in their university courses and achieve top performance.
                        </p>
                    </div>

                    {/* Feature 2: Essential Needs & Local Services */}
                    <div className="bg-cc-secondary border border-cc-primary/50 rounded-xl p-6 shadow-2xl hover:shadow-cc-primary/40 transition duration-300">
                        <h3 className="text-2xl font-bold text-cc-primary mb-3">
                            Essential Living Simplified
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                            Campus life, especially when visiting a new city, can be challenging. We connect solo travelers and students with **local essential services** like laundry, barbers, quick meal options, and other daily necessities, ensuring a smooth and stress-free living experience.
                        </p>
                    </div>
                    
                    {/* Feature 3: Career Tools */}
                    <div className="bg-cc-secondary border border-cc-primary/50 rounded-xl p-6 shadow-2xl hover:shadow-cc-primary/40 transition duration-300">
                        <h3 className="text-2xl font-bold text-cc-primary mb-3">
                            Industry-Standard Resume Generation
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                            Don't submit generic documents. Our **Resume Generator** is tailored for the modern job market, creating professional, industry-standard resumes and CVs that maximize your chances of securing interviews and launching your career successfully.
                        </p>
                    </div>

                    {/* Feature 4: KarmAI Future Prediction */}
                    <div className="bg-cc-secondary border border-cc-primary/50 rounded-xl p-6 shadow-2xl hover:shadow-cc-primary/40 transition duration-300">
                        <h3 className="text-2xl font-bold text-cc-primary mb-3">
                            KarmAI: Future Prediction & Guidance
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                            Harness the power of **KarmAI**, our advanced predictive tool. Based on your academic trajectory and interests, KarmAI provides personalized career path predictions and actionable advice on what you should study and work on next.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default About;
