// Middleware général de gestion d'erreurs
const errorHandler = (err, req, res, next) => {
    try {
        let error = {...err}
        error.message = err.message
        console.error(err)

        //Mongoose bad ObjectId
        if (err.name === "CastError"){
            error = new Error("Ressource not found")
            error.statusCode = 404
        }

        //Mongoose duplicate key
        if (err.code === 11000){
            error = new Error("Duplicate field values entered !")
            error.statusCode = 400
        }

        //Mongoose validation error
        if (err.name === "ValidationError"){
            const message = Object.values(err.errors).map(val => val.message)
            error = new Error(message.join(', '))
            error.statusCode = 400
        }

        res.status(error.statusCode || 500)
        // Differentiate dev and prod
        // res.json({
        //     success: false,
        //     error: error.message || "Server Error",
        //     ...(process.env.NODE_ENV !== "production" && { stack: error.stack })
        // });
    } catch (error) {
        next(error)
    }
}

module.exports = {  errorHandler }