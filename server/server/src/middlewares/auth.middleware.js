import jwt from 'jsonwebtoken';
import Student from '../models/student.model.js'; 
import Company from '../models/company.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const verifyUser = (role, Model) => asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, 'Token not provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (decoded.role !== role) {
            throw new ApiError(401, `You are not authorized to access this route as a ${role}`);
        }

        const user = await Model.findOne({ _id: decoded._id }).select('-password -refreshtoken -passwordResetToken');

        if (!user) {
            throw new ApiError(401, 'Please authenticate');
        }

        req[role] = user;
        next();
    } catch (error) {
        throw new ApiError(401, 'Please authenticate');
    }
});

const verifyStudent = verifyUser('student', Student);
const verifyCompany = verifyUser('company', Company);

export { verifyStudent, verifyCompany };
