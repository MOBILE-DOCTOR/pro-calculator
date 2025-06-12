import React, { useState, useEffect } from 'react';

// --- START: Firebase Static Imports ---
// Make sure you have 'firebase' installed: npm install firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
// If you plan to use Firestore later, you'd add:
// import { getFirestore, doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';
// --- END: Firebase Static Imports ---

// Main App component
const App = () => {
    // State to control the visibility of the download prompt
    const [showPrompt, setShowPrompt] = useState(false);

    // State to store the userId for Firebase authentication
    const [userId, setUserId] = useState(null);

    // State to hold Firebase instances once initialized
    const [firebaseReady, setFirebaseReady] = useState(false);
    const [db, setDb] = useState(null); // Placeholder for Firestore if you expand later
    const [auth, setAuth] = useState(null);

    // Effect for Firebase Initialization and Authentication
    useEffect(() => {
        // Retrieve Firebase configuration and app ID from global variables.
        // These are provided by the Canvas environment.
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

        try {
            const app = initializeApp(firebaseConfig);
            const firebaseAuth = getAuth(app);
            // const firestoreDb = getFirestore(app); // Initialize Firestore if needed

            setAuth(firebaseAuth);
            // setDb(firestoreDb); // Set Firestore instance if needed
            setFirebaseReady(true); // Mark Firebase as initialized

            // Authenticate the user using the custom token provided by the environment.
            // If the token is not defined, sign in anonymously.
            const authenticate = async () => {
                if (typeof __initial_auth_token !== 'undefined') {
                    await signInWithCustomToken(firebaseAuth, __initial_auth_token)
                        .then(() => {
                            console.log("Firebase authenticated successfully with custom token.");
                        })
                        .catch(error => {
                            console.error("Error signing in with custom token:", error);
                            signInAnonymously(firebaseAuth); // Fallback to anonymous if custom token fails
                        });
                } else {
                    await signInAnonymously(firebaseAuth)
                        .then(() => {
                            console.log("Firebase authenticated anonymously.");
                        })
                        .catch(error => console.error("Error signing in anonymously:", error));
                }
            };
            authenticate();

            // Listen for authentication state changes to get the current user's ID.
            const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
                if (user) {
                    setUserId(user.uid);
                    console.log("User ID:", user.uid);
                } else {
                    setUserId(null);
                    console.log("No user signed in.");
                }
            });

            // Cleanup subscription on component unmount
            return () => unsubscribe();

        } catch (e) {
            console.error("Error initializing Firebase:", e);
        }
    }, []); // Empty dependency array ensures this effect runs only once on component mount

    // Effect to check for first-time visit and show prompt
    useEffect(() => {
        // Only proceed if Firebase (and thus localStorage) is ready
        if (firebaseReady) {
            // Check if the user has visited before or dismissed the prompt using localStorage.
            const hasVisited = localStorage.getItem('hasVisitedApp');
            if (!hasVisited) {
                // If it's a first-time visit, show the prompt after a short delay.
                setTimeout(() => {
                    setShowPrompt(true);
                }, 1000); // 1-second delay
            }
        }
    }, [firebaseReady]); // Depend on firebaseReady state

    // Function to handle dismissing the prompt and redirecting to index.html
    const handleContinueToSite = () => {
        setShowPrompt(false); // Hide the prompt
        localStorage.setItem('hasVisitedApp', 'true'); // Set a flag in localStorage to remember user's choice
        window.location.href = 'index.html'; // Redirect to your main site
    };

    // Function to handle the "Download App" action
    const handleDownloadApp = () => {
        alert("Simulating app installation! The React app you are currently viewing is designed to be installable.");
        setShowPrompt(false); // Hide the prompt
        localStorage.setItem('hasVisitedApp', 'true'); // Set a flag so the prompt doesn't reappear
        // User remains on the React app, which acts as the installed app.
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4 font-inter">
            {/* Display userId if available (useful for multi-user apps and debugging) */}
            {userId && (
                <div className="absolute top-4 left-4 text-sm text-gray-600 p-2 bg-white rounded-lg shadow-md">
                    Your User ID: <span className="font-semibold">{userId}</span>
                </div>
            )}

            {/* Main Application Content */}
            <header className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-8 mb-8 text-center">
                <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
                    Welcome to Our Amazing App!
                </h1>
                <p className="text-lg text-gray-600">
                    Experience the best features on any device.
                </p>
            </header>

            <main className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-8 grid md:grid-cols-2 gap-8">
                <section className="flex flex-col items-center text-center">
                    <div className="text-6xl text-blue-500 mb-4">✨</div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">
                        Seamless Experience
                    </h2>
                    <p className="text-gray-600">
                        Our app is designed to look and work great on desktops, tablets, and mobile phones.
                    </p>
                </section>

                <section className="flex flex-col items-center text-center">
                    <div className="text-6xl text-green-500 mb-4">🚀</div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">
                        Blazing Fast
                    </h2>
                    <p className="text-gray-600">
                        Enjoy lightning-fast performance and smooth interactions, no matter your device.
                    </p>
                </section>

                <section className="md:col-span-2 flex flex-col items-center text-center">
                    <div className="text-6xl text-purple-500 mb-4">📱</div>
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">
                        Get the Mobile App!
                    </h2>
                    <p className="text-gray-600">
                        For an even better experience, download our dedicated mobile application.
                    </p>
                </section>
            </main>

            {/* Download Prompt Modal */}
            {showPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 m-4 max-w-md w-full text-center transform transition-all duration-300 scale-100 opacity-100">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Unlock the Full Experience!
                        </h2>
                        <p className="text-lg text-gray-700 mb-6">
                            Get our amazing app for a richer, more integrated experience.
                        </p>
                        <div className="flex flex-col space-y-4">
                            <button
                                onClick={handleDownloadApp}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                            >
                                Download App
                            </button>
                            <button
                                onClick={handleContinueToSite}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-sm"
                            >
                                No, thanks, continue to site
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
