<!--questo componente mostra il modulo TransferFundsForms che permette di effettuare una transazione-->
<template>
  <div class="transfer-funds">
    <h2>Trasferisci fondi</h2>
    <TransferFundsForm/>
  </div>
</template>

<script setup>
import TransferFundsForm from '@/components/TransferFundsForm.vue'
</script>

<style scoped>
.transfer-funds {
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