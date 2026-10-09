const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    
    console.log('usuario', req.user)

    if (!req.user) {
      return res.status(401).json({
        message: 'El token de autorización es requerido.'
      });
    }
    
    if (!allowedRoles.includes(req.user.user_role)) {
      return res.status(403).json({
        message: 'No tiene permisos para acceder a este recurso.'
      });
    }

    return next();
  };
};

module.exports = {
  authorizeRoles
};