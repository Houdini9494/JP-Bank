
<!-- pagina di registrazione che fornisce un form per inserire i campi necessari e richiedendo le varie conferme di accettazione con le checkbox;
 successivamente invia i dati al backend tramite 'auth/register' e mostra eventuali errori -->
  <template>
    <form @submit.prevent="handleSubmit" class="register-form">
      <div class="form-group">
        <label for="name">Nome e Cognome</label>
        <input type="text" id="name" v-model="name" placeholder="nome cognome" required/>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="email@mail.com" required/>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="psw-wrapper">
          <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" placeholder="password" required minlength="8"/>
          <!-- occhio cliccabile per toggle visibilità password -->
          <span class="toggle-psw" @click="togglePswVisibility"> {{ showPassword ? '👁️' : '👁️' }}</span>
        </div>
      </div>

      <!-- checkbox -->
      <div class="form-group checkbox-group">
        <label>
          <input type="checkbox" v-model="acceptPrivacy"/>
          <span>Accetto l'<a href="/privacy.html" target="_blank">informativa sulla privacy</a> *</span>
        </label>
        <label>
          <input type="checkbox" v-model="acceptTerms"/>
          <span>Accetto i <a href="/termini.html" target="_blank">termini e condizioni</a> *</span>
        </label>
        <label>
          <input type="checkbox" v-model="acceptData"/>
          <span>Acconsento al <a href="/trattamento_dati.html" target="_blank">trattamento dei dati personali</a> *</span>
        </label>
        <label>
          <input type="checkbox" v-model="acceptMarketing"/>
          Acconsento a ricevere comunicazioni di marketing
        </label>
      </div>

      <!-- feedback gestione errori -->
      <p v-if="localError" class="error">{{ localError }}</p> <!-- errore di validazione dal frontend -->
      <p v-if="error" class="error">{{ error }}</p> <!-- errore da 'auth/getError' -->

      <button type="submit" :disabled="isLoading" class="btn-primary">Registrati</button>
    </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const acceptPrivacy = ref(false)
const acceptTerms = ref(false)
const acceptData = ref(false)
const acceptMarketing = ref(false)

// attiva e disattiva l'oscuramento del campo password del form
const togglePswVisibility = () => {
  showPassword.value = !showPassword.value
}

// recupera lo stato globale dell'errore dal modulo auth
const error = computed(() => store.getters['auth/getError'])
// gestione locale dell'errore e dello stato di caricamento
const localError = ref('')
const isLoading = ref(false)

//verifica l'accettazione di tutte le checkbox
const allAccepted = computed(() =>
    acceptPrivacy.value && acceptTerms.value && acceptData.value
)

// validazione del frontend
const handleSubmit = async () => {
    localError.value = ''
    isLoading.value = true

    if (!name.value || !email.value || !password.value) {
    localError.value = 'Compila tutti i campi richiesti.'
    return
    }

    if (!allAccepted.value) {
    localError.value = 'Devi accettare tutte le condizioni obbligatorie.'
    return
    }

    // esegue auth/register passandogli i dati del form
    try {
      await store.dispatch('auth/register', {
          name: name.value,
          email: email.value,
          password: password.value,
          marketing: acceptMarketing.value
      })
    } catch (err) {
      localError.value = 'Errore durante la registrazione'
    } finally {
      isLoading.value = false
    }
}
</script>

<style scoped>
.register-form {
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

.checkbox-group label {
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-weight: normal;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 10px;
  width: auto;
}

button {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  font-size: 16px;
}

.error {
  color: #FF0000;
  margin-top: 10px;
  text-align: center;
}
</style>
