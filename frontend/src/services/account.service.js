//questo file funge da interfaccia per le API del backend, permettendo la gestione delle varie funzioni utilizzabili dall'utente
import api from './api'

export default {
  getAccounts() {
    return api.get('/accounts')
  },
  createAccount(data) {
    return api.post('/accounts', data)
  },
  closeAccount(accountId) {
    return api.patch(`/accounts/${accountId}/close`)
  }
}
