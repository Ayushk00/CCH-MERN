import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// --- Self-Contained SVG Icons ---
const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);


// --- Job Details Modal Component ---
const JobDetailsModal = ({ job, onClose }) => {
    if (!job) return null;
    
    const renderDetail = (label, value) => (
        <div>
            <p className="font-semibold text-sm text-gray-500">{label}</p>
            <p className="text-gray-800 capitalize">{value || 'N/A'}</p>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-7 rounded-xl shadow-xl w-full max-w-lg m-4">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{job.role}</h2>
                        <p className="text-gray-600 capitalize">{job.type}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl">&times;</button>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderDetail("Location", job.location)}
                        {renderDetail("CTC / Stipend", `${job.ctc.toLocaleString()} INR`)}
                        {renderDetail("Eligible Batch", job.eligibleBatch)}
                        {renderDetail("Minimum CGPA", job.minimumCgpa)}
                        {renderDetail("Eligible Branches", job.eligibleBranches.join(', '))}
                        {renderDetail("Application Deadline", new Date(job.lastDate).toLocaleDateString())}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Delete Confirmation Dialog ---
const DeleteConfirmDialog = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
                <p className="text-gray-600 mb-6">This action cannot be undone. This will permanently delete the job posting.</p>
                <div className="flex justify-end gap-4">
                    <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Delete</button>
                </div>
            </div>
        </div>
    );
};

// --- Toast Notification ---
const Toast = ({ message, type, onClose }) => {
    if (!message) return null;
    const style = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    return (
        <div className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white ${style}`}>
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 font-bold">X</button>
        </div>
    );
};


// --- Main Drives Component ---
export function CCurrentdrives() {
    const [drives, setDrives] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [toast, setToast] = useState({ message: '', type: '' });

    const fetchDrives = useCallback(async () => {
        setIsLoading(true);
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.get('http://localhost:3000/api/company/jobs');
            setDrives(response.data?.data || []);
        } catch (error) {
            setError(error.response?.data?.message || "Error fetching drives.");
            showToast("Error fetching drives.", "error");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDrives();
    }, [fetchDrives]);
    
    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: '' }), 5000);
    };

    const handleDeleteClick = (job) => {
        setJobToDelete(job);
    };

    const confirmDelete = async () => {
        if (!jobToDelete) return;
        try {
            await axios.delete(`http://localhost:3000/api/company/jobs/${jobToDelete._id}`);
            showToast("Job deleted successfully!", "success");
            setJobToDelete(null);
            fetchDrives(); // Refresh the list after deletion
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to delete job.", "error");
            setJobToDelete(null);
        }
    };

    return (
        <>
            {/* Your Navbar and Sidebar would go here */}
            <div className="p-5 md:p-10 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Active Drives</h1>
                
                {isLoading && <p className="text-center text-gray-500">Loading your job postings...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!isLoading && !error && (
                    <div className="space-y-6">
                        {drives.length > 0 ? drives.map((drive) => (
                            <div key={drive._id} className="bg-white p-5 rounded-xl shadow-md border flex flex-col md:flex-row justify-between items-center">
                                <div className="mb-4 md:mb-0">
                                    <h2 className="text-xl font-bold text-gray-800">{drive.role}</h2>
                                    <p className="text-gray-500 capitalize">{drive.type} | {drive.location}</p>
                                    <p className="text-green-600 font-semibold mt-1">{drive.ctc.toLocaleString()} INR</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setSelectedJob(drive)} className="flex items-center justify-center px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
                                        <InfoIcon/> Details
                                    </button>
                                    <button onClick={() => handleDeleteClick(drive)} className="flex items-center justify-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition">
                                        <TrashIcon/> Delete
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 px-4 bg-white rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold text-gray-700">No Active Drives Found</h2>
                                <p className="text-gray-500 mt-2">You haven't posted any jobs yet. Click 'Post Drive' to get started.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
            <DeleteConfirmDialog 
                isOpen={!!jobToDelete}
                onConfirm={confirmDelete}
                onCancel={() => setJobToDelete(null)}
            />
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({message: '', type: ''})} />
            {/* Your Footer would go here */}
        </>
    );
}
