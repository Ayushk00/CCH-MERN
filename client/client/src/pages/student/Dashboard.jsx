import React from 'react';
import { useAuth } from '../../utility/AuthContext';

function Dashboard() {
    const { user } = useAuth();
    const name = user.name;

    // Dummy data for the number of jobs
    const activeJobs = 5;
    const appliedJobs = 10;
    const shortlistedJobs = 3;
    const interviewsScheduled = 2;
    const offersReceived = 1;
    
    return (
        <div className="flex flex-col p-8 m-4 bg-gray-100"> {/* Updated padding and margin */}
            <h1 className="text-3xl font-bold mb-6 text-center">Welcome, {name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-2">Active Jobs</h2>
                    <p className="text-3xl font-bold">{activeJobs}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-2">Applied Jobs</h2>
                    <p className="text-3xl font-bold">{appliedJobs}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-2">Shortlisted Jobs</h2>
                    <p className="text-3xl font-bold">{shortlistedJobs}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-2">Interviews Scheduled</h2>
                    <p className="text-3xl font-bold">{interviewsScheduled}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-2">Offers Received</h2>
                    <p className="text-3xl font-bold">{offersReceived}</p>
                </div>
            </div>
        </div>
    )
};

export default Dashboard;