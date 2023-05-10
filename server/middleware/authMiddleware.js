import jwt from 'jsonwebtoken'

export default function(request, response, next) {
    if (request.method === 'OPTIONS') {
        next()
    }
    try {
        const token = request.headers.authorization.split(' ')[1]
        if (!token) {
            return response.status(401).json({message: 'Не авторизован'})
        }
        request.user = jwt.verify(`${token}`, `${process.env.SECRET_KEY}`)
        next()
    } catch (e) {
        response.status(401).json({message: 'Не авторизован'})
    }
}