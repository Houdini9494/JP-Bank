//questo modulo gestisce le transazioni dei conti; memorizza le transazioni per ogni conto
import api from '@/services/api.js'

const state = {
  transactionsByAccount: {}
}

const mutations = {
  //modifica lo stato locale del modulo prendendo i dati che gli vengono passati dalla action
  setTransactionsByAccount(state, { accountId, transactions }) {
    state.transactionsByAccount = {
      ...state.transactionsByAccount, //copia tutte le transazioni gia presenti
      [accountId]: transactions //aggiuinge una nuova voce sull'accountId specificato
    }
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
    } catch (err) {
      console.error(`Errore nel recupero transazioni del conto ${accountId}:`, err)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
