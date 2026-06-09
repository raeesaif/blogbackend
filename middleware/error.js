const errorhandler = (err, req, res, next) => {
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ msg: messages.join(', ') });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({ msg: `${field} already exists` });
    }

    const status = typeof err.status === 'number' ? err.status
                 : typeof err.statusCode === 'number' ? err.statusCode
                 : 500;
    res.status(status).json({ msg: err.message || 'Internal Server Error' });
}

export default errorhandler;