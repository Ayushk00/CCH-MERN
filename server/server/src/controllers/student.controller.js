import {asyncHandler} from '../utils/asyncHandler.js';
import Student from '../models/student.model.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import Job from '../models/job.model.js';

const generateAccessRefreshToken = async (studentId) => {
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            throw new ApiError(404, "Student not found");
        }

        const accessToken = student.generateAccessToken();
        const refreshToken = student.generateRefreshToken();

        student.refreshToken = refreshToken;
        await student.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500,error, "Token generation failed");
    }
};

const registerStudent = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password should be at least 6 characters long");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
        throw new ApiError(400, "Name should contain only alphabets and spaces");
    }

    const studentExists = await Student.findOne({ email });
    if (studentExists) {
        throw new ApiError(400, "Student already exists");
    }

    const student = await Student.create({ name, email, password });

    const createdStudent = await Student.findOne({ email }).select("-password -refreshToken" );
    if (!createdStudent) {
        throw new ApiError(500, "Student registration failed");
    }

    const response = new ApiResponse(201, createdStudent);
    res.status(response.statusCode).json(response);
});

const loginStudent = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const student = await Student.findOne({ email });
    if (!student) {
        throw new ApiError(401, "Student not found");
    }

    const isValidPassword = await student.isValidPassword(password);

    if (!isValidPassword) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessRefreshToken(student._id);

    const loggedinStudent = await Student
        .findById(student._id)
        .select("-password -refreshToken -passwordResetToken");
    
    const options = {
        httpOnly: true,
        secure: true
    };

    res.
    status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                student: loggedinStudent , accessToken, refreshToken,
            },
            "Student logged in successfully"
        )
    );
});

const logoutStudent = asyncHandler(async (req, res) => {
    await Student.findByIdAndUpdate(req.student._id, { refreshToken: undefined });
    res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "Student logged out successfully"));
});

const getStudentProfile = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.student._id).select("-password -refreshToken -passwordResetToken");
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const response = new ApiResponse(200, student);
    res.status(response.statusCode).json(response);
});

const completeStudentProfile = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.student._id);
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const { name, rollNo, degree, cgpi, tenthMarks, twelfthMarks, graduatingYear, branch, phone } = req.body;

    if (!name || !rollNo || !degree || !cgpi || !tenthMarks || !twelfthMarks || !graduatingYear || !branch || !phone) {
        throw new ApiError(400, "All fields are required");
    }

    student.name = name;
    student.rollNo = rollNo;
    student.degree = degree;
    student.cgpi = cgpi;
    student.tenthMarks = tenthMarks;
    student.twelfthMarks = twelfthMarks;
    student.graduatingYear = graduatingYear;
    student.branch = branch;
    student.phone = phone;

    student.isProfileComplete = true;
    await student.save({ validateBeforeSave: false });

    const response = new ApiResponse(200, {}, "Profile completed successfully");
    res.status(response.statusCode).json(response);
});

const updateStudentPassword = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.student._id);
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "All fields are required");
    }

    const isValidPassword = await student.isValidPassword(oldPassword);
    if (!isValidPassword) {
        throw new ApiError(401, "Invalid old password");
    }

    student.password = newPassword;
    await student.save();

    const response = new ApiResponse(200, {}, "Password updated successfully");
    res.status(response.statusCode).json(response);
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const student = await Student.findOne({
        email
    });

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const resetToken = student.generatePasswordResetToken();
    await student.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/students/resetpassword/${resetToken}`;

    // Send email with resetUrl
    const response = new ApiResponse(200, { resetUrl }, "Password reset link sent to email");
    res.status(response.statusCode).json(response);
});

const resetPassword = asyncHandler(async (req, res) => {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    if (!resetToken || !newPassword) {
        throw new ApiError(400, "All fields are required");
    }

    const hashedToken = Student.hashPasswordResetToken(resetToken);

    const student = await Student.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!student) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    student.password = newPassword;
    student.passwordResetToken = undefined;
    student.passwordResetExpires = undefined;
    await student.save();

    const response = new ApiResponse(200, {}, "Password reset successful");
    res.status(response.statusCode).json(response);
});

const getAppliedJobsByStudent = asyncHandler(async (req, res) => {
    try {
        const studentId = req.student._id;
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const appliedJobs = await Job.aggregate([
            { $match: { appliedStudents: studentId } },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'companyDetails'
                }
            },
            { $unwind: '$companyDetails' },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    role: 1,
                    description: 1,
                    createdDate: 1,
                    lastDate: 1,
                    ctc: 1,
                    location: 1,
                    minimumCgpa: 1,
                    eligibleBranches: 1,
                    eligibleBatch: 1,
                    companyDetails: {
                        name: 1,
                        email: 1,
                        phone: 1
                    }
                }
            }
        ]);

        res.status(200).json(appliedJobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const applyJob = asyncHandler(async (req, res) => {
    const { id: jobId } = req.params;
    const studentId = req.student._id;

    try {
        // Fetch student and job documents
        const student = await Student.findById(studentId);
        if (!student) {
            throw new ApiError(404, "Student not found");
        }

        const job = await Job.findById(jobId);
        if (!job) {
            throw new ApiError(404, "Job not found");
        }

        // Check if the student has already applied
        if (student.appliedJobs.includes(jobId)) {
            throw new ApiError(400, "You have already applied for this job");
        }

        // Update both documents
        job.appliedStudents.push(student._id);
        student.appliedJobs.push(jobId);

        // Save the changes
        await job.save();
        await student.save();

        const response = new ApiResponse(200, {}, "Job applied successfully");
        res.status(response.statusCode).json(response);

    } catch (error) {
        // Re-throw specific API errors or a generic server error
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, error.message || "Job application failed due to a server error.");
    }
});

const withdrawApplication = asyncHandler(async (req, res) => {
    const { id: jobId } = req.params;
    const studentId = req.student._id;

    try {
        // Fetch both documents
        const student = await Student.findById(studentId);
        if (!student) {
            throw new ApiError(404, "Student not found");
        }
        
        // Check if the student has actually applied for this job
        if (!student.appliedJobs.includes(jobId)) {
            throw new ApiError(400, "You have not applied for this job");
        }

        const job = await Job.findById(jobId);

        // Update the student's applied jobs list
        student.appliedJobs = student.appliedJobs.filter(
            (appliedJobId) => appliedJobId.toString() !== jobId
        );
        await student.save();

        // Update the job's list of applicants if the job exists
        if (job) {
            job.appliedStudents = job.appliedStudents.filter(
                (id) => id.toString() !== student._id.toString()
            );
            await job.save();
        }

        const response = new ApiResponse(200, {}, "Application withdrawn successfully");
        res.status(response.statusCode).json(response);
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, error.message || "Application withdrawal failed due to a server error.");
    }
});

const getShortlistedJobsByStudent = asyncHandler(async (req, res) => {
    try {
        const studentId = req.student._id;
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const shortlistedJobs = await Job.aggregate([
            { $match: { shortlistedStudents: studentId } },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'companyDetails'
                }
            },
            { $unwind: '$companyDetails' },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    role: 1,
                    description: 1,
                    createdDate: 1,
                    lastDate: 1,
                    ctc: 1,
                    location: 1,
                    minimumCgpa: 1,
                    eligibleBranches: 1,
                    eligibleBatch: 1,
                    companyDetails: {
                        name: 1,
                        email: 1,
                        phone: 1
                    }
                }
            }
        ]);

        res.status(200).json(shortlistedJobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const refreshStudentToken = asyncHandler(async (req, res) => {
    const  refreshToken  = req.cookies?.refreshToken;
    if (!refreshToken) {
        throw new ApiError(401, "Refresh token not provided");
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const student = await Student.findOne({ _id: decoded._id, refreshToken });
        if (!student) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (student.refreshToken !== refreshToken) {
            throw new ApiError(401, "Refresh token revoked");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessRefreshToken(student._id);

        const loggedinStudent = await Student
            .findById(student._id)
            .select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true
        };

        res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    student: loggedinStudent,
                    accessToken,
                    refreshToken: newRefreshToken
                },
                "Access token refreshed successfully"
            )
        );
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }
});

const getActiveJobs = asyncHandler(async (req, res) => {
    const student = req.student;

    if (!student || !student.isProfileComplete) {
        throw new ApiError(400, "Please complete your profile to view eligible jobs.");
    }

    // Base query for active jobs matching batch and branch
    let eligibleJobsQuery = Job.find({
        lastDate: { $gte: new Date() },
        eligibleBatch: student.graduatingYear,
        eligibleBranches: { $in: [student.branch] },
    }).populate('company', 'name');

    let jobs = await eligibleJobsQuery;

    // **FIX:** Filter by CGPA in the application code to handle string vs number comparison
    const filteredJobs = jobs.filter(job => {
        const minimumCgpa = parseFloat(job.minimumCgpa);
        if (isNaN(minimumCgpa)) return false; // Skip jobs with invalid CGPA data
        return student.cgpi >= minimumCgpa;
    });

    res.status(200).json(
         new ApiResponse(200, filteredJobs, "Eligible jobs fetched successfully")
    );
});

export {
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
};