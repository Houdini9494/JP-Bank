//importazione modulo swagger
const { swaggerUi, swaggerSpec } = require("./swagger");

//importazione librerie necessarie all'app
const express = require("express");
const cors = require("cors");
//importazione ed inizializzazione del pacchetto "dotenv" che legge il file .env e lo carica dentro process.env,
//il quale, contenendo le variabili d'ambiente, permette di accedervi senza doverle scrivere nel codice
require("dotenv").config();

//importazione dei moduli
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const transactionRoutes=require("./routes/transactionRoutes");
const errorHandler = require('./middlewares/errorHandler');

//istanzazione dell'applicazione express
const app = express();

//middlewares
//abilita richieste CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
}));
app.use(express.json()); //permette il parsing automatico del body delle richieste in json

//routes
app.use("/api/auth", authRoutes); //gestione autenticazioni
app.use("/api/accounts", accountRoutes); //gestione conti
app.use("/api/transactions",transactionRoutes); //gestione transazioni

//route swagger per leggere documentazione tramite UI nel browser
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//middleware di log degli errori
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
  console.log(`Documentazione Swagger disponibile su http://localhost:${PORT}/api-docs`);
})