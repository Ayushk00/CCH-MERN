import Student from '../models/student.model.js';
import Company from '../models/company.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

const generateAccessRefreshTokens = async (userId, role) => {
    try {
        let user;
        if (role === 'company') {
            user = await Company.findById(userId);
        } else if (role === 'student') {
            user = await Student.findById(userId);
        } else {
            throw new ApiError(400, 'Invalid role');
        }

        if (!user) {
            throw new ApiError(404, `${role.charAt(0).toUpperCase() + role.slice(1)} not found`);
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, 'Token generation failed');
    }
};

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }
  
    let user;
    let role;
  
    user = await Company.findOne({ email });
    if (user) {
      role = 'company';
    } else {
      user = await Student.findOne({ email });
      if (user) {
        role = 'student';
      }
    }
  
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }
  
    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }
  
    const { accessToken, refreshToken } = await generateAccessRefreshTokens(user._id, role);
  
    let loggedInUser;
    if (role === 'company') {
      loggedInUser = await Company.findById(user._id).select('-password -refreshToken -passwordResetToken');
    } else if (role === 'student') {
      loggedInUser = await Student.findById(user._id).select('-password -refreshToken -passwordResetToken');
    }
  
    const options = {
      httpOnly: true,
      secure:true, // Set secure flag in production
      sameSite: 'None',
    };
  
    res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json(new ApiResponse(
        200,
        `${role.charAt(0).toUpperCase() + role.slice(1)} logged in successfully`,
        { accessToken, refreshToken, user: loggedInUser, role, name: loggedInUser.name }
      ));
  });

const logout = asyncHandler(async (req, res) => {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, 'Token not provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        let Model;
        if(decoded.role  === 'student'){
            Model = Student;
        }else if(decoded.role === 'company'){
            Model = Company;
        }

        await Model.findByIdAndUpdate( {_id: decoded._id},{ refreshToken: undefined });
        res
            .status(200)
            .clearCookie('accessToken')
            .clearCookie('refreshToken')
            .json(new ApiResponse(200, `${decoded.role.charAt(0).toUpperCase() + decoded.role.slice(1)} logged out successfully`));
    } catch (error) {
        throw new ApiError(401,error ,'Please authenticate');
    }
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "");
  
    if (!token) {
      throw new ApiError(401, 'Token not provided');
    }
  
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      let user;
      if (decoded.role === 'student') {
        user = await Student.findById(decoded._id).select('-password -refreshToken -passwordResetToken');
      } else if (decoded.role === 'company') {
        user = await Company.findById(decoded._id).select('-password -refreshToken -passwordResetToken');
      }
  
      if (!user) {
        throw new ApiError(404, 'User not found');
      }
  
      res.status(200).json(new ApiResponse(200, 'User fetched successfully', { user, role: decoded.role }));
    } catch (error) {
      throw new ApiError(401, 'Please authenticate');
    }
  });

  const authMe = asyncHandler(async (req, res) => {
    if (req.cookies.accessToken) {
      res.json({ authenticated: true });
    } else {
      res.json({ authenticated: false });
    }
  })

  const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        throw new ApiError(400, 'All fields are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, 'Invalid email format');
    }

    let user;
    if (role === 'student') {
        const studentExists = await Student.findOne({ email });
        if (studentExists) {
            throw new ApiError(400, 'Student already exists');
        }
        user = await Student.create({ name, email, password });
    } else if (role === 'company') {
        const companyExists = await Company.findOne({ email });
        if (companyExists) {
            throw new ApiError(400, 'Company already registered with this email');
        }
        user = await Company.create({ name, email, password });
    } else {
        throw new ApiError(400, 'Invalid role');
    }

    const createdUser = await (role === 'student' ? Student : Company).findOne({ email }).select('-password -refreshToken');
    if (!createdUser) {
        throw new ApiError(500, `${role.charAt(0).toUpperCase() + role.slice(1)} registration failed`);
    }

    res.status(201).json(new ApiResponse(201, `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`, createdUser));
});


export { login, logout,getCurrentUser , register, authMe};