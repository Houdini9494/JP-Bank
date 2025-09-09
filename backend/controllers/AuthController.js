//bcrypt permette la cifratura delle password
const bcrypt = require("bcryptjs");
//jsonwebtoken permette la generazione e verifica dei token JWT
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError.js")

class AuthController{
  //funzione di registrazione nuovo utente
  //POST /api/auth/register
  static async register(req, res, next){
    try{
      const {name, email, password, marketing} = req.body;
      //validazione campi input
      if (!name || !email || !password) {
        throw new AppError('Tutti i campi sono obbligatori', 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.createUser(name, email, hashedPassword, marketing);

      res.status(200).json({message:"Utente registrato con successo"});
    }catch(error){
      //gestione errori
      //ER_DUP_ENTRY è l'errore che restituisce MySQL quando si inserisce un valore duplicato in una colonna che ha un vincolo "UNIQUE"
      if (error.code === "ER_DUP_ENTRY") {
        return next(new AppError('Email già in uso', 409));
      }
      //errore generico
      return next(
        error.isOperational
        ? error
        : new AppError('Errore durante la registrazione, riprovare piu tardi', 500));
    }
  };

  //funzione di login
  //POST /api/auth/login
  static async login(req, res, next){
    try{
      const {email, password} = req.body;
      //validazione campi
      if (!email || !password) {
        throw new AppError('Email e password sono obbligatori', 400);
      }

      //recupera i dati dell'user utilizzando il metodo findByEmail() di User
      const user = await User.findByEmail(email);

      //validazione nome utente e password
      // validazione nome utente
      if (!user){
        throw new AppError('Nome Utente non valido', 400);
      }

      //validazione password
      const valid = await bcrypt.compare(password, user.password)
      if (!valid){
        throw new AppError('Password non valida', 400);
      }

      //generazione di un token JWT se l'utente è stato verificato con successo
      const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn:"1h"});
      return res.json({token});
    }catch(error){
      console.error("Errore nel login:", error);
      // Se è già un AppError lo propago com’è, altrimenti lo incapsulo
      return next(
        error.isOperational
        ? error
        : new AppError('Errore durante il login, riprovare più tardi', 500));
    }
  };
}

module.exports=AuthController