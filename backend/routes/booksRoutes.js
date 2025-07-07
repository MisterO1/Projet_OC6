const express = require('express')
const protect = require('../middleware/protectMiddleware')
// const multer = require('../middleware/multer-config')
const router = express.Router()

const {
    getAllBooks,
    getBook,
    getBestBooks,
    addBook,
    addRating,
    updateBook,
    deleteBook,
} = require('../controllers/bookControllers')


router.get('/', getAllBooks)
router.get('/:id', getBook)
router.get('/bestrating', getBestBooks)

router.post('/', protect, addBook)
router.post('/:id/rating', protect, addRating)

router.put('/:id', protect, updateBook)
router.delete('/:id', protect, deleteBook)

module.exports = router