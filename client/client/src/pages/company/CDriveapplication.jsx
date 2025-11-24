import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

// --- (The StudentDetailsModal component remains the same) ---
const StudentDetailsModal = ({ student, onClose }) => {
    if (!student) return null;

    const renderDetail = (label, value) => (
        <div className="grid grid-cols-2 gap-4">
            <p className="font-semibold text-gray-600">{label}:</p>
            <p className="text-gray-800 capitalize">{value || 'N/A'}</p>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
                </div>
                <div className="space-y-4">
                    {renderDetail("Email", student.email)}
                    {renderDetail("Phone", student.phone)}
                    {renderDetail("Roll No", student.rollNo)}
                    <hr/>
                    {renderDetail("Degree", student.degree)}
                    {renderDetail("Branch", student.branch)}
                    {renderDetail("Graduating Year", student.graduatingYear)}
                    <hr/>
                    {renderDetail("CGPI", student.cgpi)}
                    {renderDetail("10th Marks (%)", student.tenthMarks)}
                    {renderDetail("12th Marks (%)", student.twelfthMarks)}
                    <hr/>
                    {renderDetail("Email Verified", student.isEmailVerified ? 'Yes' : 'No')}
                </div>
            </div>
        </div>
    );
};


// --- Main Drive Applications Page Component ---
export default function CDriveApplication() {
    const [allJobs, setAllJobs] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch all jobs posted by the company when the component mounts
    useEffect(() => {
        const fetchCompanyJobs = async () => {
            setIsLoading(true);
            try {
                axios.defaults.withCredentials = true;
                const response = await axios.get('http://localhost:3000/api/company/jobs');
                if (response.data?.data) {
                    setAllJobs(response.data.data);
                    // Optionally, select the first job by default
                    if (response.data.data.length > 0) {
                        setSelectedJobId(response.data.data[0]._id);
                    }
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch jobs.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanyJobs();
    }, []);

    // Fetch applicants whenever the selectedJobId changes
    useEffect(() => {
        const fetchApplicants = async () => {
            if (!selectedJobId) {
                setApplicants([]); // Clear applicants if no job is selected
                return;
            }
            setIsLoading(true);
            setError('');
            try {
                const response = await axios.get(`http://localhost:3000/api/company/jobs/${selectedJobId}/candidates`);
                setApplicants(response.data?.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch applicants.");
                setApplicants([]); // Clear applicants on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplicants();
    }, [selectedJobId]);

    const handleViewDetails = (student) => {
        setSelectedStudent(student);
    };

    const handleCloseModal = () => {
        setSelectedStudent(null);
    };
    
    // Memoize the selected job details to avoid recalculating on every render
    const selectedJobDetails = useMemo(() => {
        return allJobs.find(job => job._id === selectedJobId);
    }, [allJobs, selectedJobId]);

    return (
        <>
            <div className="p-5 md:p-10 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Drive Applications</h1>
                <p className="text-gray-600 mb-8">Review the candidates who have applied for your job postings.</p>

                {/* --- Job Filter Dropdown --- */}
                <div className="mb-8 max-w-md">
                    <label htmlFor="job-filter" className="block text-sm font-medium text-gray-700 mb-2">
                        Select a Job Drive to View Applicants
                    </label>
                    <select
                        id="job-filter"
                        value={selectedJobId}
                        onChange={(e) => setSelectedJobId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        disabled={isLoading || allJobs.length === 0}
                    >
                        {allJobs.length > 0 ? (
                            allJobs.map(job => (
                                <option key={job._id} value={job._id}>
                                    {job.role} ({job.type})
                                </option>
                            ))
                        ) : (
                            <option>No jobs found</option>
                        )}
                    </select>
                </div>

                <div className="bg-white border shadow-sm rounded-xl overflow-hidden">
                    {isLoading && <p className="p-6 text-center text-gray-500">Loading applicants...</p>}
                    {error && <p className="p-6 text-center text-red-500">{error}</p>}
                    
                    {!isLoading && !error && selectedJobId && (
                        <div className="flex flex-col">
                            {applicants.length > 0 ? (
                                applicants.map((student) => (
                                    <div key={student._id} className="flex flex-col sm:flex-row justify-between items-center p-4 md:p-5 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">{student.name}</h3>
                                            <p className="mt-1 text-gray-500 capitalize">{student.degree} | {student.branch}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleViewDetails(student)}
                                            className="mt-3 sm:mt-0 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800"
                                        >
                                            View Details
                                            <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="m9 18 6-6-6-6"></path>
                                            </svg>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="p-6 text-center text-gray-500">No applications have been submitted for this job yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <StudentDetailsModal student={selectedStudent} onClose={handleCloseModal} />
        </>
    );
}

