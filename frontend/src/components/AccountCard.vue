<!-- questo componente mostra le informazioni di un conto, consente la sua chiusura se il saldo è pari a 0 e visualizza dinamicamente le transazioni associate ad esso (se presenti)-->
<template>
  <!-- card conto -->
  <div class="account-card">
    <h3>Nome conto: {{ account.name }}</h3>
    <h3>IBAN: {{ generatePseudoIBAN(account.id) }}</h3>
    <h3>Tipo di conto: {{ account.type }}</h3>

    <div class="account-info">
      <h3>Saldo:</h3>
      <span class="balance">€{{ account.balance }}</span>
    </div>

    <!-- Bottone chiudi conto -->
    <button
      v-if="isClosable"
      class="close-account-button"
      @click="showClosePopup = true"
    >
      Chiudi conto
    </button>

    <!-- popup di conferma chiusura -->
    <div v-if="showClosePopup" class="popup" role="dialog" aria-modal="true">
      <div class="popup-content">
        <h3>Chiudere il conto?</h3>
        <p>Sei sicuro di voler chiudere questo conto? L'operazione è irreversibile.</p>
        <div style="margin-top: 15px;">
          <button class="confirm-button" @click="handleCloseAccount" :disabled="closing">
            {{ closing ? 'Chiudo..' : 'Sì, chiudi conto' }}
          </button>
          <button class="close-button" @click="showClosePopup = false">Annulla</button>
        </div>
      </div>
    </div>

    <!-- dettagli transazioni -->
    <div class="transactions" v-if="transactions">
      <h4>Transazioni Inviate</h4>
      <ul v-if="sentTransactions.length">
        <li v-for="tx in sentTransactions" :key="tx.id">
          ← IBAN: {{ generatePseudoIBAN(tx.receiver_id) }}, Importo: €{{ tx.amount }},
          Data: {{ tx.timestamp.substring(0,10) }}
        </li>
      </ul>
      <p v-else>-</p>

      <h4>Transazioni Ricevute</h4>
      <ul v-if="receivedTransactions.length">
        <li v-for="tx in receivedTransactions" :key="tx.id">
          → IBAN: {{ generatePseudoIBAN(tx.sender_id) }}, Importo: €{{ tx.amount }},
          Data: {{ tx.timestamp.substring(0,10) }}
        </li>
      </ul>
      <p v-else>-</p>
    </div>
  </div>
</template>

<script setup>
import { watch, computed, ref } from 'vue'
import { useStore } from 'vuex'

// in vue, "props" permette ad un componente figlio di accettare dati in ingresso dal genitore che lo utilizza (Dashboard.vue)
// mentre "emit" permette di passare un evento da un figlio ad un parent
const props = defineProps({account: Object})
const store = useStore()

//genera uno pseudo IBAN da mostrare per identificare il conto
const generatePseudoIBAN = (id) => {
  const countryCode = 'IT';
  const internationalCheck = '96';
  const nationalCheck = 'W';
  const abiCode = '05856';
  const cabCode = '11601';
  // formatta l'id del conto con il formato di 12 numeri tipico dei conti correnti
  const accountId = id?.toString().padStart(12, '0')

  return `${countryCode}${internationalCheck}${nationalCheck}${abiCode}${cabCode}${accountId}`
}

//viene mostrato il bottone per chiudere il conto, solo se il saldo è pari a 0
const isClosable = computed(() => Number(props.account.balance) === 0)
const closing = ref(false)
const showClosePopup = ref(false)

//restituisce le transazioni del conto in modo dinamico
const transactions = computed(() =>
  store.state.transactions.transactionsByAccount[props.account.id],
)

//filtra le transaioni per mostrare solo le ultime 5
const sentTransactions = computed(() => {
  return transactions.value?.sent?.slice(0, 5) || []
})
const receivedTransactions = computed(() => {
  return transactions.value?.received?.slice(0, 5) || []
})

// monitora i cambiamenti di account.id e quando c'è un cambiamento chiede a vuex (store) di caricare le transazioni di quel conto
watch(
  () => props.account.id,
  (accountId) => {
    if (accountId) {
      store.dispatch('transactions/fetchTransactionsByAccountId', accountId)
    }
  },
  {immediate: true}
)

// gestione della chiusura di un conto
const handleCloseAccount = async () => {
  closing.value=true;
  try{
    await store.dispatch('accounts/closeAccount',props.account.id)
    showClosePopup.value=false;
  } catch(err){
    alert(err.customMessage || 'Errore nella chiusura del conto')
  } finally {
    closing.value=false
  }
}
</script>

<style scoped>
.account-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 15px;
  position: relative;
}

.account-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.balance {
  font-size: 18px;
  font-weight: 700;
  color: #4CAF50;
}

/* pop-up */
.popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f2f2f2;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  z-index: 100;
  width: 90%;
  max-width: 400px;
}

.popup-content {
  text-align: center;
}

/* pop-up, bottone annulla */
.close-button {
  margin-top: 15px;
  padding: 8px 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #43a047;
}

/* bottone chiudi conto */
.close-account-button {
  background-color: #e53935;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.close-account-button:hover {
  background-color: #c62828;
}

/*pop-up, bottone conferma chiusura*/
.confirm-button {
  background-color: #e53935;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.confirm-button:hover {
  background-color: #c62828;
}

.transactions {
  margin-top: 15px;
  margin-bottom: 5px;
}

.transactions h4 {
  margin-top: 5px;
}

.transactions ul {
  list-style: none;
  padding: 0;
}

</style>
