import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// --- Self-Contained API Client with Interceptor ---
// This ensures that API calls are automatically authenticated and tokens are refreshed.
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.post('http://localhost:3000/api/company/refresh-token', {}, {
                    withCredentials: true,
                });
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Session refresh failed.");
                // Optionally redirect to login page
                // window.location.href = '/company/login'; 
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);


// --- SVG Icons for Dashboard Cards ---
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ClipboardCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002-2h2a2 2 0 002 2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;


// --- Reusable Stat Card Component ---
const StatCard = ({ title, value, icon, children }) => (
    <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
            <h2 className="text-xl font-semibold text-gray-600 mb-1">{title}</h2>
            <div className="text-3xl font-bold text-gray-800">{value}</div>
            {children}
        </div>
    </div>
);


// --- Main Dashboard Component ---
function CDashboard() {
    const [companyName, setCompanyName] = useState('Recruiter');
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalApplied: 0,
        totalShortlisted: 0,
        isProfileComplete: false,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Fetch jobs and profile data in parallel for better performance
                const [jobsResponse, profileResponse] = await Promise.all([
                    api.get('/company/jobs'),
                    api.get('/company/profile')
                ]);

                const jobs = jobsResponse.data.data || [];
                const profile = profileResponse.data.data || {};
                
                // Set the company name from the profile for the welcome message
                setCompanyName(profile.name || 'Recruiter');
                
                // Calculate stats from the fetched data
                const activeJobsCount = jobs.filter(job => new Date(job.lastDate) >= new Date()).length;
                const totalAppliedCount = jobs.reduce((sum, job) => sum + (job.appliedStudents?.length || 0), 0);
                const totalShortlistedCount = jobs.reduce((sum, job) => sum + (job.shortlistedStudents?.length || 0), 0);

                setStats({
                    activeJobs: activeJobsCount,
                    totalApplied: totalAppliedCount,
                    totalShortlisted: totalShortlistedCount,
                    isProfileComplete: profile.isProfileComplete || false,
                });

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
                // Handle error state if needed, e.g., show a toast notification
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Memoize the welcome message so it doesn't recalculate on every render
    const welcomeMessage = useMemo(() => `Welcome, ${companyName}!`, [companyName]);

    if (isLoading) {
        return <div className="text-center p-10 font-semibold text-gray-500">Loading Dashboard...</div>;
    }

    return (
        <div className="flex flex-col p-8 m-4 bg-gray-100 rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">{welcomeMessage}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                
                <StatCard title="Active Jobs" value={stats.activeJobs} icon={<BriefcaseIcon />} />
                
                <StatCard title="Total Applicants" value={stats.totalApplied} icon={<UsersIcon />} />

                <StatCard title="Shortlisted Candidates" value={stats.totalShortlisted} icon={<ClipboardCheckIcon />} />
                
                {stats.isProfileComplete ? (
                     <StatCard title="Profile Status" value="Complete" icon={<CheckCircleIcon />} />
                ) : (
                    <StatCard title="Profile Status" value="Incomplete" icon={<AlertTriangleIcon />}>
                       <Link to="/company/update-profile" className="text-sm text-blue-600 hover:underline mt-1 block">
                           Click here to complete it
                       </Link>
                    </StatCard>
                )}
            </div>
        </div>
    );
}

export default CDashboard;

