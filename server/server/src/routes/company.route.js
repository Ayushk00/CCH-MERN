import { Router } from "express";
import { verifyCompany } from "../middlewares/auth.middleware.js";
import {
    registerCompany,
    loginCompany,
    logoutCompany,
    getCompanyProfile,
    updateCompanyProfile,
    updateCompanyLogo,
    getCompanyJobs,
    createJob,
    getAppliedCandidates,
    shorlistCandidates,
    getShortlistedCandidates,
    deleteJob,
    updateJob,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshCompanyToken
} from "../controllers/company.controller.js";

const companyRoutes = Router();

companyRoutes.post("/register", registerCompany);
companyRoutes.post("/login", loginCompany);
companyRoutes.post("/logout", verifyCompany, logoutCompany);
companyRoutes.get("/profile", verifyCompany, getCompanyProfile);
companyRoutes.put("/profile", verifyCompany, updateCompanyProfile);
companyRoutes.put("/logo", verifyCompany, updateCompanyLogo);
companyRoutes.get("/jobs", verifyCompany, getCompanyJobs);
companyRoutes.post("/jobs", verifyCompany, createJob);
companyRoutes.get("/jobs/:jobId/candidates", verifyCompany, getAppliedCandidates);
companyRoutes.put("/jobs/:jobId/candidates/:candidateId", verifyCompany, shorlistCandidates);
companyRoutes.get("/jobs/:jobId/shortlisted", verifyCompany, getShortlistedCandidates);
companyRoutes.delete("/jobs/:jobId", verifyCompany, deleteJob);
companyRoutes.put("/jobs/:jobId", verifyCompany, updateJob);
companyRoutes.put("/change-password", verifyCompany, changePassword);
companyRoutes.post("/forgot-password", forgotPassword);
companyRoutes.put("/reset-password", resetPassword);


companyRoutes.post("/refresh-token", refreshCompanyToken);

export default companyRoutes;