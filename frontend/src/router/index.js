// questo file configura il router principale dell'applicazione Vue, gestendo le rotte pubbliche e protette ed integrando una navigazione condizionale tramite meta tag e vuex
import { createRouter, createWebHistory } from 'vue-router'

// importazione delle views principali dell'app
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Dashboard from '@/views/Dashboard.vue'
import CreateAccount from '@/views/CreateAccount.vue'
import TransferFunds from '@/views/TransferFunds.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:{guest:true}
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta:{guest:true}
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta:{requiresAuth:true}
  },
  {
    path: '/create-account',
    name: 'CreateAccount',
    component: CreateAccount,
    meta:{requiresAuth:true}
  },
  {
    path:"/transfer",
    name:"TransferFunds",
    component: TransferFunds,
    meta:{requiresAuth: true}
  }
]

const router = createRouter({
  //usando VITE va utilizzato "import.meta.env.VITE_BASE_URL" invece di "process.env.BASE_URL"
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes
})

//navigation guards
router.beforeEach(async(to, from, next) => {
  //recupera dal local storage il token salvato dopo il login
  const token = localStorage.getItem("token")

  //controlla se la rotta richiede autenticazione ed il token non esiste, reindirizza subito al login
  if(to.meta.requiresAuth && !token){
    return next("/login")
  }

  //se la route è per utenti guest (login e register) e l'utente è autenticato, reindirizza alla dashboard
  if(to.meta.guest && token){
    return next("/dashboard")
  }

  //altrimenti continua
  return next()
})

export default router
