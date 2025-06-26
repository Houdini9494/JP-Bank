const jwt = require("jsonwebtoken");

class AuthMiddleware{
  static verifyToken(req,res,next){
    //recupera l'header authorization
    const authorizationHeader = req.headers.authorization;

    //esegue un controllo di validità
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(400).json({message:'Token mancante o corrotto'});
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
        return res.status(401).json({ message:'Token scaduto'});
      }
      return res.status(400).json({message:'Errore di autenticazione'});
    }
  }
}

module.exports = AuthMiddleware