const jwt = require("jsonwebtoken");
const AppError = require ("../utils/AppError");

class AuthMiddleware{
  static verifyToken(req,res,next){
    //recupera l'header authorization
    const authorizationHeader = req.headers.authorization;

    //esegue un controllo di validità
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new AppError('Token mancante o corrotto', 400)
    }

    //estrae il token
    const token = authorizationHeader.split(" ")[1];

    try{
      //verifica e decodifica il token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //salva l'id nella request
      req.userId = decoded.userId;
      next();
    } catch(err){
      console.error("Errore nel middleware:", err);
      //gestione errore di token scaduto
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Token scaduto', 401))
      }
      //gestione errore di token non valido
      if (err.name === 'JsonWebTokenError') {
        return next(new AppError('Token non valido', 401));
      }
      // Se è già un AppError lo propago, altrimenti lo incapsulo
      return next(
        err.isOperational
        ? err
        : new AppError('Errore di autenticazione', 400)
      )
    }
  }
}

module.exports = AuthMiddleware