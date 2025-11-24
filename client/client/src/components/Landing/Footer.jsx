import React from 'react';
import { FaInstagram, FaTelegramPlane, FaTwitter } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="p-5 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-4 md:px-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                {/* Links */}
                <div className="flex items-center mb-4 md:mb-0">
                    <a href="/privacy-policy" className="mx-2 text-white no-underline">
                        Privacy Policy
                    </a>
                    <a href="/contact" className="mx-2 text-white no-underline">
                        Contact
                    </a>
                </div>

                {/* Social Icons */}
                <div className="flex items-center">
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mx-2 text-white text-2xl"
                    >
                        <FaInstagram />
                    </a>
                    <a
                        href="https://telegram.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mx-2 text-white text-2xl"
                    >
                        <FaTelegramPlane />
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mx-2 text-white text-2xl"
                    >
                        <FaTwitter />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;