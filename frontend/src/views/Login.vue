<!-- pagina di accesso che mostra un loginForm che permette di gestire l'autenticazione; se ha successo viene fatto un reindirizzamento alla dashboard, altrimenti mostra un messaggio di errore -->
<template>
  <div class="login">
    <h2>Accedi al tuo account</h2>
    <login-form/>
    <p class="register-link">
      Non hai un account?
      <router-link to="/register">Registrati</router-link>
    </p>

    <p v-if="error" class="error" aria-live="assertive" role="alert">{{ error }}</p>
  </div>
</template>

<script setup>
import LoginForm from '@/components/LoginForm.vue'
</script>

<style scoped>
.login {
  max-width: 500px;
  margin: 40px auto;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.register-link {
  text-align: center;
  margin-top: 20px;
}

.register-link a {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 500;
}

.loading {
  text-align: center;
  color: #4CAF50;
}

.error {
  text-align: center;
  color: #FF0000;
}
</style>
