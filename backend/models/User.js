//importazione dell'istanza del database
const db = require("../config/db");

//definizione classe User che rappresenta il modello dell'utente all'interno del database
class User{
  //vengono definiti metodi statici che non richiedono l'istanzazione della classe per poter essere utilizzati

  //metodo per la creazione di un nuovo utente
  static async createUser(name, email, hashedPassword, marketing){
    const sql = "INSERT INTO users (name, email, password, marketing) VALUES (?, ?, ?, ?)";
    await db.execute(sql, [name, email, hashedPassword, marketing]);
  }

  //metodo per la ricerca di un utente tramite email
  static async findByEmail(email){
    //viene usato [users] per destrutturare l'array restituito da db.execute(),
    //il quale restituisce un array di due elementi [rows,fields] contenenti rispettivamente
    //il risultato della query e le informazioni sui campi
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    //se [users] ha almeno un elemento viene restituito il primo, altrimenti null
    return users.length ? users[0] : null;
  }
}

module.exports = User;

