import React from 'react';

// Self-contained SVG icon to replace the external library import
const FaCheckCircle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const ActiveJobCard = ({ serial, companyName, role, ctc, location, type, onApply, hasApplied }) => {
    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <td className="py-4 px-4 text-sm text-gray-500">{serial}</td>
            <td className="py-4 px-4 text-sm font-medium text-gray-800">{companyName}</td>
            <td className="py-4 px-4 text-sm text-gray-600">{role}</td>
            <td className="py-4 px-4 text-sm text-gray-600">{ctc}</td>
            <td className="py-4 px-4 text-sm text-gray-600">{location}</td>
            <td className="py-4 px-4 text-sm text-gray-600 capitalize">{type}</td>
            <td className="py-4 px-4">
                {hasApplied ? (
                    <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                        <FaCheckCircle />
                        <span>Applied</span>
                    </div>
                ) : (
                    <button
                        onClick={onApply}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 text-sm font-semibold shadow"
                    >
                        Apply Now
                    </button>
                )}
            </td>
        </tr>
    );
};

export default ActiveJobCard;