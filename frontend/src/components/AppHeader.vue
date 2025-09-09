<!-- questo componente definisce l'intestazione dell'applicazione, permette la gestione responsive della navigazione all'interno dell'app, adattandosi anche ai dispositivi mobili e 
 gestisce l'autenticazione per mostrare i link corretti-->
<template>
  <header class="header">
    <div class="container header-content">
      <h1 class="logo">JP-Banking</h1>

      <!-- hamburger per dispositivi di dimensioni ridotte -->
      <button class="hamburger" @click="toggleMenu" ref="buttonRef" v-show="isAuthenticated">
        ☰
      </button>

      <!-- NAV sempre presente, si mostra/nasconde con v-show -->
      <nav
        class="nav"
        :class="{ open: isMenuOpen }"
        ref="menuRef"
        v-show="isAuthenticated || !isMobile"
      >
        <template v-if="isAuthenticated">
          <router-link
            to="/dashboard"
            class="nav-link"
            :class="{ active: isActive('/dashboard') }"
            @click="closeMenu"
          >Dashboard</router-link>
          <router-link
            to="/create-account"
            class="nav-link"
            :class="{ active: isActive('/create-account') }"
            @click="closeMenu"
          >Nuovo Conto</router-link>
          <router-link
            to="/transfer"
            class="nav-link"
            :class="{ active: isActive('/transfer') }"
            @click="closeMenu"
          >Invia Denaro</router-link>
          <button @click="logout" class="nav-link logout">Log Out</button>
        </template>
        <template v-else>
          <router-link
            to="/login"
            class="nav-link"
            :class="{ active: isActive('/login') }"
          >Accedi</router-link>
          <router-link
            to="/register"
            class="nav-link"
            :class="{ active: isActive('/register') }"
          >Registrati</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const store = useStore()
const route = useRoute()

// prende dallo store l'informazione relativa all'autenticazione dell'utente
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])

const isMenuOpen = ref(false)
const isMobile = ref(window.innerWidth <= 768)

//riferimenti per la gestione dei click nel DOM
const menuRef = ref(null)
const buttonRef = ref(null)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
const closeMenu=()=>{
  isMenuOpen.value=false
}

// chiude il menu dropdown se viene fatto un click al di fuori di esso
const handleClickOutside = (event) => {
  if (isMobile.value && isMenuOpen.value && menuRef.value && buttonRef.value && !menuRef.value.contains(event.target) && !buttonRef.value.contains(event.target)) {
    isMenuOpen.value = false
  }
}

// se il dispositivo ha una width maggiore non è mobile e quindi non viene mostrato il menu dropdown
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) isMenuOpen.value = false
}

const logout = () => {
  store.dispatch('auth/logout')
}

// verifica se il percorso passato coem parametro è attualmente attivo
const isActive = (path) => route.path === path

// Event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.header {
  background-color: #4CAF50;
  color: white;
  padding: 10px 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.logo {
  font-size: 24px;
  font-weight: 700;
}

.hamburger {
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  display: none;
}

/* base nav */
.nav {
  display: flex;
  gap: 20px;
  transition: all 0.3s ease;
  z-index: 999;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.nav-link.active {
  border-bottom: 2px solid white;
}

.logout {
  background: white;
  border: none;
  color: #4CAF50;
  font-size: 16px;
  padding: 0 10px;
  font-weight: 750;
  cursor: pointer;
}

/* mobile */
@media (max-width: 768px) {
  .hamburger {
    display: block;
    z-index:999
  }

  .nav {
    flex-direction: column;
    position: absolute;
    top: 100%;
    right: 10px;
    background-color: #4CAF50;
    padding: 10px;
    border-radius: 5px;
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
  }

  .nav.open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: all;
  }
}
</style>
