import { Router } from "express";
import { verifyStudent } from '../middlewares/auth.middleware.js';
import {
    registerStudent,
    loginStudent,
    logoutStudent,
    getStudentProfile,
    completeStudentProfile,
    updateStudentPassword,
    forgotPassword,
    resetPassword,
    applyJob,
    withdrawApplication,
    getAppliedJobsByStudent,
    getShortlistedJobsByStudent,
    refreshStudentToken,
    getActiveJobs
} from '../controllers/student.controller.js';

const studentRoutes = Router();

studentRoutes.post('/register', registerStudent);
studentRoutes.post('/login', loginStudent);
studentRoutes.post('/logout', verifyStudent, logoutStudent);
studentRoutes.post('/refresh-token', refreshStudentToken);
studentRoutes.get('/profile', verifyStudent, getStudentProfile);
studentRoutes.put('/complete-profile', verifyStudent, completeStudentProfile);
studentRoutes.put('/password', verifyStudent, updateStudentPassword);
studentRoutes.post('/forgot-password', forgotPassword);
studentRoutes.post('/reset-password', resetPassword);
studentRoutes.post('/apply-job/:id', verifyStudent, applyJob);
studentRoutes.post('/withdraw-application/:id', verifyStudent, withdrawApplication);
studentRoutes.get('/applied-jobs', verifyStudent, getAppliedJobsByStudent);
studentRoutes.get('/shortlisted-jobs', verifyStudent, getShortlistedJobsByStudent);
studentRoutes.get('/jobs', verifyStudent, getActiveJobs);

export default studentRoutes;