import React from 'react';

const Terms = () => {
    // Styling for consistent dark theme readability
    const textStyle = "text-gray-400 mb-6 leading-relaxed";
    const headingStyle = "text-2xl font-bold text-cc-primary mt-8 mb-4 border-b border-cc-primary/50 pb-2";

    return (
        <div className="w-full py-16 px-4 md:py-24">
            <div className="max-w-4xl mx-auto text-cc-text-light">
                
                {/* Main Header */}
                <h1 className="text-5xl font-extrabold text-cc-text-light mb-4 text-center">
                    Terms and <span className="text-cc-primary">Conditions</span>
                </h1>
                <p className="text-lg text-gray-500 mb-12 text-center">
                    Effective Date: October 8, 2025
                </p>

                <h2 className={headingStyle}>1. Acceptance of Terms</h2>
                <p className={textStyle}>
                    By accessing or using the CampusConnect platform (the "Service"), you agree to be bound by these Terms and Conditions ("Terms"). These Terms govern all use of the Service, including access to Academic Resources, Essential Needs, the Resume Generator, and KarmAI. If you disagree with any part of the terms, you may not access the Service.
                </p>

                <h2 className={headingStyle}>2. User Accounts</h2>
                <p className={textStyle}>
                    You must be at least 18 years old or the age of majority in your jurisdiction to create an account. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device. You agree to accept responsibility for all activities that occur under your account.
                </p>

                <h2 className={headingStyle}>3. Services Provided</h2>

                <h3 className="text-xl font-semibold text-cc-text-light mt-6 mb-3">Academic Resources & Uploads</h3>
                <p className={textStyle}>
                    The Service allows users to upload and access educational documents (notes, papers, etc.). By uploading content, you affirm that you have the right to share this material and grant CampusConnect a worldwide, royalty-free license to host and display your content. You must not upload any material that violates copyright or intellectual property rights.
                </p>

                <h3 className="text-xl font-semibold text-cc-text-light mt-6 mb-3">Resume Generator & KarmAI</h3>
                <p className={textStyle}>
                    The **Resume Generator** and **KarmAI** features are provided as tools for informational and organizational assistance only. CampusConnect makes no guarantee regarding the employment outcomes or accuracy of career predictions derived from these tools. You use these features at your own risk.
                </p>

                <h2 className={headingStyle}>4. Prohibited Uses</h2>
                <p className={textStyle}>
                    You may use the Service only for lawful purposes. You agree not to use the Service:
                </p>
                <ul className="list-disc list-inside space-y-3 pl-4">
                    <li className={textStyle}>For any fraudulent, unauthorized, or illegal activity.</li>
                    <li className={textStyle}>To upload or transmit malicious software, viruses, or any code of a destructive nature.</li>
                    <li className={textStyle}>To harass, abuse, insult, harm, defame, slander, or intimidate others.</li>
                    <li className={textStyle}>To collect or track the personal information of others without consent.</li>
                </ul>

                <h2 className={headingStyle}>5. Termination</h2>
                <p className={textStyle}>
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                </p>
                
                <h2 className={headingStyle}>6. Limitation of Liability</h2>
                <p className={textStyle}>
                    In no event shall CampusConnect, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of the Service.
                </p>
                
                <h2 className={headingStyle}>Contact Information</h2>
                <p className={textStyle}>
                    If you have any questions about these Terms, please contact us at: <span className="text-cc-primary font-semibold">contact@karmatix.in</span>.
                </p>

            </div>
        </div>
    );
};

export default Terms;
