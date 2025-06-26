//bcrypt permette la cifratura delle password
const bcrypt = require("bcryptjs");
//jsonwebtoken permette la generazione e verifica dei token JWT
const jwt = require("jsonwebtoken");
const User = require("../models/User");

class AuthController{
  //funzione di registrazione nuovo utente
  //POST /api/auth/register
  static async register(req, res){
    try{
      const {name, email, password, marketing} = req.body;
      //validazione campi input
      if (!name || !email || !password) {
        return res.status(400).json({message:"Tutti i campi sono obbligatori"});
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.createUser(name, email, hashedPassword, marketing);

      res.status(200).json({message:"Utente registrato con successo"});
    }catch(error){
      //gestione errori
      //ER_DUP_ENTRY è l'errore che restituisce MySQL quando si inserisce un valore duplicato in una colonna che ha un vincolo "UNIQUE"
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({message:"Email già in uso"});
      }
      //errore generico
      return res.status(500).json({message:"Errore durante la registrazione, riprovare più tardi"});
    }
  };

  //funzione di login
  //POST /api/auth/login
  static async login(req, res){
    try{
      const {email, password} = req.body;
      //validazione campi
      if (!email || !password) {
        return res.status(400).json({ message: "Email e password sono obbligatori" });
      }

      //recupera i dati dell'user utilizzando il metodo findByEmail() di User
      const user = await User.findByEmail(email);

      //validazione nome utente e password
      const valid = await bcrypt.compare(password, user.password)
      if (!user || !valid){
        return res.status(400).json({message:"Credenziali non valide"});
      }

      //generazione di un token JWT se l'utente è stato verificato con successo
      const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn:"1h"});
      return res.json({token});
    }catch(error){
      console.error("Errore nel login:", error);
      return res.status(500).json({message:"Errore durante il login, riprovare più tardi"});
    }
  };
}

module.exports=AuthController