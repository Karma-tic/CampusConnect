import React from 'react';

const Privacy = () => {
    // Styling for consistent dark theme readability
    const textStyle = "text-gray-400 mb-6 leading-relaxed";
    const headingStyle = "text-2xl font-bold text-cc-primary mt-8 mb-4 border-b border-cc-primary/50 pb-2";

    return (
        <div className="w-full py-16 px-4 md:py-24">
            <div className="max-w-4xl mx-auto text-cc-text-light">
                
                {/* Main Header */}
                <h1 className="text-5xl font-extrabold text-cc-text-light mb-4 text-center">
                    Privacy <span className="text-cc-primary">Policy</span>
                </h1>
                <p className="text-lg text-gray-500 mb-12 text-center">
                    Last Updated: October 8, 2025
                </p>

                <p className={textStyle}>
                    At CampusConnect, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information when you use our services, including academic resources, essential needs listings, the Resume Generator, and KarmAI.
                </p>

                {/* 1. Information We Collect */}
                <h2 className={headingStyle}>1. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-cc-text-light mt-6 mb-3">Personal Identification Information</h3>
                <p className={textStyle}>
                    We collect information you voluntarily provide, such as your name, email address, university affiliation, and login credentials when you sign up for an account. This is essential for providing personalized services, such as saving your resume drafts or tailoring KarmAI predictions.
                </p>

                <h3 className="text-xl font-semibold text-cc-text-light mt-6 mb-3">Usage and Technical Data</h3>
                <p className={textStyle}>
                    We automatically collect information about how you access and use the service. This may include your IP address, browser type, pages viewed, time spent on pages, and device identifiers. This data helps us improve service functionality and security.
                </p>

                {/* 2. How We Use Your Information */}
                <h2 className={headingStyle}>2. How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-3 pl-4">
                    <li className={textStyle}>**Service Delivery:** To operate, maintain, and provide the core features of CampusConnect (e.g., granting access to academic documents, generating resumes).</li>
                    <li className={textStyle}>**KarmAI Analysis:** To process and analyze data inputs for career path predictions and suggestions. *Note: Data used for AI training is typically anonymized.*</li>
                    <li className={textStyle}>**Communication:** To send you service announcements, security alerts, and support messages.</li>
                    <li className={textStyle}>**Improvement:** To monitor and analyze usage patterns to enhance user experience and optimize our features.</li>
                </ul>
                
                {/* 3. Sharing Your Information */}
                <h2 className={headingStyle}>3. Sharing Your Information</h2>
                <p className={textStyle}>
                    We do not sell your personal data. We may share your information only under the following limited circumstances:
                </p>
                <ul className="list-disc list-inside space-y-3 pl-4">
                    <li className={textStyle}>**Third-Party Vendors:** With service providers who perform services on our behalf (e.g., hosting, analytics, email delivery), but only to the extent necessary to perform those services.</li>
                    <li className={textStyle}>**Legal Compliance:** When required by law or to respond to valid legal processes.</li>
                </ul>

                {/* 4. Security */}
                <h2 className={headingStyle}>4. Data Security</h2>
                <p className={textStyle}>
                    We implement industry-standard security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                </p>
                
                {/* Contact Section */}
                <h2 className={headingStyle}>Contact Us</h2>
                <p className={textStyle}>
                    If you have questions about this Privacy Policy, please contact us at: <span className="text-cc-primary font-semibold">contact@karmatix.in</span>.
                </p>

            </div>
        </div>
    );
};

export default Privacy;
