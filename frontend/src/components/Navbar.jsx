import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const { token, logout } = useContext(AuthContext);
    const [isDarkMode, setIsDarkMode] = useState(false);
 
    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDarkMode(true);
        }
    };

    return (
        <nav className="bg-gray-100 dark:bg-gray-800 shadow-md transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                     
                    <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        SmartEvent
                    </Link>
 
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600">
                            Events
                        </Link>
 
                        {token ? (
                            <>
                                <Link to="/admin" className="text-gray-700 dark:text-gray-200 hover:text-blue-600">
                                    Dashboard
                                </Link>
                                <button onClick={logout} className="text-red-500 hover:text-red-700 font-semibold">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-blue-600">
                                Organizer Login
                            </Link>
                        )}
 
                        <button 
                            onClick={toggleDarkMode} 
                            className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}