import React, { useState } from 'react';
import AppliedJobCard from '../../components/student/AppliedJobCard';
import axios from 'axios';
import { useEffect } from 'react';
const AppliedJobs = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [appliedJobDetails, setAppliedJobDetails] = useState([]);
    const jobsPerPage = 5;

    useEffect(() => {
        fetchAppliedJobs();
    }, []);

    const fetchAppliedJobs = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/student/applied-jobs', {
                withCredentials: true
            });
            setAppliedJobDetails(response.data);
        } catch (error) {
            console.error('Error fetching applied jobs:', error);
        }
    };

    const filteredJobs = appliedJobDetails.filter(job =>
        (job.companyName.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        job.role.toLowerCase().startsWith(searchQuery.toLowerCase())) &&
        ['Rejected', 'Pending', 'Shortlisted'].includes(job.status)
    );

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
                <div className="flex-grow container mx-auto p-4">
                    <div className="mb-4 flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Search by company or role"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">#</th>
                                    <th className="py-2 px-4 border-b">Company Name</th>
                                    <th className="py-2 px-4 border-b">Role</th>
                                    <th className="py-2 px-4 border-b">CTC</th>
                                    <th className="py-2 px-4 border-b">Location</th>
                                    <th className="py-2 px-4 border-b">Duration</th>
                                    <th className="py-2 px-4 border-b">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentJobs.map((job, index) => (
                                    <AppliedJobCard
                                        key={index}
                                        serial={job.serial}
                                        companyName={job.companyName}
                                        role={job.role}
                                        ctc={`${job.ctc} LPA`}
                                        location={job.location}
                                        duration={job.duration}
                                        status={job.status}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex justify-center">
                        <nav>
                            <ul className="inline-flex items-center -space-x-px">
                                {Array.from({ length: Math.ceil(filteredJobs.length / jobsPerPage) }, (_, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => paginate(index + 1)}
                                            className={`py-2 px-3 leading-tight ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-500'} border border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
    );
};

export default AppliedJobs;