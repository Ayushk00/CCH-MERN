import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../../components/student/Navbar';
import Footer from '../../components/Landing/Footer';
import { Outlet } from "react-router-dom";
import { useAuth } from '../../utility/AuthContext';

function Student() {
    const { user, role } = useAuth();

    // console.log(user);
    // console.log(role);
    
    // useEffect(() => {
    //     if (!user.isProfileComplete) {
    //         return <Navigate to="/student/complete-profile" />;
    //     }
    // }, [user]);


    return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-grow container mx-auto">
                    <Outlet />
                </div>
                <Footer />
            </div>
    )
};

export default Student;