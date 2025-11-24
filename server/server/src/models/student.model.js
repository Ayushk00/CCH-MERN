import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        // required: true,
        trim: true
    },
    gender: {
        type: String,
        // required: true,
        enum: ['male', 'female', 'other']
    },
    degree: {
        type: String,
        // required: true,
        enum: ['btech', 'mtech', 'mba']
    },
    branch: {
        type: String,
        // required: true
    },
    rollNo: {
        type: String,
        // required: true,
        // unique: true
    },
    cgpi: {
        type: Number,
        // required: true
    },
    tenthMarks: {
        type: Number,
        // required: true
    },
    twelfthMarks: {
        type: Number,
        // required: true
    },
    graduatingYear: {
        type: Number,
        // required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    },  
    isPlaced: {
        type: Boolean,
        default: false
    },
    appliedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
    shortlistedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
    refreshToken: {
        type: String,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    }
}, {
    timestamps: true
});

studentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

studentSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

studentSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            role: 'student'
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

studentSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            role: 'student',
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

studentSchema.methods.generatePasswordResetToken = function () {
    return jwt.sign({ 
        id: this._id, 
        name: this.name,
        email: this.email, 
        role: 'company'
    }, process.env.PASSWORD_RESET_TOKEN_SECRET , 
    { 
        expiresIn: process.env.PASSWORD_RESET_TOKEN_EXPIRY 
    });
}

studentSchema.methods.getAppliedJobs = async function() {
    try {
        const student = await this.populate('appliedJobs').execPopulate();
        return student.appliedJobs;
    } catch (err) {
        throw new Error('Error fetching applied jobs');
    }
};

const Student = mongoose.model('Student', studentSchema);

export default Student;

