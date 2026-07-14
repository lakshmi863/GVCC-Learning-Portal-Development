const Bookmark = require('../models/Bookmark');

exports.saveBookmark = async (req, res) => {
    try {
        const { videoId, bookmarkName, timestamp } = req.body;
        const bookmark = await Bookmark.create({
            user: req.user._id, // From Protect middleware
            videoId,
            bookmarkName,
            timestamp
        });
        res.status(201).json(bookmark);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getBookmarks = async (req, res) => {
    // Uses the Index we created to find data instantly
    const bookmarks = await Bookmark.find({ 
        user: req.user._id, 
        videoId: req.params.videoId 
    }).sort({ timestamp: 1 });
    res.json(bookmarks);
};

exports.updateBookmark = async (req, res) => {
    try {
        const bookmark = await Bookmark.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id }, // Security: Must own bookmark
            { bookmarkName: req.body.bookmarkName },
            { new: true }
        );
        if (!bookmark) return res.status(404).json({ message: "Bookmark not found" });
        res.json(bookmark);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete (NEW)
exports.deleteBookmark = async (req, res) => {
    try {
        const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!bookmark) return res.status(404).json({ message: "Bookmark not found" });
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};