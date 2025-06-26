<!--questo componente mostra la dashboard contenente l'elenco dei conti attivi utilizzando il componente accountCard per ognuno di essi-->
<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>I tuoi conti</h2>
    </div>

    <div v-if="isLoading" class="loading">
      Caricamento conti in corso...
    </div>

    <div v-else-if="accounts.length === 0" class="no-accounts">
      <p>Non hai ancora creato nessun conto.</p>
      <router-link to="/create-account" class="btn-primary">Crea il tuo primo conto</router-link>
    </div>

    <div v-else class="accounts-list">
      <account-card
        v-for="account in activeAccounts"
        :key="account.id"
        :account="account"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import AccountCard from '@/components/AccountCard.vue'

const store = useStore()

const accounts = computed(() => store.getters['accounts/getAccounts']) // ottiene tutti gli account
const isLoading = computed(() => store.getters['accounts/isLoading']) // controlla se lo stato è in caricamento
const activeAccounts = computed(() => accounts.value.filter(a => a.status === 'active')) // filtra solo gli account attivi

onMounted(() => {
  if(accounts.value.length === 0){
    store.dispatch('accounts/fetchAccounts')
  }
})
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.dashboard-header h2 {
  margin: 0;
}

.loading, .no-accounts {
  text-align: center;
  padding: 40px 0;
}

.no-accounts p {
  margin-bottom: 20px;
  color: #666;
  font-size: x-large;
}

.accounts-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
</style>
