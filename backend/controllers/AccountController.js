const db = require("../config/db");
const MAX_ACCOUNTS = 3;

class AccountController{
  // ottieni tutti i conti dell'utente loggato
  // GET api/accounts/
  static async getAccounts(req, res){
    try {
      const [accounts] = await db.execute(
        "SELECT * FROM accounts WHERE user_id = ?",
        [req.userId]
      );

      if (accounts.length === 0) {
        return res.status(400).json({message:"Nessun conto trovato"});
      }

      res.status(200).json(accounts);
    } catch (error) {
      console.error("Errore in getAccounts", error.message);
      res.status(500).json({message:"Errore durante il recupero dei conti"});
    }
  };

  // crea un nuovo conto con saldo iniziale 0; reso il valore di "balance" arbitrario per testare il funzionamento
  // POST api/accounts/
  static async createAccount(req, res){
    const [existingAccounts] = await db.execute(
      "SELECT COUNT(*) as count FROM accounts WHERE user_id = ? AND status = 'active'", [req.userId]
    );

    //controlla se è stato raggiunto il numero massimo di conti creabili (3)
    if(existingAccounts[0].count >= MAX_ACCOUNTS){
      return res.status(409).json({message: "Limite massimo di conti raggiunto"});
    }

    try {
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
      console.error("Errore in createAccount", error.message);
      res.status(500).json({message:"Errore durante la creazione del conto"});
    }
  };

  //funzione chiudi conto
  //PATCH /api/accounts/:id/close
  static async closeAccount(req, res){
    const accountId = req.params.id;
    const userId = req.userId;

    try {
      // Recupera il conto
      const [accounts] = await db.execute(
        "SELECT * FROM accounts WHERE id = ? AND user_id = ?",
        [accountId,userId]
      );

      const account = accounts[0];

      if (!account) {
        return res.status(404).json({message:'Conto non trovato'});
      }

      if (Number(account.balance) !== 0) {
        return res.status(400).json({message:'Il conto deve avere saldo zero per essere chiuso; devi prima spostare i fondi.'});
      }

      // Imposta lo stato a "non attivo"
      await db.execute(
        "UPDATE accounts SET status = ? WHERE id = ?",
        ['inactive', accountId]
      );

      res.status(200).json({message:'Conto chiuso con successo'});
    } catch (error) {
      console.error("Errore in closeAccount", error.message);
      res.status(500).json({message:'Errore durante la chiusura del conto'});
    }
  };
}

module.exports=AccountController
