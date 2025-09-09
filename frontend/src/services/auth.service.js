//questo servizio utilizza l'istanza axios fornita da api.js ed esporta le funzioni per l'autenticazione
import api from './api'

export default {
  //esegue il login
  login(credentials) {
    return api.post('/auth/login', credentials).then(response => {
      return response
    }).catch(error => {
    console.error('Login fallito:', error.customMessage || error.message)
    throw error
    });
  },
  //esegue la registrazione
  register(user) {
    return api.post('/auth/register', user)
  }
}

