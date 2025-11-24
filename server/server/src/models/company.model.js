import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        trim: true
    },
    logo: {
        type: String,
        trim: true
    },
    jobs: [{
        type: Schema.Types.ObjectId,
        ref: 'Job'
    }],
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    },
    passwordResetToken: {
        type: String
    }
}, {
    timestamps: true
});

companySchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

companySchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

companySchema.methods.generateAccessToken = function () {
    return jwt.sign({
        // THIS IS THE FIX: Changed 'id' to '_id' to match MongoDB's default field name
        _id: this._id,
        name: this.name,
        email: this.email,
        role: 'company'
    }, process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        });
}

companySchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        // THIS IS THE FIX: Changed 'id' to '_id'
        _id: this._id,
    }, process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        });
}

const Company = mongoose.model('Company', companySchema);

export default Company;
