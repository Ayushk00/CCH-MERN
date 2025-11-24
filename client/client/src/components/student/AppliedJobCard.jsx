import React from 'react';

const AppliedJobCard = ({ serial, companyName, role, ctc, location, duration, status }) => {
    const renderStatus = (status) => {
        switch (status) {
            case 'Shortlisted':
                return <button className="bg-green-500 text-white px-2 py-1 rounded">Shortlisted</button>;
            case 'Rejected':
                return <button className="bg-red-500 text-white px-2 py-1 rounded">Rejected</button>;
            case 'Pending':
                return <button className="bg-yellow-500 text-white px-2 py-1 rounded">Pending</button>;
            default:
                return <button className="bg-gray-500 text-white px-2 py-1 rounded">{status}</button>;
        }
    };

    return (
        <tr className="bg-white hover:bg-gray-100 transition-colors duration-200">
            <td className="text-lg font-semibold p-4 border-b text-center">{serial}</td>
            <td className="text-lg font-semibold p-4 border-b text-center">{companyName}</td>
            <td className="text-lg font-semibold p-4 border-b text-center">{role}</td>
            <td className="text-lg font-semibold p-4 border-b text-center">{ctc}</td>
            <td className="text-lg font-semibold p-4 border-b text-center">{location}</td>
            <td className="text-lg font-semibold p-4 border-b text-center">{duration}</td>
            <td className="text-lg font-semibold p-4 border-b text-center">{renderStatus(status)}</td>
        </tr>
    );
};

export default AppliedJobCard;