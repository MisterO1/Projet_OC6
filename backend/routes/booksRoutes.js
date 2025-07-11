const express = require('express')
const protect = require('../middleware/protectMiddleware')
const multer = require('../middleware/multer-config')
const router = express.Router()

const {
    getAllBooks,
    getOneBook,
    getBestBooks,
    addBook,
    addRating,
    updateBook,
    deleteBook,
} = require('../controllers/bookControllers')


router.get('/', getAllBooks)
router.get('/bestrating', getBestBooks)
router.get('/:id', getOneBook)

router.post('/', protect, multer, addBook)
router.post('/:id/rating', protect, addRating)

router.put('/:id', protect, multer, updateBook)

router.delete('/:id', protect, multer, deleteBook)

module.exports = router