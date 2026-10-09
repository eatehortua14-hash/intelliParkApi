const { verifyToken } = require('../utils/jwt.util');

const authenticateToken = (req, res, next) => {

    console.log('ingreso ');
    
    const authorizationHeader = req.headers.authorization;

    if(!authorizationHeader) {
        return res.status(401).json({
            message: 'El token de autorización es requerido.'
        })
    }

    const tokenParts = authorizationHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({
        message: 'Foramto de token invalido.'
        });
    }

    const token = tokenParts[1];

    try {
        const decodedToken = verifyToken(token);
        req.user = decodedToken;
        return next();
    
    } catch (error) {
        return res.status(401).json({
            message: 'Token vencido o invalido.'
        });
    }
  
}

module.exports = {
  authenticateToken
};