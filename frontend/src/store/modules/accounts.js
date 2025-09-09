//questo modulo gestisce lo stato dei conti dell'utente; coordina i dati, li recupera, li modfica e li rende disponibili in modo reattivo ai componenti
import accountService from '@/services/account.service'

const state = {
  accounts: [],
  loading: false,
  error: null
}

//espone lo stato ai componenti
const getters = {
  getAccounts: state => state.accounts,
  isLoading: state => state.loading,
  getError: state => state.error
}

//le mutations modificano in modo sincrono lo stato
const mutations = {
  SET_ACCOUNTS(state, accounts) {
    state.accounts = accounts
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  ADD_ACCOUNT(state, account) {
    state.accounts.push(account)
  },
  //modifica lo stato di un account specifico usando find() per individuarlo
  UPDATE_ACCOUNT_STATUS(state, { accountId, status }) {
    const account = state.accounts.find(acc => acc.id === accountId)
    if (account) {
      account.status = status
    }
  }
}

const actions = {
  //esegue una chiamata al backend per caricare tutti i conti
  async fetchAccounts({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await accountService.getAccounts()
      commit('SET_ACCOUNTS', response.data)
      commit('SET_ERROR', null)
    } catch (error) {
      commit('SET_ERROR', error.customMessage || 'Errore nel caricamento dei conti')
      commit('SET_ACCOUNTS', [])
    } finally {
      commit('SET_LOADING', false)
    }
  },

  //esegue la chiamata al backend per la creazione del conto
  async createAccount({ commit }, accountData) {
    commit('SET_LOADING', true)
    try {
      const payload = {
        ...accountData,
        balance: 0
      }

      const response = await accountService.createAccount(payload)
      const newAccount = response.data

      commit('ADD_ACCOUNT', newAccount)
      commit('SET_ERROR', null)
      return true
    } catch (error) {
      commit('SET_ERROR', error.customMessage || 'Errore nella creazione del conto')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  //esegue la chiamata al backend per la chiusura del conto, aggiorna lo stato locale e ricarica tutti i conti
  async closeAccount({ commit, dispatch }, accountId) {
    commit('SET_LOADING', true)
    try {
      await accountService.closeAccount(accountId)
      commit('UPDATE_ACCOUNT_STATUS', { accountId, status: 'inactive' })
      commit('SET_ERROR', null)
      await dispatch('fetchAccounts') //ricarica la lista aggiornsta
      return true
    } catch (error) {
      commit('SET_ERROR', error.customMessage || 'Errore durante la chiusura del conto')
      return false
    } finally {
      commit('SET_LOADING', false)
    }
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
