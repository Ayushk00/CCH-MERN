import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

export const RESUME_DIR = path.resolve("uploads", "resumes");
fs.mkdirSync(RESUME_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, RESUME_DIR),
    filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}.pdf`),
});

const uploadResume = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new ApiError(400, "Resume must be a PDF file"));
        }
        cb(null, true);
    },
}).single("resume");

// Wraps multer so its errors (e.g. file too large) reach the JSON error handler as 400s
const handleResumeUpload = (req, res, next) => {
    uploadResume(req, res, (err) => {
        if (!err) return next();
        if (err instanceof multer.MulterError) {
            const message = err.code === "LIMIT_FILE_SIZE" ? "Resume must be 5 MB or smaller" : err.message;
            return next(new ApiError(400, message));
        }
        next(err);
    });
};

export { handleResumeUpload };
