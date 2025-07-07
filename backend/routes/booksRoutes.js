const express = require('express')
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

router.post('/', addBook)
router.post('/:id/rating', addRating)

router.put('/:id', updateBook)
router.delete('/:id', deleteBook)

module.exports = router