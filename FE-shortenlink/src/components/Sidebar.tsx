import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../logo.svg';

const Sidebar = () => {
    const [activeItem, setActiveItem] = useState('Links');
    const navigate = useNavigate();

    const menuItems = [
        { name: "Links", icon: "🔗", path: "/" },
        { name: "Create Link", icon: "➕", path: "/create" },
        { name : "QR Code", icon: "📱", path: "/qr-code" },

    ];

    return (
        <div className="w-64 min-h-screen bg-white border-r border-gray-200">
            <div className="p-4">
                <img src={Logo} alt="Logo" className="w-12 h-12" />
            </div>
            <nav className="mt-8">
                <ul className="space-y-1">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <button
                                onClick={() => {
                                    setActiveItem(item.name);
                                    navigate(item.path);
                                }}
                                className={`w-full flex items-center px-4 py-2.5 text-sm
                                    ${activeItem === item.name
                                    ? 'text-blue-600 bg-blue-50 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <span className="w-8 text-xl">{item.icon}</span>
                                <span>{item.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
