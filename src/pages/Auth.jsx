import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom'; 

const auth = getAuth(app);

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleSignIn = async () => {
        try {
            setError('');
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/'); // Redirect to the home page on success
        } catch (err) {
            let errorMessage = "Sign in failed. Please check your credentials.";
            if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                errorMessage = "Invalid email or password.";
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address format.";
            }
            // Use console.error instead of alert
            console.error("Sign In Error:", err);
            setError(errorMessage);
        }
    };

    const handleSignUp = async () => {
        try {
            setError('');
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/'); // Redirect to the home page on success
        } catch (err) {
            let errorMessage = "Sign up failed. Please try again.";
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already in use.";
            } else if (err.code === 'auth/weak-password') {
                errorMessage = "Password should be at least 6 characters.";
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address format.";
            }
            // Use console.error instead of alert
            console.error("Sign Up Error:", err);
            setError(errorMessage);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            {/* Floating Card Container */}
            <div className="w-full max-w-md p-8 bg-white/5 rounded-3xl shadow-2xl backdrop-blur-md border border-white/10">
                <h2 className="text-3xl font-bold text-center text-white mb-8 drop-shadow-lg">Hello {email}</h2>
                <div className="mb-4">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border border-white/20 rounded-xl w-full py-3 px-4 bg-gray-900/50 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-shadow duration-200"
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border border-white/20 rounded-xl w-full py-3 px-4 bg-gray-900/50 text-white mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-shadow duration-200"
                        id="password"
                        type="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-red-400 text-sm italic mb-6 text-center">{error}</p>}
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        className="w-full sm:flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transition-colors duration-200 transform hover:scale-[1.02]"
                        type="button"
                        onClick={handleSignIn}
                    >
                        Sign In
                    </button>
                    <button
                        className="w-full sm:flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transition-colors duration-200 transform hover:scale-[1.02]"
                        type="button"
                        onClick={handleSignUp}
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
