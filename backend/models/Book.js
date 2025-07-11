const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
    userId: {
        type: String,
        // required: true
    },
    title: {
        type: String,
        // required: true,
        // unique: true
    },
    author: {
        type: String,
    },
    imageUrl: {
        type: String
    },
    year: {
        type: Number,
    },
    genre: {
        type: String,
    },
    ratings: [{
        userId: {
            type: String,
            // unique: true
        },
        grade: {
            type: Number,
            // required: true,
            min: 0,
            max: 5
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    }
})

bookSchema.methods.updateAverageRating = function () {
    if (this.ratings.length === 0) {
        this.averageRating = 0
    } else {
        const sum = this.ratings.reduce((total, rating) => total + rating.grade, 0)
        this.averageRating = Math.round((sum / this.ratings.length)*10) / 10 // arrondi au 1 décimale
    }
    return this.save()
}

module.exports = mongoose.model('Book', bookSchema)