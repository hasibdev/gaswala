const jwt = require('jsonwebtoken')

module.exports = function (...args) {
    const guard = [...args]
    return function (req, res, next) {
        const authHeader = req.headers['authorization']
        if (!authHeader) return res.status(401).json({ message: 'You are not authenticated!' })
        let token = authHeader.includes('Bearer') ? authHeader.split(' ')[1] : authHeader
        const jwtSecret = process.env.JWT_SECRET

        jwt.verify(token, jwtSecret, (err, value) => {
            if (err) return res.status(401).json({ message: 'Invalid token!' })
            if (guard.length && !guard.includes(value.user.guard))
                return res.status(403).json({ message: 'You are not allowed!' })
        })

        next()
    }
}