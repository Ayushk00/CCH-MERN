import React from 'react';

const Hero = () => {
    return (
        <section className="flex-grow flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-4 md:px-12">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 p-4 text-center md:text-left">
                    <h1 className="text-6xl md:text-7xl font-extrabold mb-4">
                        Kickstart Your Career
                    </h1>
                    <p className="text-lg md:text-2xl mb-8 tracking-wide">
                        Empowering Your Future With the Right Opportunity
                    </p>
                    <p className="text-md md:text-xl mb-8 tracking-wide text-gray-300">
                        Discover endless possibilities and unlock your true potential with our career services. We're here to guide you every step of the way!
                    </p>
                    <a
                        href="#apply"
                        className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Get Started
                    </a>
                </div>
                <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center p-4">
                    <img 
                        src="/hero.svg" 
                        alt="Hero Illustration" 
                        className="w-full max-w-md h-auto"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;