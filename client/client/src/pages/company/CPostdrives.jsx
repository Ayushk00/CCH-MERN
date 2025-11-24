import React, { useState } from "react";
// Removed CBanner as the code was not provided
import axios from "axios";

// A simple toast notification component
const Toast = ({ message, type, onclose }) => {
    if (!message) return null;
    const baseStyle = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white transition-opacity duration-300 z-50";
    const typeStyle = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`${baseStyle} ${typeStyle}`}>
            <span>{message}</span>
            <button onClick={onclose} className="ml-4 font-bold">X</button>
        </div>
    );
};


export default function CPostdrives() {
    // Use an object for form state for cleaner management
    const [formData, setFormData] = useState({
        type: 'full-time',
        ctc: '',
        eligibleBranches: '',
        lastDate: '',
        role: '',
        location: '',
        eligibleBatch: '',
        minimumCgpa: ''
    });
    const [toast, setToast] = useState({ message: '', type: '' });

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: '' }), 5000);
    };

    // Single handler for all input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handlePostDrive = (e) => {
        e.preventDefault();

        // Basic validation
        for (const key in formData) {
            if (!formData[key]) {
                showToast(`Please fill out the ${key} field.`, 'error');
                return;
            }
        }

        axios.post('http://localhost:3000/api/company/jobs', formData, {
            withCredentials: true
        })
        .then(res => {
            showToast(res.data.message || "Drive posted successfully!", 'success');
            // Optionally clear the form
            setFormData({
                type: 'full-time', ctc: '', eligibleBranches: '', lastDate: '',
                role: '', location: '', eligibleBatch: '', minimumCgpa: ''
            });
        })
        .catch(err => {
            showToast(err.response?.data?.message || "An error occurred.", 'error');
            console.error("Error is: ", err);
        });
    };

    return (
        <>
            <Toast message={toast.message} type={toast.type} onclose={() => setToast({ message: '', type: '' })} />
            <div className="flex justify-center bg-gray-50 py-10">
                <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-gray-800">Post a New Drive</h1>
                    <p className="mt-2 text-gray-600">Fill in the details below to create a new job opening.</p>
                    
                    {/* Form starts here */}
                    <form onSubmit={handlePostDrive} className="mt-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Role */}
                            <div>
                                <label htmlFor="role" className="text-sm font-medium text-gray-700">Role</label>
                                <input id="role" type="text" placeholder="e.g., Software Engineer" value={formData.role} onChange={handleChange} className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                            </div>

                            {/* Job Type */}
                            <div>
                                <label htmlFor="type" className="text-sm font-medium text-gray-700">Job Type</label>
                                <select id="type" value={formData.type} onChange={handleChange} className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    <option value="full-time">Full-time</option>
                                    <option value="internship">Internship</option>
                                    <option value="part-time">Part-time</option>
                                </select>
                            </div>

                            {/* CTC/Stipend */}
                            <div>
                                <label htmlFor="ctc" className="text-sm font-medium text-gray-700">CTC / Stipend (in INR)</label>
                                <input id="ctc" type="number" placeholder="e.g., 1200000" value={formData.ctc} onChange={handleChange} className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                            </div>
                            
                            {/* Deadline */}
                            <div>
                                <label htmlFor="lastDate" className="text-sm font-medium text-gray-700">Application Deadline</label>
                                <input id="lastDate" type="date" value={formData.lastDate} onChange={handleChange} className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                            </div>

                            {/* Eligible Branches */}
                            <div className="md:col-span-2">
                                <label htmlFor="eligibleBranches" className="text-sm font-medium text-gray-700">Eligible Branches (comma-separated)</label>
                                <input id="eligibleBranches" type="text" placeholder="e.g., cse, it, ece" value={formData.eligibleBranches} onChange={handleChange} className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                            </div>

                             {/* Location */}
                             <div>
                                <label htmlFor="location" className="text-sm font-medium text-gray-700">Location</label>
                                <input id="location" type="text" placeholder="e.g., Bengaluru, Remote" value={formData.location} onChange={handleChange} className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                            </div>

                            {/* Eligible Batch */}
                            <div>
                                <label htmlFor="eligibleBatch" className="text-sm font-medium text-gray-700">Eligible Batch (Year)</label>
                                <input id="eligibleBatch" type="number" placeholder="e.g., 2025" value={formData.eligibleBatch} onChange={handleChange} className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                            </div>
                           
                            {/* Minimum CGPA */}
                             <div className="md:col-span-2">
                                <label htmlFor="minimumCgpa" className="text-sm font-medium text-gray-700">Minimum CGPA Required</label>
                                <input id="minimumCgpa" type="text" placeholder="e.g., 7.5" value={formData.minimumCgpa} onChange={handleChange} className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                             <button type="submit" className="w-full py-3 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                Create Drive
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
