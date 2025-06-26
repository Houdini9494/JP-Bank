const db = require("../config/db");

class TransactionController{
  //trasferimento fondi da un conto a un altro
  //POST /api/transactions/
  static async transferFunds(req,res){
    const connection=await db.getConnection();
    const {senderAccountId, receiverAccountId, amount, description}=req.body;
    const userId=req.userId; //viene settato dal middleware di autenticazione

    try {
      //validazioni base
      if (!senderAccountId || !receiverAccountId || !amount || Number(amount) <=0) {
        return res.status(400).json({message:"Dati mancanti o non validi"});
      }

      //verifica che il conto mittente appartenga all'utente autenticato
      const [senderRows]=await connection.execute(
        "SELECT * FROM accounts WHERE id = ? AND user_id = ?",
        [senderAccountId,userId]
      );

      const senderAccount=senderRows[0];
      if (!senderAccount || senderAccount.status === "inactive"){
        return res.status(400).json({message:"Conto mittente non valido"});
      }

      //verifica che il conto destinatario esista
      const [receiverRows]=await connection.execute(
        "SELECT * FROM accounts WHERE id = ?",
        [receiverAccountId]
      );

      const receiverAccount=receiverRows[0];
      if (!receiverAccount || receiverAccount.status === "inactive"){
        return res.status(404).json({ message:"Conto destinatario non valido"});
      }

      //verifica fondi
      if (senderAccount.balance<amount){
        return res.status(400).json({message:"Fondi insufficienti"});
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
      return res.status(500).json({message:"Errore interno del server"});
    }
  };

  //Ottieni le transazioni di un conto
  //GET /api/transactions/:id/transactions
  static async getTransactions(req, res){
    const accountId = req.params.id;

    try {
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
      res.status(500).json({message:"Errore nel recupero delle transazioni", error});
    }
  };
}

module.exports=TransactionController