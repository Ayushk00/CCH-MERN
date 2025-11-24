import React, { useState } from 'react';
import Navbar from '../../components/student/Navbar';
import Footer from '../../components/Landing/Footer';
import defaultProfilePicture from '/defaultProfilePicture.jpg'; // Add the path to your default profile picture

const CompleteProfile = () => {
    const [step, setStep] = useState(1);
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(defaultProfilePicture);
    const [details, setDetails] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        gender: '',
        degree: '',
        branch: '',
        rollNo: '',
        cgpi: '',
        tenthMarks: '',
        twelfthMarks: '',
        graduatingYear: '',
    });
    const [declaration, setDeclaration] = useState(false);

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log({ profilePicture, details, declaration });
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        setProfilePicturePreview(URL.createObjectURL(file));
    };

    return (
            <div className="flex-grow max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-8 mb-8">
                {step === 1 && (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">Upload Profile Picture</h2>
                        <div className="mb-4">
                            <img
                                src={profilePicturePreview}
                                alt="Profile Preview"
                                className="block mx-auto w-48 h-48 rounded-full object-cover shadow-md"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                                className="block mx-auto p-2 border border-gray-300 rounded cursor-pointer"
                            />
                        </div>
                        <button onClick={handleNext} className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-200">
                            Next
                        </button>
                    </div>
                )}
                {step === 2 && (
                    <div>
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Enter Your Details</h2>
                    <form className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="mb-6 md:col-span-1 lg:col-span-3">
                                <label className="block text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={details.name}
                                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                                    className="block w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="mb-6 md:col-span-1 lg:col-span-2">
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={details.email}
                                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                                    className="block w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="mb-4 md:col-span-2 lg:col-span-2">
                                <label className="block text-gray-700 mb-2">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={details.phone}
                                    onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                                    className="block w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
            
                            <div className="mb-4 md:col-span-2 lg:col-span-2">
                                <label className="block text-gray-700 mb-2">Roll No</label>
                                <input
                                    type="text"
                                    name="rollNo"
                                    value={details.rollNo}
                                    onChange={(e) => setDetails({ ...details, rollNo: e.target.value })}
                                    className="block w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="mb-4 md:col-span-1 lg:col-span-1">
                                <label className="block text-gray-700 mb-2">Gender</label>
                                <select
                                    name="gender"
                                    value={details.gender}
                                    onChange={(e) => setDetails({ ...details, gender: e.target.value })}
                                    className="block w-full p-3 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="mb-4 md:col-span-2 lg:col-span-2">
                                <label className="block text-gray-700 mb-2">Degree</label>
                                <select
                                    name="degree"
                                    value={details.degree}
                                    onChange={(e) => setDetails({ ...details, degree: e.target.value })}
                                    className="block w-full p-3 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Select Degree</option>
                                    <option value="btech">B.Tech</option>
                                    <option value="mtech">M.Tech</option>
                                    <option value="mba">MBA</option>
                                </select>
                            </div>
                            <div className="mb-4 md:col-span-2 lg:col-span-2">
                                <label className="block text-gray-700 mb-2">Branch</label>
                                <input
                                    type="text"
                                    name="branch"
                                    value={details.branch}
                                    onChange={(e) => setDetails({ ...details, branch: e.target.value })}
                                    className="block w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="mb-4 md:col-span-1 lg:col-span-1">
                                <label className="block text-gray-700 mb-2">Graduating Year</label>
                                <input
                                    type="number"
                                    name="graduatingYear"
                                    value={details.graduatingYear}
                                    onChange={(e) => setDetails({ ...details, graduatingYear: e.target.value })}
                                    className="block w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="mb-4 md:col-span-1 lg:col-span-1">
                                <label className="block text-gray-700 mb-2">CGPI</label>
                                <input
                                    type="number"
                                    name="cgpi"
                                    value={details.cgpi}
                                    onChange={(e) => setDetails({ ...details, cgpi: e.target.value })}
                                    className="block w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="mb-4 md:col-span-1 lg:col-span-1">
                                <label className="block text-gray-700 mb-2">10th Marks</label>
                                <input
                                    type="number"
                                    name="tenthMarks"
                                    value={details.tenthMarks}
                                    onChange={(e) => setDetails({ ...details, tenthMarks: e.target.value })}
                                    className="block w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="mb-4 md:col-span-1 lg:col-span-1">
                                <label className="block text-gray-700 mb-2">12th Marks</label>
                                <input
                                    type="number"
                                    name="twelfthMarks"
                                    value={details.twelfthMarks}
                                    onChange={(e) => setDetails({ ...details, twelfthMarks: e.target.value })}
                                    className="block w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button type="button" onClick={handlePrevious} className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition duration-200">
                                Previous
                            </button>
                            <button type="button" onClick={handleNext} className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-200">
                                Next
                            </button>
                        </div>
                    </form>
                </div>)}
                {step === 3 && (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">Declaration</h2>
                        <label className="block mb-6 text-left">
                            <input
                                type="checkbox"
                                checked={declaration}
                                onChange={(e) => setDeclaration(e.target.checked)}
                                className="mr-2"
                            />
                            I declare that the information provided is true and correct.
                        </label>
                        <div className="flex justify-between mt-6">
                            <button type="button" onClick={handlePrevious} className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition duration-200">
                                Previous
                            </button>
                            <button type="button" onClick={handleSubmit} className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition duration-200">
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
    );
};

export default CompleteProfile;