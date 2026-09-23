import mongoose from "mongoose";

const Schema = mongoose.Schema;

const noticeSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    audience: {
        type: String,
        enum: ['students', 'recruiters', 'all'],
        default: 'all'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, {
    timestamps: true
});

export default mongoose.model('Notice', noticeSchema);
