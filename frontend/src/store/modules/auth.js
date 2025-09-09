//questo file definisce il modulo auth che gestisce l'autenticazione utente, il token jwt e gli errori legati alla registrazione/login
import authService from '@/services/auth.service' //servizio di autenticazione che esegue le chiamate API per login e register
import router from '@/router'

//definizione dello stato
const state = {
  token: localStorage.getItem('token') || null,
  user: null,
  error: null
}

//definizione dei getters
const getters = {
  isAuthenticated: state => !!state.token,
  getError: state => state.error
}

//gestione dello stato
const mutations = {
SET_TOKEN(state, token) {
  state.token = token
},
SET_USER(state, user) {
  state.user = user
},
SET_ERROR(state, error) {
  state.error = error
},
//reset degli stati
CLEAR_AUTH(state) {
  state.token = null
  state.user = null
}
}

const actions = {
  //esegue il login tramite authService; se ha successo salva il token, resetta l'errore e reindirizza alla dashboard, altrimenti imposta un errore
  async login({ commit }, credentials) {
    try {
      const response = await authService.login(credentials)
      const token = response.data.token

      localStorage.setItem('token', token)
      commit('SET_TOKEN', token)
      commit('SET_ERROR', null)

      router.push('/dashboard')
    } catch (error) {
      commit('SET_ERROR', error.customMessage || 'Credenziali non valide')
    }
  },
  //esegue la registrazione, rimuove gli errori e reindirizza al login, oppure in caso di errore mostra un errore generico
  async register({ commit }, user) {
    try {
      await authService.register(user)
      commit('SET_ERROR', null)
      router.push('/login')
    } catch (error) {
      commit('SET_ERROR', error.customMessage || 'Errore durante la registrazione')
      throw error
    }
  },
  //rimuove il token dal localStorage, resetta gli stati e reindirizza al login forzando un refresh della pagina
  logout({ commit }) {
    localStorage.removeItem('token')
    commit('CLEAR_AUTH')
    window.location.href = '/login';}
}

export default {
  namespaced: true, //attiva lo scoping del modulo per accedere alle singole funzionalità offerte specificandole dopo il prefisso 'auth/'
  state,
  getters,
  mutations,
  actions
}
