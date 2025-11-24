import {asyncHandler} from '../utils/asyncHandler.js';
import Student from '../models/student.model.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import Job from '../models/job.model.js';
import Company from '../models/company.model.js'

const generateAccessRefreshTokens = async (companyId) => {
    try {
        const company = await Company.findById(companyId);
        if (!company) {
            throw new ApiError(404, 'Company not found');
        }

        const accessToken = company.generateAccessToken();
        const refreshToken = company.generateRefreshToken();
        company.refreshToken = refreshToken;
        await company.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, 'Token generation failed');
    }
};

const registerCompany = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, 'All fields are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, 'Invalid email format');
    }

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
        throw new ApiError(400, 'Company already registered with this email');
    }

    await Company.create({ name, email, password });
    
    const createdCompany = await Company.findOne({ email }).select('-password -refreshToken');
    if (!createdCompany) {
        throw new ApiError(500, 'Company registration failed');
    }


    res.status(201).json(new ApiResponse(201, 'Company registered successfully', createdCompany));
});

const loginCompany = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'All fields are required');
    }

    const company = await Company.findOne({ email });
    if (!company) {
        throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await company.isValidPassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid email or password');
    }

    const { accessToken, refreshToken } = await generateAccessRefreshTokens(company._id);
    
    const loggedInCompany = await Company.findById(company._id).select('-password -refreshToken');

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    res.
    status(200).
    cookie('refreshToken', refreshToken, options).
    cookie('accessToken', accessToken, options).
    json(new ApiResponse(
        200,
        'Company logged in successfully', 
        { 
            accessToken, refreshToken, company: loggedInCompany 
        })
    ); 
});

const logoutCompany = asyncHandler(async (req, res) => {
    await Company.findByIdAndUpdate(req.company._id, { refreshToken: undefined });
    res.
    status(200).
    clearCookie('refreshToken').
    clearCookie('accessToken').
    json(new ApiResponse(200, 'Company logged out successfully'));
});

const getCompanyProfile = asyncHandler(async (req, res) => {
    const company = await Company.findById(req.company._id).select('-password -refreshToken');
    if (!company) {
        throw new ApiError(404, 'Company not found');
    }

    res.status(200).json(new ApiResponse(200, 'Company profile retrieved successfully', company));
});

const updateCompanyProfile = asyncHandler(async (req, res) => {
    const { name, address, website, phone } = req.body;

    if (!name && !website && !address && !phone) {
        throw new ApiError(400, 'At least one field is required');
    }

    const company = await Company.findById(req.company._id);
    if (!company) {
        throw new ApiError(404, 'Company not found');
    }

    if(name) company.name = name;
    if(address) company.address = address;
    if(website) company.website = website;
    if(phone) company.phone = phone;

    const requiredFileds = ['name', 'address', 'website', 'phone'];
    const isProfileComplete = requiredFileds.every(field => company[field]);
    company.isProfileComplete = isProfileComplete;

    await company
    .save({ validateBeforeSave: false });
    res.status(200).json(new ApiResponse(200, 'Company profile updated successfully', company));
});

const updateCompanyLogo = asyncHandler(async (req, res) => {
    const company = await Company.findById(req.company._id);
    if (!company) {
        throw new ApiError(404, 'Company not found');
    }

    company.logo = req.file.path;
    await company.save({ validateBeforeSave: false });

    res.status(200).json(new ApiResponse(200, 'Company logo updated successfully', company));
});

const getCompanyJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ company: req.company._id });
    if (!jobs) {
        throw new ApiError(404, 'No jobs found');
    }

    // **FIX:** Swapped the 'data' and 'message' arguments to ensure a consistent API response.
    // The 'jobs' array is now correctly passed as the data payload.
    res.status(200).json(new ApiResponse(200, jobs, 'Company jobs retrieved successfully'));
});

const createJob = asyncHandler(async (req, res) => {
    const {
        type,
        ctc, // Renamed from salary for consistency with the model
        eligibleBranches, // Renamed from eligiblebranches
        lastDate, // Renamed from deadline
        role,
        location,
        eligibleBatch,
        minimumCgpa, // Renamed from qualification
    } = req.body;

    // Validate required fields
    const requiredFields = { type, ctc, eligibleBranches, lastDate, role, location, eligibleBatch, minimumCgpa };
    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value || String(value).trim() === "") {
            throw new ApiError(400, `${key} is a required field.`);
        }
    }
    
    // Convert comma-separated string of branches to an array
    const eligibleBranchesArray = eligibleBranches.split(',').map(branch => branch.trim().toLowerCase());

    // --- FIX FOR THE DATE ---
    // Create a date object from the YYYY-MM-DD string
    const deadlineDate = new Date(lastDate);
    // Set the time to the end of that day in the server's local timezone
    deadlineDate.setHours(23, 59, 59, 999);
    // Mongoose will automatically convert this to UTC upon saving

    const job = await Job.create({
        company: req.company._id,
        type,
        ctc: Number(ctc), // Ensure ctc is saved as a number
        eligibleBranches: eligibleBranchesArray,
        lastDate: deadlineDate, // Use the adjusted date object
        role,
        location,
        eligibleBatch: Number(eligibleBatch), // Ensure batch is a number
        minimumCgpa,
    });

    if (!job) {
        throw new ApiError(500, 'Job creation failed. Please try again.');
    }

    const company = await Company.findById(req.company._id);
    if (company) {
        company.jobs.push(job._id);
        await company.save({ validateBeforeSave: false });
    }
    const createdJob = await Job.findById(job._id).populate('company', 'name email');

    if (!createdJob) {
        throw new ApiError(500, 'Failed to retrieve created job details.');
    }
    
    return res.status(201).json(new ApiResponse(201, createdJob, 'Job created successfully'));
});

const getAppliedCandidates = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    // **FIX:** Use .populate() to get the full student documents directly.
    // This is more efficient than a separate Student.find() query.
    const job = await Job.findById(jobId).populate('appliedStudents');

    if (!job) {
        throw new ApiError(404, 'Job not found');
    }

    const isCreatedBySameCompany = job.company.toString() === req.company._id.toString();
    if (!isCreatedBySameCompany) {
        throw new ApiError(403, 'You are not authorized to view candidates for this job');
    }

    // The full student documents are now in job.appliedStudents
    const candidates = job.appliedStudents;

    // It's not an error if no one applied, just return an empty array.
    if (!candidates || candidates.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], 'No candidates have applied yet.'));
    }

    res.status(200).json(new ApiResponse(200, candidates, 'Candidates retrieved successfully'));
});

const shorlistCandidates = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
        throw new ApiError(404, 'Job not found');
    }

    const isCreatedBySameCompany = job.company.toString() === req.company._id.toString();
    if (!isCreatedBySameCompany) {
        throw new ApiError(403, 'You are not authorized to shortlist candidates for this job');
    }

    const students = await Student.find({ jobs: job._id });
    if (!students) {
        throw new ApiError(404, 'No candidates found');
    }
    try {
        const shortlistedStudents = students.filter(student => req.body.students.includes(student._id));
        job.shortlistedStudents = shortlistedStudents.map(student => student._id);
        await job.save({ validateBeforeSave: false });

        await Student.updateMany(
            { _id: { $in: shortlistedStudents.map(student => student._id) } },
            { $addToSet: { shortlistedJobs: job._id } }
        );
    } catch (error) {
        throw new ApiError(500, 'Shortlisting candidates failed');
    }

    res.status(200).json(new ApiResponse(200, 'Candidates shortlisted successfully', job.shortlistedStudents));
});

const getShortlistedCandidates = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
        throw new ApiError(404, 'Job not found');
    }

    const isCreatedBySameCompany = job.company.toString() === req.company._id.toString();
    if (!isCreatedBySameCompany) {
        throw new ApiError(403, 'You are not authorized to view shortlisted candidates for this job');
    }

    const students = await Student.find({ shortlistedJobs: job._id });
    if (!students) {
        throw new ApiError(404, 'No shortlisted candidates found');
    }

    res.status(200).json(new ApiResponse(200, 'Shortlisted candidates retrieved successfully', students));
});

const deleteJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
        throw new ApiError(404, 'Job not found');
    }

    // Verify that the job belongs to the company making the request
    const isCreatedBySameCompany = job.company.toString() === req.company._id.toString();
    if (!isCreatedBySameCompany) {
        throw new ApiError(403, 'You are not authorized to delete this job');
    }

    // **FIX:** Use the modern findByIdAndDelete method instead of the deprecated .remove()
    await Job.findByIdAndDelete(jobId);

    // Also, pull this job's ID from any students who applied or were shortlisted
    await Student.updateMany(
        { $or: [{ appliedJobs: jobId }, { shortlistedJobs: jobId }] },
        { $pull: { appliedJobs: jobId, shortlistedJobs: jobId } }
    );

    res.status(200).json(new ApiResponse(200, {}, 'Job deleted successfully'));
});

const updateJob = asyncHandler(async (req, res) => {
    const { title, description, location, salary, deadline } = req.body;

    if (!title || !description || !location || !salary || !deadline) {
        throw new ApiError(400, 'All fields are required');
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
        throw new ApiError(404, 'Job not found');
    }

    const isCreatedBySameCompany = job.company.toString() === req.company._id.toString();
    if (!isCreatedBySameCompany) {
        throw new ApiError(403, 'You are not authorized to update this job');
    }

    job.title = title;
    job.description = description;
    job.location = location;
    job.salary = salary;
    job.deadline = deadline;

    await job.save({ validateBeforeSave: false });
    res.status(200).json(new ApiResponse(200, 'Job updated successfully', job));
});

const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, 'All fields are required');
    }

    const company = await Company.findById(req.company._id);
    if (!company) {
        throw new ApiError(404, 'Company not found');
    }

    const isPasswordValid = await company.isValidPassword(currentPassword);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid current password');
    }

    company.password = newPassword;
    await company.save();

    res.status(200).json(new ApiResponse(200, 'Password updated successfully'));
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, 'Email is required');
    }

    const company = await Company.findOne({ email });
    if (!company) {
        throw new ApiError(404, 'Company not found');
    }

    company.generatePasswordResetToken();
    await company.save({ validateBeforeSave: false });

    // send email with reset token
    res.status(200).json(new ApiResponse(200, 'Password reset token sent to email'));
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const resetToken = req.params.resetToken;

    if (!password) {
        throw new ApiError(400, 'Password is required');
    }

    const company = await Company.findOne({ passwordResetToken: resetToken });
    if (!company) {
        throw new ApiError(404, 'Company not found');
    }

    company.password = password;
    company.passwordResetToken = undefined;
    await company.save();

    res.status(200).json(new ApiResponse(200, 'Password reset successfully'));
});

const refreshCompanyToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized: No refresh token provided");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const company = await Company.findById(decodedToken._id);

        if (!company || company.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Invalid or expired refresh token");
        }
        
        const { accessToken, refreshToken } = await generateAccessRefreshTokens(company._id);

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "Token refreshed successfully"));

    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }
});

export {
    generateAccessRefreshTokens,
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
};