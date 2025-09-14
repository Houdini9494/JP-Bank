# JP-Banking – Simulatore di Home Banking
Progetto sviluppato come simulazione di un'applicazione bancaria full-stack API based, con frontend in Vue.js + Vite, backend in Node.js + Express e database MySQL.

Include autenticazione JWT, creazione e gestione di conti fittizi, invio fondi, cronologia transazioni e documentazione Swagger.

---

## Tecnologie utilizzate
### Backend
- Node.js (ambiente di esecuzione javascript)
- Express (framework di sviluppo per nodejs)
- MySQL2 (libreria di interfaccia con il database)
- JWT (jsonwebtoken)
- Winston (log)
- Swagger (documentazione API)
- Nodemon (tool per il reload automatico in sviluppo)

### Frontend
- Vue.js 3 + Composition API (framework javascript frontend)
- Vue Router (gestione routing)
- Vuex (gestione centralizzata dello stato globale)
- Axios (richieste HTTP)
- Vite (server di sviluppo)

### Database
- MySQL (dump disponibile in `/database/struttura.sql`)

---

## Funzionalità principali
- Registrazione e login utente (JWT)
- Creazione di conti fittizi (configurabile, di default 3 per utente)
- Assegnazione saldo iniziale arbitrario per test
- Visualizzazione conti
- Invio fondi tra conti dell’app
- Storico transazioni
- Chiusura conto (soft-delete)
- Accesso protetto tramite middleware
- Log degli errori
- Documentazione API con Swagger

---

## Struttura del progetto
```
jp-bank/
├── backend/
│ ├── controllers/
│ ├── logs/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ ├── config/
│ ├── server.js
| └── swagger.js
|
├── frontend/
| ├── public/
│ ├── src/
│ | ├── views/
│ | ├── components/
│ | ├── store/
│ | ├── router/
│ | └── main.js
| └── index.html
|
└── database/
  └── struttura.sql
```
---

## Autenticazione
L'autenticazione è gestita con JWT:
- I token vengono generati al login
- Ogni rotta protetta è vincolata da un middleware che verifica il token
- I token scadono dopo 1h

---

## Documentazione API
Swagger è disponibile all'indirizzo: http://localhost:3000/api-docs

---

## Avvio del progetto
### 1. Clona il repository
- git clone <url-repo>
- cd jp-bank

### 2. Configura il backend
Modifica il file .env con i parametri del tuo DB MySQL (vedi .env.example)

Installa le dipendenze:
- cd backend
- npm install
- npm test/start

### 3. Configura il frontend
- cd frontend
- npm install
- npm run dev
  
Il frontend sarà visibile all'indirizzo: http://localhost:5173

### 4. Configura il database
Il progetto prevede l'utilizzo di un utente MySQL dedicato (es. bank_user) con accesso esclusivo al database jp_bank.

Si consiglia di non utilizzare l'utente root per motivi di sicurezza.

Di seguito la procedura per una corretta configurazione iniziale.

Accedere a mysql come utente root:
- mysql -u root -p

Creare un database:
- CREATE DATABASE nome_database;

Creare l'utente dedicato all'utilizzo dell'applicazione:
- CREATE USER 'nome_utente'@'localhost' IDENTIFIED BY 'password_sicura';

Assegnare i privilegi al nuovo utente:
- GRANT ALL PRIVILEGES ON nome_database.* TO 'nome_utente'@'localhost';
- FLUSH PRIVILEGES;

Uscire da mysql, spostarsi sulla cartella "database" del progetto ed importare il dump della struttura del db MySQL
- mysql -u nome_utente -p nome_database < struttura.sql

a questo punto modificare il file ".env" contenuto nella cartella "backend" del progetto, assegnando i corretti valori alle variabili:

DB_USER="nome_utente"

DB_PASS="password_sicura"

DB_NAME="nome_database"

---

## Note
- Il progetto è una simulazione e non ha valore di servizio bancario reale
- I conti sono fittizi e creati con saldo arbitrario solo per fini didattici
- I dati non sono protetti da meccanismi di crittografia o sicurezza avanzata tipici di ambienti di produzione
- Le credenziali utente e le operazioni simulate sono gestite in ambiente di sviluppo locale, senza meccanismi di persistenza garantita in caso di crash o scalabilità server

---

## Autore
Giacomo Piatto

Università: Pegaso

Corso di laurea: L31 Informatica per le aziende digitali

Anno accademico: 2024/2025
