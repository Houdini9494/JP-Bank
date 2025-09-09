const db = require("../config/db");
const MAX_ACCOUNTS = 3;
const AppError = require('../utils/AppError');

class AccountController{
  // ottieni tutti i conti dell'utente loggato
  // GET api/accounts/
  static async getAccounts(req, res, next){
    try {
      const [accounts] = await db.execute(
        "SELECT * FROM accounts WHERE user_id = ?",
        [req.userId]
      );

      if (accounts.length === 0) {
        throw new AppError('Nessun conto trovato', 404);
      }

      res.status(200).json(accounts);
    } catch (error) {
      console.error("Errore in getAccounts", error.message);
      return next(new AppError('Errore durante il recupero dei conti', 500));
    }
  };

  // crea un nuovo conto con saldo iniziale 0; reso il valore di "balance" arbitrario per testare il funzionamento
  // POST api/accounts/
  static async createAccount(req, res, next){
    try {
      const [existingAccounts] = await db.execute(
        "SELECT COUNT(*) as count FROM accounts WHERE user_id = ? AND status = 'active'", [req.userId]
      );

      //controlla se è stato raggiunto il numero massimo di conti creabili (3)
      if(existingAccounts[0].count >= MAX_ACCOUNTS){
        throw new AppError('Limite massimo di conti raggiunto', 409);
      }

      const {name, type} = req.body;
      const balance = 100;

      const [result] = await db.execute(
        "INSERT INTO accounts (name, balance, user_id, type) VALUES (?, ?, ?, ?)",
        [name, balance, req.userId, type]
      );

      // Recupera l'account appena creato
      const [newAccount] = await db.execute(
        "SELECT * FROM accounts WHERE id = ?",
        [result.insertId]
      );

      res.status(200).json(newAccount[0]);
    } catch (error) {
      console.error("Errore in createAccount", error);
      return next(
        error.isOperational
        ? error
        : new AppError('Errore durante la creazione del conto', 500));
    }
  };

  //funzione chiudi conto
  //PATCH /api/accounts/:id/close
  static async closeAccount(req, res, next){
    try {
      const accountId = req.params.id;
      const userId = req.userId;

      // Recupera il conto
      const [accounts] = await db.execute(
        "SELECT * FROM accounts WHERE id = ? AND user_id = ?",
        [accountId,userId]
      );

      const account = accounts[0];

      if (!account) {
        throw new AppError('Conto non trovato', 404);
      }

      if (Number(account.balance) !== 0) {
        throw new AppError('Il conto deve avere saldo zero per essere chiuso; devi prima spostare i fondi.', 400);
      }

      // Imposta lo stato a "non attivo"
      await db.execute(
        "UPDATE accounts SET status = ? WHERE id = ?",
        ['inactive', accountId]
      );

      res.status(200).json({message:'Conto chiuso con successo'});
    } catch (error) {
      console.error("Errore in closeAccount", error.message);
      return next(
        error.isOperational
        ? error
        : new AppError('Errore durante la chiusura del conto', 500));
    }
  };
}

module.exports=AccountController
