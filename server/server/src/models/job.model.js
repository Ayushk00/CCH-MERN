import mongoose from "mongoose";

const Schema = mongoose.Schema;

const jobSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['internship', 'full-time']
    },
    ctc: {
        type: Number,
        required: true
    },
    eligibleBranches: [{
        type: String,
        required: true,
        enum: ['it', 'ece', 'it-bi', 'all']
    }],
    lastDate: {
        type: Date,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    eligibleBatch: {
        type: Number,
        required: true
    },
    minimumCgpa: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    appliedStudents: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    shortlistedStudents: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
},
{
    timestamps: true
});

export default mongoose.model('Job', jobSchema);