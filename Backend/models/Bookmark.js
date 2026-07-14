const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true  // Indexing for faster user-based lookups
    },
    videoId: { 
        type: String, 
        required: true,
        index: true  // Indexing for faster video-based lookups
    },
    bookmarkName: { type: String, default: 'My Bookmark' },
    timestamp: { type: Number, required: true }, // Stores seconds
}, { timestamps: true });

// COMPOUND INDEX: Speed up fetching "specific user's bookmarks for a specific video"
BookmarkSchema.index({ user: 1, videoId: 1 });

module.exports = mongoose.model('Bookmark', BookmarkSchema);