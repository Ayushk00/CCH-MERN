import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

// --- Self-Contained API Client with Interceptor ---
// This api instance will be used for all requests from this component.
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
});

// This interceptor is the key fix. It catches 401 errors.
api.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
        const originalRequest = error.config;
        // If the error is a 401 and we haven't retried this request yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark the request to prevent infinite loops
            try {
                // Attempt to get a new access token from the refresh-token endpoint
                await axios.post('http://localhost:3000/api/company/refresh-token', {}, {
                    withCredentials: true,
                });
                // If successful, retry the original failed request
                return api(originalRequest);
            } catch (refreshError) {
                // If the refresh token is also invalid, the user must log in again.
                console.error("Session refresh failed. Please log in again.");
                // You might want to redirect to login here: window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        // For any other errors, just return the error
        return Promise.reject(error);
    }
);

// --- Reusable UI Components ---

const CBanner = () => (
    <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg my-6"></div>
);

const Toast = ({ message, type, onClose }) => {
    if (!message) return null;
    const style = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    return (
        <div className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white ${style}`}>
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 font-bold opacity-70 hover:opacity-100">X</button>
        </div>
    );
};

const FormInput = ({ label, id, value, onChange, placeholder, disabled = false }) => (
    <div className="w-full mt-5">
        <label className="text-sm font-medium text-gray-700" htmlFor={id}>{label}</label>
        <input
            id={id}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
    </div>
);

// --- Main CUpdate Page Component ---

export default function CUpdate() {
    const [formData, setFormData] = useState({ name: "", phone: "", website: "", email: "", address: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    const showToast = useCallback((message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: '' }), 5000);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                // **FIX:** Use the 'api' instance with the interceptor instead of the default 'axios'
                const response = await api.get('/company/profile');
                const profile = response.data.data;
                if (profile) {
                    setFormData({
                        name: profile.name || "",
                        phone: profile.phone || "",
                        website: profile.website || "",
                        email: profile.email || "",
                        address: profile.address || ""
                    });
                } else {
                    showToast("Profile data could not be found.", "error");
                }
            } catch (err) {
                showToast(err.response?.data?.message || "Failed to fetch profile data.", "error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [showToast]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const profilePayload = {
                phone: formData.phone,
                website: formData.website,
                address: formData.address,
            };
            // **FIX:** Use the 'api' instance here as well for the update request
            await api.put('/company/profile', profilePayload);
            showToast("Profile updated successfully!", "success");
            setTimeout(() => navigate('/company/dashboard'), 2000);
        } catch (err) {
            showToast(err.response?.data?.message || "Update failed.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (isLoading) {
        return <div className="text-center p-10 font-semibold text-gray-500">Loading Your Profile...</div>;
    }

    return (
        <>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
            <div className="flex justify-center bg-gray-50 min-h-screen">
                <div className="w-full max-w-4xl p-4 md:p-8">
                    <h1 className="text-3xl font-bold text-gray-800">Update Company Profile</h1>
                    <p className="mt-2 text-gray-600">Fill in the remaining details for your company.</p>
                    {/* <CBanner /> */}
                    <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-lg shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <FormInput 
                                label="Company Name"
                                id="name"
                                value={formData.name}
                                disabled
                            />
                             <FormInput 
                                label="Email"
                                id="email"
                                value={formData.email}
                                disabled
                            />
                            <FormInput 
                                label="Contact Number"
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="e.g., +91 1234567890"
                            />
                            <FormInput 
                                label="Website"
                                id="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                placeholder="https://your-company.com"
                            />
                        </div>
                        <div className="w-full mt-5">
                            <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
                            <textarea 
                                id="address" 
                                value={formData.address}
                                onChange={handleInputChange}
                                className="mt-1 py-2 px-3 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500" 
                                rows="3" 
                                placeholder="Enter your company's full address"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="mt-8 py-3 px-6 inline-flex items-center justify-center text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Save and Update Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

