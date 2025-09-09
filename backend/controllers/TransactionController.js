const db = require("../config/db");
const AppError = require("../utils/AppError.js")

class TransactionController{
  //trasferimento fondi da un conto a un altro
  //POST /api/transactions/
  static async transferFunds(req,res,next){
    const connection=await db.getConnection();
    try {
      const {senderAccountId, receiverAccountId, amount, description}=req.body;
      const userId=req.userId; //viene settato dal middleware di autenticazione

      //validazioni base
      if (!senderAccountId || !receiverAccountId || !amount || Number(amount) <=0) {
        throw new AppError('Dati mancanti o invalidi',400);
      }

      //verifica che il conto mittente appartenga all'utente autenticato
      const [senderRows]=await connection.execute(
        "SELECT * FROM accounts WHERE id = ? AND user_id = ?",
        [senderAccountId,userId]
      );

      const senderAccount=senderRows[0];
      if (!senderAccount || senderAccount.status === "inactive"){
        throw new AppError('Conto mittente non valido',400);
      }

      //verifica che il conto destinatario esista
      const [receiverRows]=await connection.execute(
        "SELECT * FROM accounts WHERE id = ?",
        [receiverAccountId]
      );

      const receiverAccount=receiverRows[0];
      if (!receiverAccount || receiverAccount.status === "inactive"){
        throw new AppError('Conto destinatario non valido',404);
      }

      //verifica fondi
      if (senderAccount.balance<amount){
        throw new AppError('Fondi insufficienti',400);
      }

      //inizio transazione
      await connection.beginTransaction();

      //aggiornamento conto mittente
      await connection.execute(
        "UPDATE accounts SET balance = balance - ? WHERE id = ?",
        [amount, senderAccountId]
      );

      //aggiornamento conto destinatario
      await connection.execute(
        "UPDATE accounts SET balance = balance + ? WHERE id = ?",
        [amount, receiverAccountId]
      );

      //log della transazione nella tabella
      await connection.execute(
        "INSERT INTO transactions (sender_id,receiver_id,amount,description) VALUES (?,?,?,?)",
        [senderAccountId,receiverAccountId,amount,description]
      )

      await connection.commit();

      return res.status(200).json({message:"Trasferimento completato con successo"});
    }catch(error){
      await connection.rollback();
      console.error("Errore in transferFunds", error.message);
      return next(
        error.isOperational
        ? error
        : new AppError('Errore durante il trasferimento, riprovare piu tardi', 500));
    }
  };

  //Ottieni le transazioni di un conto
  //GET /api/transactions/:id/transactions
  static async getTransactions(req, res,next){
    try {
      const accountId = req.params.id;

      //transazioni inviate
      const [sent] = await db.execute(
        "SELECT * FROM transactions WHERE sender_id = ?",
        [accountId]
      );

      //transazioni ricevute
      const [received] = await db.execute(
        "SELECT * FROM transactions WHERE receiver_id = ?",
        [accountId]
      );

      res.status(200).json({sent, received});
    } catch (error) {
      console.error("Errore in getTransactions", error.message);
      return next(new AppError('Errore nel recupero delle transazioni', 500));
    }
  };
}

module.exports=TransactionController