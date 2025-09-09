const mysql = require("mysql2");
require("dotenv").config();

// Creazione connessione al database MySQL, utilizzando le variabili d'ambiente
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//esportazione della pool di connessione con promises in modo da poter usare async/await
//invece delle callback per gestire i risultati delle query
module.exports = pool.promise();