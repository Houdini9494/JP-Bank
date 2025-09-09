<!-- questo componente autentica l'utente interfacciandosi con lo store Vuex, mostrando eventuali errori e gestendo la navigazione
 -->
<template>
  <form @submit.prevent="handleSubmit" class="login-form">
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" placeholder="email@mail.com" v-model="email" required :disabled="isLoading"/>
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <div class="psw-wrapper">
        <input :type="showPassword ? 'text' : 'password'" id="password" placeholder="password" v-model="password" required :disabled="isLoading"/>
        <span class="toggle-psw" @click="togglePswVisibility"> {{ showPassword ? '👁️' : '👁️' }}</span>
      </div>
    </div>

    <!-- feedback gestione errori -->
    <p v-if="error" class="error">{{ error }}</p>

    <button type="submit" class="btn-primary" :disabled="isLoading">Accedi</button>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()  //ottiene l'istanza del router per fare l'eventuale redirect dopo il login
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false) //per disabilitare i campi ed il bottone durante il caricamento

// attiva e disattiva l'oscuramento del campo password del form
const togglePswVisibility = () => {
  showPassword.value = !showPassword.value
}

// legge l'errore dallo store vuex
const error = computed(() => store.getters['auth/getError'])

// funzione per la gestione del login
const handleSubmit = async () => {
  isLoading.value=true
  try {
    await store.dispatch('auth/login', { email: email.value, password: password.value })
    // se il login è andato a buon fine reindirizza l'utente
    if (!error.value) {
      router.push('/dashboard')
    }
  } catch (err) {
    console.error("Errore durante il login.", err.customMessage || err.message)
  } finally{
    isLoading.value=false
  }
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.psw-wrapper {
  position:relative;
}

.toggle-psw {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
}

button {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  font-size: 16px;
}
</style>
