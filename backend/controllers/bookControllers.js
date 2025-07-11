const Book = require('../models/Book')
const fs = require('fs')

// get all books
exports.getAllBooks = (req, res) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch((error)=> {
            console.log(error)
            res.status(400)
        })
}

// get a specific book
exports.getOneBook = (req, res) => {
    Book.findOne({_id: req.params.id})
        .then(book => {
            if (!book){
                res.status(404).json({message: 'livre non trouvé !'})
            }else {
                res.status(200).json(book)
            }
        })
        .catch((error)=> {
            console.log(error)
            res.status(400)
        })
}

// get 3 best books base on averageRating
exports.getBestBooks = (req, res) => {
    Book.find()
        .sort({ averageRating: -1}) // sort for descending
        .limit(3)                   // take just 3 books
        .then(top3 => res.status(200).json(top3))   // retain only first 3
        .catch((error)=> {
            console.log(error)
            res.status(400)
        })
}

// add a book - only connected user can do this
exports.addBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book)
    delete bookObject._id
    delete bookObject.userId

    const book = new Book({
        userId :req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        ...bookObject,
    })
    // console.log(book)
    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !'}) )
        .catch((error) => {
            // delete image if error
            if (req.file) {
                const filepath = `images/${req.file.filename}`
                fs.unlink(filepath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error("Error de suppression de l'image.")
                    }else {
                        console.log("Image supprimée après échec de création.")
                    }
                })
            }

            console.log(error)
            res.status(400)
        })
}

// delete a specific book
exports.deleteBook = (req, res) => {
    Book.findOne({_id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: 'Unauthorized request'})
            }else {
                const filename = book.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, ()=>{
                    Book.deleteOne({_id: req.params.id})
                        .then(() => res.status(200).json({message : 'Livre supprimé avec succès !'}))
                        .catch(error => res.status(400).json({error}))
                })
            }
        })
        .catch((error)=> {
            console.log(error)
            res.status(500)
        })
}

// update a book
exports.updateBook = (req, res) => {
    const bookObject = req.file ?
        {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        :
        {...req.body}

    Book.findOne({_id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({message : 'unauthorized request !'})
            } else {
                Book.updateOne({_id: req.params.id}, {...bookObject, _id:req.params.id})
                    .then(() => res.status(200).json({message : 'Livre modifié !'}))
                    .catch(error => res.status(400).json({ error }))
            }
        })
        .catch((error)=> {
            console.log(error)
            res.status(400)
        })
}

// add a rating
exports.addRating = (req, res) => {
    Book.findOne({_id: req.params.id})
        .then(book => {
            if (!book){
                return res.status(404).json({message: 'Livre non trouvé !'})
            }

            // rating must be between 0 and 5
            const grade = Number(req.body.grade)
            if (isNaN(grade) || grade < 0 || grade > 5) {
                return res.status(400).json({message: 'la note doit être entre 0 et 5 !'})
            }

            // Just One rating per user
            const alreadyRated = book.ratings.find(r => r.userId === req.auth.userId)
            if (alreadyRated){
                return res.status(403).json({message: 'vous avez déjà noté !'})
            }

            book.ratings.push({
                userId: req.auth.userId,
                grade
            })
            return book.updateAverageRating()       // return a promise --> the updated book
        })
        .then(updatedBook => {
            if (updatedBook) {
                res.status(200).json(updatedBook)
            }
        })
        .catch((error)=> {
            console.log(error)
            res.status(400)
        })
}