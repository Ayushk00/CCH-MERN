import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- SVG Icons (replacing react-icons) ---
const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 12.414V17a1 1 0 01-1.447.894l-2-1A1 1 0 018 16v-3.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
    </svg>
);

const ChevronDownIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const CheckCircleIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

// --- Custom Toast Notification (replacing react-toastify) ---
const Toast = ({ message, type, onclose }) => {
    if (!message) return null;
    const baseStyle = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white transition-opacity duration-300";
    const typeStyle = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`${baseStyle} ${typeStyle}`}>
            <span>{message}</span>
            <button onClick={onclose} className="ml-4 font-bold">X</button>
        </div>
    );
};

// --- Custom Confirmation Dialog (replacing react-confirm-alert) ---
const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">Yes, Apply</button>
                </div>
            </div>
        </div>
    );
};


// --- ActiveJobCard Component (now in the same file) ---
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
                        <CheckCircleIcon />
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

// --- Main ActiveJobs Page Component ---
const ActiveJobs = () => {
    const [jobDetails, setJobDetails] = useState([]);
    const [studentProfile, setStudentProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [toast, setToast] = useState({ message: '', type: '' });
    const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    const jobsPerPage = 8;
    
    const showToast = useCallback((message, type) => {
        setToast({ message, type });
        setTimeout(() => {
            setToast({ message: '', type: '' });
        }, 5000);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                axios.defaults.withCredentials = true;
                const jobsResponse = await axios.get('http://localhost:3000/api/student/jobs');
                if (jobsResponse.data?.data) setJobDetails(jobsResponse.data.data);

                const profileResponse = await axios.get('http://localhost:3000/api/student/profile');
                if (profileResponse.data?.data) setStudentProfile(profileResponse.data.data);
            } catch (error) {
                showToast(error.response?.data?.message || "Failed to fetch data.", "error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [showToast]);

    const handleApplyClick = (jobId) => {
        setDialog({
            isOpen: true,
            title: 'Confirm Application',
            message: 'Are you sure you want to apply for this job?',
            onConfirm: () => {
                executeApply(jobId);
                setDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} });
            }
        });
    };
    
    const executeApply = async (jobId) => {
        try {
            const response = await axios.post(`http://localhost:3000/api/student/apply-job/${jobId}`);
            showToast(response.data.message || 'Successfully applied!', 'success');

            const profileResponse = await axios.get('http://localhost:3000/api/student/profile');
            setStudentProfile(profileResponse.data.data);
        } catch (error) {
            showToast(error.response?.data?.message || 'Application failed.', 'error');
        }
    };

    const filteredJobs = jobDetails.filter(job =>
        (job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         job.role?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (locationFilter === '' || job.location.toLowerCase() === locationFilter.toLowerCase()) &&
        (typeFilter === '' || job.type.toLowerCase() === typeFilter.toLowerCase())
    );

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Toast message={toast.message} type={toast.type} onclose={() => setToast({ message: '', type: '' })} />
            <ConfirmDialog 
                isOpen={dialog.isOpen} 
                title={dialog.title}
                message={dialog.message}
                onConfirm={dialog.onConfirm}
                onCancel={() => setDialog({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
            />
            
            <div className="container mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Eligible Job Openings</h1>
                
                <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search by company or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="p-3 border border-gray-300 rounded-lg bg-white flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm hover:bg-gray-100 transition"
                    >
                        <FilterIcon />
                        <span>Filters</span>
                        <ChevronDownIcon className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                
                {showFilters && (
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <select
                                    name="location"
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Locations</option>
                                    {[...new Set(jobDetails.map(job => job.location))].map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                                <select
                                    name="type"
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Types</option>
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="internship">Internship</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    {isLoading ? (
                        <div className="text-center p-10 font-medium text-gray-500">Loading jobs...</div>
                    ) : (
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">#</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">COMPANY</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ROLE</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">CTC (LPA)</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">LOCATION</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">TYPE</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentJobs.length > 0 ? currentJobs.map((job, index) => (
                                    <ActiveJobCard
                                        key={job._id}
                                        serial={indexOfFirstJob + index + 1}
                                        companyName={job.company?.name || 'N/A'}
                                        role={job.role}
                                        ctc={(job.ctc)}
                                        location={job.location}
                                        type={job.type}
                                        onApply={() => handleApplyClick(job._id)}
                                        hasApplied={studentProfile?.appliedJobs?.includes(job._id)}
                                    />
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-10 text-gray-500">No eligible jobs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {totalPages > 1 && (
                     <div className="mt-6 flex justify-center">
                        <nav>
                            <ul className="inline-flex items-center -space-x-px shadow-sm">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => paginate(index + 1)}
                                            className={`py-2 px-4 leading-tight border border-gray-300 ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveJobs;

