// questo file crea un'istanza axios preconfigurata che punta all'endpoint API del backend,
// aggiunge inoltre un interceptor che prima dell'invio di ogni richiesta,
// inserisce automaticamente nell'intestazione l'eventuale token di autenticazione (Bearer token), se presente nel localStorage
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// interceptor per includere il token jwt in tutte le richieste
api.interceptors.request.use(
  config => {
    //estrae il token dal localStorage
    const localToken = localStorage.getItem('token')
    //se esiste, aggiorna il campo authorization dell'header con il token
    if (localToken) {
      config.headers.Authorization = `Bearer ${localToken}`
    }
    //restituisce la configurazione aggiornata
    return config
  },
  error => Promise.reject(error)
)

// interceptor globale per risposte
api.interceptors.response.use(
  response => response,
  error => {
    // se è errore di rete (es. backend spento) oppure errore di autenticazione o token scaduto
    if (!error.response || error.response.status === 401) {
      console.warn('Errore di rete o token non valido');

      //importa dinamicamente lo store vuex e richiama 'auth/logout' che esegue prima il logout e dopo reindirizza alla pagina di login
      import('@/store').then(module => {
        module.default.dispatch('auth/logout');
      });
      //"import('@/store).then(module =>{module.default.dispatch('auth/logout')})" equivale ad "import store from '@/store; store.dispatch('auth/logout)" ma
      //invece di eseguire l'import statico di store come oggetto Vuex, viene importato dinamicamente ed in modo asincrono solo all'occorrenza, come in questo caso
      // al momento in cui si verifica l'errore, evitando un ciclo di dipendenze con Vue
    }
    if (error.response.status === 409){
      console.warn('La richiesta non può essere completata a causa di un conflitto con lo stato attuale della risorsa.')
    }
    return Promise.reject(error) //propaga l'errore "non risolto", al componente chiamante per una gestione separata (es. tramite il blocco catch())
  }
)

export default api
