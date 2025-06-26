<!--questo componente mostra il modulo register che permette di effettuare la registrazione di un nuovo utente -->
<template>
  <div class="register">
    <h2>Crea nuovo account utente</h2>
    <RegisterForm/>
    <p class="login-link">
      Hai già un account?
      <router-link to="/login">Accedi</router-link>
    </p>
  </div>
</template>

<script setup>
import RegisterForm from '@/components/RegisterForm.vue'
</script>

<style scoped>
.register {
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

.login-link {
  text-align: center;
  margin-top: 20px;
}

.login-link a {
  color: #4CAF50;
  text-decoration: none;
  font-weight: 500;
}
</style>