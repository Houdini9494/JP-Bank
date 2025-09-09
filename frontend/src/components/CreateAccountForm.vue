<!--questo componente fornisce il modulo per la creazione di un nuovo conto, con validazione e messaggi di feedback-->
<template>
  <form @submit.prevent="handleSubmit" class="create-account-form">
    <!-- scelta nome conto -->
    <div class="form-group">
      <label for="name">Nome del conto</label>
      <input type="text" id="name" v-model="name" required :disabled="isLoading" placeholder="-"/>
    </div>

    <!-- scelta tipo di conto -->
    <div class="form-group">
      <label for="type">Scegli il tipo di conto da aprire: </label>
      <select v-model="type" required>
        <option value="current">Corrente</option>
        <option value="deposit">Deposito</option>
        <option value="investing">Investimento</option>
      </select>
    </div>

    <!-- checkbox -->
    <div class="form-group checkbox-group">
      <label class="checkbox-label">
        <input type="checkbox" v-model="acceptTerms" />
        <span>Accetto i <a href="/termini.html" target="_blank">termini e condizioni</a></span>
      </label>
    </div>

    <div class="form-group checkbox-group">
      <label class="checkbox-label">
        <input type="checkbox" v-model="acceptPrivacy" />
        <span>Accetto l'<a href="/privacy.html" target="_blank">informativa sulla privacy</a></span>
      </label>
    </div>

    <div class="form-group checkbox-group">
      <label class="checkbox-label">
        <input type="checkbox" v-model="acceptData" />
        <span>Acconsento al <a href="/trattamento_dati.html" target="_blank">trattamento dei dati personali</a></span>
      </label>
    </div>

    <!-- feedback utente -->
    <p v-if="successMessage" class="form-message success" role="status">{{ successMessage }}</p>
    <p v-if="errorMessage" class="form-message error" role="alert">{{ errorMessage }}</p>

    <!-- bottone di submit -->
    <button type="submit" class="btn-primary" :disabled="isLoading">
      {{ isLoading ? 'Creazione in corso...' : 'Crea conto' }}
    </button>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const name = ref('')
const type = ref('')
const acceptTerms = ref(false)
const acceptPrivacy = ref(false)
const acceptData = ref(false)

// leggono gli stati sallo store
const storeError = computed(() => store.getters['accounts/getError'])
const isLoading = computed(() => store.getters['accounts/isLoading'])

const errorMessage = ref('')
const successMessage = ref('')

// se lo store riceve un errore (es. limite conti) lo mostra automaticamente
watch(storeError, val => {
  if (val) {
    errorMessage.value = val
  }
})

//funzione principale; valida i consensi, chiama l'azione dallo store e mostra il messaggio corretto in base all'esito
const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!acceptTerms.value || !acceptPrivacy.value || !acceptData.value) {
    errorMessage.value = 'Devi accettare tutti i consensi per proseguire.'
    return
  }

  try{
    const success = await store.dispatch('accounts/createAccount', {
      name: name.value,
      balance: 0,
      type: type.value,
      acceptTerms: true,
      acceptPrivacy: true,
      acceptData: true
    })

    if (success) {
      successMessage.value = 'Conto creato con successo.'
      name.value = ''
      type.value = ''
      acceptTerms.value = false
      acceptPrivacy.value = false
      acceptData.value = false
    }
  }catch(error){
    /*Uso il nuovo campo impostato dall’interceptor (`customMessage`), in fallback mantengo il messaggio generico.*/
    errorMessage.value = error.customMessage || 'Errore imprevisto durante la creazione del conto'
  }
}
</script>

<style scoped>
.create-account-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
}

input[type='text'] {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

input[type="checkbox"]{
  width:auto
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
}

.checkbox-label a {
  color: #007bff;
  text-decoration: underline;
}

.checkbox-label a:hover {
  text-decoration: none;
}

.form-message {
  text-align: center;
  margin-top: 15px;
  font-weight: 500;
}

.form-message.error {
  color: #d32f2f;
}

.form-message.success {
  color: #388e3c;
}
</style>
