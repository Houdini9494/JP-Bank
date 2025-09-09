// questo file crea un'istanza axios preconfigurata che punta all'endpoint API del backend,
// aggiunge inoltre due interceptor che, il primo, prima dell'invio di ogni richiesta,
// inserisce automaticamente nell'intestazione l'eventuale token di autenticazione (Bearer token) se presente nel localStorage
// mentre il secondo, agisce sulle risposte, gestendo gli errori.
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
})


//INTERCEPTOR REQUEST, include il token JWT in tutte le richieste
api.interceptors.request.use(
  config => {
    // estrae il token dal localStorage
    const localToken = localStorage.getItem('token')

    // se esiste, aggiorna il campo Authorization dell'header con il token
    if (localToken) {
      config.headers.Authorization = `Bearer ${localToken}`
    }

    // restituisce la configurazione aggiornata
    return config
  },
  error => Promise.reject(error)
)

//INTERCEPTOR RESPONSE, gestione globale degli errori:
//Adatta l'estrazione del messaggio al nuovo schema { error: { message } },
//continua a gestire 401 (token scaduto / non valido) e 409 (conflitti),
//propaga sempre l'errore con un campo customMessage pronto per i componenti
api.interceptors.response.use(
  response => response,
  async error => {

    //Estraggo il messaggio fornito dal backend con il nuovo formato centralizzato,
    //uso il vecchio formato come fallback, oppure se non c'è nulla uso un 'messaggio generico'
    const backendMsg =
      error?.response?.data?.error?.message ||   // nuovo formato
      error?.response?.data?.message        ||   // vecchio formato di fallback
      'Errore di rete o del server'              // default

    // HTTP status code (può essere undefined se il backend è down)
    const status = error?.response?.status

    //401, token scaduto/utente non autenticato oppure nessuna risposta per backend down/rete assente
    if (!error.response || status === 401) {
      console.warn(backendMsg)

      // importa dinamicamente lo store Vuex e richiama 'auth/logout'
      // evitando dipendenze circolari con Vue
      const store = (await import('@/store')).default
      store.dispatch('auth/logout')
    }

    //409 (Conflict) o 400 (Bad Request)
    if (status === 409 || status === 400) {
      console.warn(backendMsg)
      // il componente che ha fatto la richiesta mostrerà il messaggio
    }

    //500, errori interni del server
    if (status >= 500) {
      console.error('Errore interno:', backendMsg)
    }

   //Propago sempre l'errore, aggiungo una proprietà customMessage con il testo estratto così che nei componenti possa fare:
   //"catch(error) { this.errorMsg = error.customMessage }"
    error.customMessage = backendMsg
    return Promise.reject(error)   // propaga l'errore "non risolto"
  }
)

export default api
