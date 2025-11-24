import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Reusable Form Components ---

/**
 * A reusable input field component.
 * Reduces boilerplate for common text, email, and number inputs.
 */
const InputField = ({ label, name, value, onChange, type = 'text', required = false, placeholder = '' }) => (
    <div className="mb-6">
        <label htmlFor={name} className="block text-gray-700 mb-2">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={required}
            placeholder={placeholder}
            min={type === 'number' && name === 'graduatingYear' ? new Date().getFullYear() : undefined}
            max={type === 'number' && name === 'graduatingYear' ? new Date().getFullYear() + 10 : undefined}
        />
    </div>
);

/**
 * A reusable select (dropdown) component.
 * Simplifies the creation of dropdown menus from an options array.
 */
const SelectField = ({ label, name, value, onChange, options }) => (
    <div className="mb-6">
        <label htmlFor={name} className="block text-gray-700 mb-2">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);

// --- Main EditProfile Component ---

const EditProfile = () => {
    // Centralized state for all student data
    const [student, setStudent] = useState({
        name: '', email: '', phone: '', gender: '', degree: '',
        branch: '', rollNo: '', cgpi: '', tenthMarks: '',
        twelfthMarks: '', graduatingYear: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true); // For initial data load

    // Fetch student data from the backend when the component mounts
    useEffect(() => {
        const fetchStudentData = async () => {
            setIsFetching(true);
            try {
                const response = await axios.get('http://localhost:3000/api/student/profile', {
                    withCredentials: true // This is crucial for sending the auth cookie
                });

                // THIS IS THE FIX:
                // We will robustly check for the student data in the response.
                // Case 1: The data is nested inside a `data` property (e.g., { data: { student... } })
                // Case 2: The entire response body is the student data itself.
                let profileData = response.data?.data;
                if (!profileData || typeof profileData.name === 'undefined') {
                    if (response.data && typeof response.data.name !== 'undefined') {
                        profileData = response.data;
                    }
                }

                if (profileData) {
                    const sanitizedData = {
                        name: profileData.name || '',
                        email: profileData.email || '',
                        phone: profileData.phone || '',
                        gender: profileData.gender || '',
                        degree: profileData.degree || '',
                        branch: profileData.branch || '',
                        rollNo: profileData.rollNo || '',
                        cgpi: profileData.cgpi || '',
                        tenthMarks: profileData.tenthMarks || '',
                        twelfthMarks: profileData.twelfthMarks || '',
                        graduatingYear: profileData.graduatingYear || '',
                    };
                    setStudent(sanitizedData);
                } else {
                    throw new Error("Profile data not found in the API response.");
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
                alert('Failed to load your profile data. Please try refreshing the page.');
            } finally {
                setIsFetching(false);
            }
        };
        fetchStudentData();
    }, []); // The empty array ensures this runs only once on component mount

    // Generic handler for form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent(prevStudent => ({ ...prevStudent, [name]: value }));
    };

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.put('http://localhost:3000/api/student/complete-profile', student, {
                withCredentials: true // Crucial for authenticating the request
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Form Configuration ---
    const genderOptions = [
        { value: "", label: "Select Gender" }, { value: "male", label: "Male" },
        { value: "female", label: "Female" }, { value: "other", label: "Other" },
    ];
    const degreeOptions = [
        { value: "", label: "Select Degree" }, { value: "btech", label: "B.Tech" },
        { value: "mtech", label: "M.Tech" }, { value: "mba", label: "MBA" },
    ];

    if (isFetching) {
        return <div className="flex justify-center items-center h-screen"><div className="text-xl">Loading Profile...</div></div>;
    }

    return (
        <div>
            {/* <Navbar /> */}
            <div className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Edit Profile</h1>
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        {/* --- Personal Details --- */}
                        <InputField label="Name" name="name" value={student.name} onChange={handleChange} required />
                        <InputField label="Email" name="email" value={student.email} onChange={handleChange} type="email" required />
                        <InputField label="Phone" name="phone" value={student.phone} onChange={handleChange} />
                        <SelectField label="Gender" name="gender" value={student.gender} onChange={handleChange} options={genderOptions} />
                        
                        {/* --- Academic Details --- */}
                        <SelectField label="Degree" name="degree" value={student.degree} onChange={handleChange} options={degreeOptions} />
                        <InputField label="Branch" name="branch" value={student.branch} onChange={handleChange} />
                        <InputField label="Roll No" name="rollNo" value={student.rollNo} onChange={handleChange} />
                        <InputField label="CGPI" name="cgpi" value={student.cgpi} onChange={handleChange} type="number" placeholder="e.g., 8.5" />
                        <InputField label="10th Marks (%)" name="tenthMarks" value={student.tenthMarks} onChange={handleChange} type="number" placeholder="e.g., 95" />
                        <InputField label="12th Marks (%)" name="twelfthMarks" value={student.twelfthMarks} onChange={handleChange} type="number" placeholder="e.g., 92" />
                        
                        <InputField
                            label="Graduating Year" name="graduatingYear" type="number"
                            value={student.graduatingYear} onChange={handleChange} placeholder="e.g., 2025"
                        />
                        
                        <div></div>

                        {/* --- Form Submission --- */}
                        <div className="md:col-span-2 mt-4">
                            <button
                                type="submit"
                                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default EditProfile;

