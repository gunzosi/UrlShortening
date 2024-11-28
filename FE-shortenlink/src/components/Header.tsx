import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

// Header Component
const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="flex justify-between items-center px-8 py-4">
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search links, campaigns..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                       text-sm transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            🔍
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button className="text-gray-600 hover:text-gray-900">
                        <span className="text-xl">❔</span>
                    </button>
                    {isAuthenticated
                        ?
                    (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2">
                                    {user?.username?.[0].toUpperCase()}
                                </div>
                                <span className="text-sm font-medium">{user?.username}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700
                                text-white text-sm font-medium rounded-lg
                                hover:from-blue-700 hover:to-blue-800
                                transition-all duration-200 shadow-sm"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;