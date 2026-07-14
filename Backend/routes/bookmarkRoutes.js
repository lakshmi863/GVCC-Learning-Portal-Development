const express = require('express');
const router = express.Router();
const { saveBookmark, getBookmarks, updateBookmark, deleteBookmark  } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, saveBookmark);
router.get('/:videoId', protect, getBookmarks);
router.put('/:id', protect, updateBookmark);    
router.delete('/:id', protect, deleteBookmark);

module.exports = router;