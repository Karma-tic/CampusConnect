import React, { useState } from 'react';

const Contact = () => {
    // State for mock form submission handling
    const [formStatus, setFormStatus] = useState(null); 
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormStatus('submitting');

        // Mock submission delay (replace this with your actual Node/backend API call)
        setTimeout(() => {
            console.log("Contact form submitted:", formData);
            setFormStatus('success');
            setFormData({ firstName: '', lastName: '', email: '', message: '' });
        }, 1500);
    };

    // Styling for input fields
    const inputStyle = "w-full p-3 bg-cc-secondary border-b-2 border-cc-primary/50 focus:border-cc-primary text-cc-text-light placeholder-gray-500 outline-none transition duration-300";

    return (
        <div className="w-full py-16 px-4 md:py-24">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-cc-text-light">
                
                {/* Left Side: Title and Contact Info */}
                <div className="md:pr-8">
                    <h1 className="text-5xl font-extrabold text-cc-text-light mb-4">
                        Connect <span className="text-cc-primary">With Us</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                        We'd love to hear from you! Whether you have feedback, need support, or want to partner with CampusConnect, reach out to our team.
                    </p>

                    {/* Quick Contact Details (Matching Footer Info) */}
                    <div className="space-y-4 text-gray-400 mt-12">
                        <div className="flex items-center space-x-3">
                            <span className="text-cc-primary text-xl">📞</span>
                            <p>+91 (626) 148-6462</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="text-cc-primary text-xl">✉️</span>
                            <p>contact@karmatix.in</p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <span className="text-cc-primary text-xl mt-1">📍</span>
                            <p>Mahatma Gandhi Square, Barkheda Bhopal, Madhya Pradesh, India</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Contact Form */}
                <div className="bg-gray-900 p-8 rounded-xl shadow-2xl border border-cc-primary/30">
                    <h2 className="text-3xl font-bold text-cc-text-light mb-6">Send a Message</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Fields */}
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <input type="text" name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleChange} required className={inputStyle} />
                            </div>
                            <div className="w-1/2">
                                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className={inputStyle} />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} required className={inputStyle} />
                        </div>

                        {/* Message Field */}
                        <div>
                            <textarea name="message" placeholder="Write a message *" rows="4" value={formData.message} onChange={handleChange} required className={`${inputStyle} resize-none`} />
                        </div>

                        {/* Submission Status */}
                        {formStatus === 'success' && (
                            <p className="text-green-500 font-semibold">Message sent successfully! We'll be in touch soon.</p>
                        )}
                        {formStatus === 'submitting' && (
                            <p className="text-cc-primary font-semibold">Sending message...</p>
                        )}

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={formStatus === 'submitting'}
                            className="w-full px-6 py-3 text-lg font-bold rounded-lg text-cc-text-light bg-cc-primary hover:bg-cc-primary/80 transition duration-300 shadow-xl disabled:opacity-50"
                        >
                            {formStatus === 'submitting' ? 'Sending...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
