<!--questo componente mostra il modulo createAccoutnForm che permette di creare un nuovo conto, dopodiche reindirizza alla dashboard-->
<template>
  <div class="create-account">
    <h2>Crea un nuovo conto</h2>
    <CreateAccountForm @created="handleCreated" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import CreateAccountForm from '@/components/CreateAccountForm.vue'

const router = useRouter()

const handleCreated = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.create-account {
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
</style>
