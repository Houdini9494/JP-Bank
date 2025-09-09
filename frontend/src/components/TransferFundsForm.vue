<!-- questo componente consente ad un utente autenticato di trasferire fondi da uno dei suoi conti attivi verso un altro conto (proprio o di un altro utente) -->
<template>
  <form @submit.prevent="submitTransfer" class="form">

    <!-- selezione conto -->
    <div class="form-group">
      <label class="form-label">Conti mittente</label>
      <select v-model="form.senderAccountId" class="form-input" :disabled="filteredAccounts.length === 0">
        <option v-for="account in filteredAccounts" :key="account.id" :value="account.id">
          {{ generatePseudoIBAN(account.id) }} – €{{ account.balance }}
        </option>
      </select>
      <p v-if="filteredAccounts.length === 0" class="form-error">Non hai conti con saldo sufficiente per trasferire fondi.</p>
    </div>

    <!-- campi da compilare -->
    <div class="form-group">
      <label class="form-label">N° conto corrente destinatario (ultime 12 cifre)</label>
      <input type="text" v-model="form.receiverAccountId" class="form-input" maxlength="12" inputmode="numeric" placeholder="#############"/>
    </div>

    <div class="form-group">
      <label class="form-label">Importo</label>
      <input type="number" step="0.01" v-model="form.amount" class="form-input" placeholder="##.##"/>
    </div>

    <div class="form-group">
      <label class="form-label">Causale</label>
      <input type="text" v-model="form.description" class="form-input" placeholder="descrizione"/>
    </div>

    <!-- checkbox; il submit è disabilitato se la checkbox non viene spuntata -->
    <div class="form-group">
      <label class="checkbox-label">
        <input type="checkbox" v-model="form.confirmed" class="checkbox" />
        <span>Confermo di voler inviare questa transazione</span>
      </label>
    </div>

    <!-- gestione errori -->
    <p v-if="message" class="success-message">{{ message }}</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    <br></br>

    <button
      :disabled="!form.confirmed"
      class="submit-button"
    >
      Invia fondi
    </button>
  </form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import api from '@/services/api.js'

const store = useStore()
const userAccounts = ref([])
const form = ref({
    senderAccountId: '',
    receiverAccountId: '',
    amount: '',
    description: '',
    confirmed: false
})
const message = ref('')
const error = ref('')

//filtra i conti con saldo 0
const filteredAccounts = computed(() => {
    return userAccounts.value.filter(account => account.balance > 0);
})

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

//chiamata iniziale per ottenere i conti utente
onMounted(async () => {
    try {
        const res = await api.get('/accounts', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        })
        userAccounts.value = res.data
    } catch (err) {
        error.value = err.customMessage || 'Errore nel caricamento dei conti'
    }
})

//invia la richiesta di trasferimento
const submitTransfer = async() => {
  try {
    message.value = '';
    error.value = '';

    //validazione input "n° conto corrente destinatario"
    if (!/^\d{12}$/.test(form.value.receiverAccountId)) {
      error.value = 'Inserito conto destinatario errato!';
      return;
    }

    //validazione input "importo"
    if (isNaN(parseFloat(form.value.amount)) || parseFloat(form.value.amount) <= 0) {
      error.value = 'Inserisci un importo valido';
      return;
    }

    //fa una post al backend per eseguire la transazione con i dati passati
    const res = await api.post('/transactions/',
      {
        senderAccountId: form.value.senderAccountId,
        receiverAccountId: form.value.receiverAccountId,
        amount: form.value.amount,
        description: form.value.description
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    //feedback dell'operazione
    message.value = res.data.message;
    await store.dispatch('accounts/fetchAccounts');

    //reset dei campi
    form.value.amount = '';
    form.value.receiverAccountId = '';
    form.value.description = '';
    form.value.confirmed = false;
  } catch (err) {
    console.error('Errore nella transazione:', err);
    error.value = err.customMessage || 'Errore nella transazione';
  }
}
</script>

<style scoped>
.transfer-container {
  max-width: 28rem;
  margin: 2rem auto;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  border-radius: 0.375rem;
}

.transfer-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
}

.form-error {
  color: #dc2626;
  margin-top: 0.5rem;
}

.checkbox-label {
  display: inline-flex;
  align-items: center;
}

.checkbox {
  margin-right: 0.5rem;
  width:auto;
}

.submit-button {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #2563eb;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.success-message {
  margin-top: 1rem;
  color: #16a34a;
}

.error-message {
  margin-top: 1rem;
  color: #dc2626;
}
</style>