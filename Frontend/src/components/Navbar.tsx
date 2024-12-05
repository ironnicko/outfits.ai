
import React from 'react';
import { Link } from 'react-router-dom';

import LogoutButton from './LogoutButton';


const Navbar: React.FC = () => {



    return (
    <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
            <Link to="/">Home</Link>
        </div>
        <div className="md:flex space-x-4">
            <Link to="/closet" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Closet
            </Link>

        </div>
        <LogoutButton />


        </div>
    </nav>
    );
};

export default Navbar;