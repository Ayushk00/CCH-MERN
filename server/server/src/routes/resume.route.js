import { Router } from "express";
import fs from "fs";
import path from "path";
import Student from "../models/student.model.js";
import Application from "../models/application.model.js";
import { verifyAnyUser } from "../middlewares/auth.middleware.js";
import { RESUME_DIR } from "../middlewares/upload.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const resumeRoutes = Router();

const sendPdf = (res, fileName, originalName) => {
    const filePath = path.join(RESUME_DIR, path.basename(fileName));
    if (!fs.existsSync(filePath)) {
        throw new ApiError(404, "Resume file not found");
    }
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${(originalName || "resume.pdf").replace(/"/g, "")}"`);
    fs.createReadStream(filePath).pipe(res);
};

// Resume submitted with a specific application: the applicant, the hiring company and admins
resumeRoutes.get("/application/:applicationId", verifyAnyUser, asyncHandler(async (req, res) => {
    const application = await Application.findById(req.params.applicationId);
    if (!application?.resume?.fileName) {
        throw new ApiError(404, "Resume not found");
    }

    const allowed =
        req.role === "admin" ||
        (req.role === "company" && String(application.company) === String(req.user._id)) ||
        (req.role === "student" && String(application.student) === String(req.user._id));
    if (!allowed) {
        throw new ApiError(403, "You are not allowed to view this resume");
    }

    sendPdf(res, application.resume.fileName, application.resume.originalName);
}));

// A student's current profile resume: the student and admins
resumeRoutes.get("/student/:studentId", verifyAnyUser, asyncHandler(async (req, res) => {
    const allowed =
        req.role === "admin" ||
        (req.role === "student" && String(req.params.studentId) === String(req.user._id));
    if (!allowed) {
        throw new ApiError(403, "You are not allowed to view this resume");
    }

    const student = await Student.findById(req.params.studentId).select("resume");
    if (!student?.resume?.fileName) {
        throw new ApiError(404, "Resume not found");
    }
    sendPdf(res, student.resume.fileName, student.resume.originalName);
}));

export default resumeRoutes;
