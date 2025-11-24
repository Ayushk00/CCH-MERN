import React, { useEffect } from 'react';
import Navbar from '../components/Landing/Navbar';
import Hero from '../components/Landing/Hero';
import Footer from '../components/Landing/Footer';
function Home() {

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-4 md:px-12 overflow-hidden">
            <Navbar />
            <div className="flex-grow">
                <Hero />
            </div>
            <Footer />
        </div>
    );
}

export default Home;