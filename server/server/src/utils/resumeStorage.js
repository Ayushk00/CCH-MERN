import mongoose from "mongoose";

// Resumes are stored in MongoDB (GridFS bucket "resumes"), so the server keeps no
// files on disk and works on serverless hosts with a read-only filesystem.
// Each file is stored under its generated name (e.g. "<uuid>.pdf").
const bucket = () => new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "resumes" });

const saveResume = (fileName, buffer, originalName) =>
    new Promise((resolve, reject) => {
        const upload = bucket().openUploadStream(fileName, {
            metadata: { originalName, contentType: "application/pdf" },
        });
        upload.once("finish", resolve);
        upload.once("error", reject);
        upload.end(buffer);
    });

const findResume = async (fileName) => (await bucket().find({ filename: fileName }).limit(1).toArray())[0] || null;

const openResumeStream = (fileName) => bucket().openDownloadStreamByName(fileName);

const deleteResume = async (fileName) => {
    const file = await findResume(fileName);
    if (file) await bucket().delete(file._id);
};

export { saveResume, findResume, openResumeStream, deleteResume };
