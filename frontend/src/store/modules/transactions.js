//questo modulo gestisce le transazioni dei conti; memorizza le transazioni per ogni conto
import api from '@/services/api.js'

const state = {
  transactionsByAccount: {},
  error: null
}

const mutations = {
  //modifica lo stato locale del modulo prendendo i dati che gli vengono passati dalla action
  setTransactionsByAccount(state, { accountId, transactions }) {
    state.transactionsByAccount = {
      ...state.transactionsByAccount, //copia tutte le transazioni gia presenti
      [accountId]: transactions //aggiuinge una nuova voce sull'accountId specificato
    }
  },
  //salva l'errore
  setError(state, error){
    state.error = error
  }
}

const actions = {
  //esegue una fetch dei dati relativi alle transazioni di un conto ed esegue infine un commit per far aggiornare lo stato dalla relativa mutation
  async fetchTransactionsByAccountId({ commit }, accountId) {
    try {
      const res = await api.get(`/transactions/${accountId}/transactions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      commit('setTransactionsByAccount', { accountId, transactions: res.data })
      commit('setError', null) //reset errore
    } catch (error) {
      console.error(`Errore nel recupero transazioni del conto ${accountId}:`, error)
      //salva il messaggio di errore preciso, se disponibile
      commit('setError', error.customMessage || 'Errore nel recupero delle transazioni')
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
