import React from 'react';

const ActiveJobCard = ({ serial, companyName, role, ctc, location, duration }) => {
    return (
        <tr className="bg-white hover:bg-gray-100 transition-colors duration-200">
            <td className="text-lg font-semibold p-4 border-b text-center">{serial}</td>
            <td className="text-lg font-semibold p-4 border-b text-center">{companyName}</td>
            <td className="text-lg font-semibold p-4 border-b text-center">{role}</td>
            <td className="text-lg font-semibold p-4 border-b text-center">{ctc}</td>
            <td className="text-lg font-semibold p-4 border-b text-center">{location}</td>
            <td className="text-lg font-semibold p-4 border-b text-center">{duration}</td>
            <td className="p-4 border-b text-center">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Apply</button>
            </td>
            <td className="p-4 border-b text-center">
                <a href="#" className="text-blue-500 underline">View Details</a>
            </td>
        </tr>
    );
};

export default ActiveJobCard;