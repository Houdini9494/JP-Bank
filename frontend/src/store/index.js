//questo file definisce ed inizializza lo store globale (Vuex) degli stati dell'applicazione
//importa la funzione createStore necessaria alla creazione del 'contenitore' ed
//importa anche i moduli auth,accounts e transactions che contengono gli stati e le azioni relative alle varie parti dell'applicazione
import { createStore } from 'vuex'
import auth from './modules/auth.js'
import accounts from './modules/accounts.js'
import transactions from './modules/transactions.js'

export default createStore({
  modules: {
    auth,
    accounts,
    transactions
  }
})
