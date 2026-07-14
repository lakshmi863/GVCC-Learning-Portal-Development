const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String, required: true }, // The MP4 Link
    thumbnailUrl: { type: String },
    duration: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Video', VideoSchema);