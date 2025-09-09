<!-- pagina di benvenuto dell'applicazione per utenti non autenticati; fornisce la panoramica iniziale dell'app e le funzionalità di login e registrazione -->
<template>
  <div class="home">
    <div class="hero">
      <h1>Benvenuto su JP-Banking</h1>
      <p>La soluzione intelligente per la gestione delle finanze personali</p>
      <div class="cta-buttons">
        <router-link to="/login" class="btn-primary" role="button">Accedi</router-link>
        <router-link to="/register" class="btn-secondary" role="button">Registrati</router-link>
      </div>
    </div>

    <div class="features">
      <div class="feature">
        <h3>Gestione Conti</h3>
        <p>Gestisci facilmente tutti i tuoi conti bancari in un unico posto</p>
      </div>
      <div class="feature">
        <h3>Sicurezza</h3>
        <p>Sistema di autenticazione sicuro per proteggere i tuoi dati</p>
      </div>
      <div class="feature">
        <h3>Accessibilità</h3>
        <p>Accedi ai tuoi conti ovunque ti trovi tramite PC, tablet o smartphone</p>
      </div>
    </div>

    <div class="footer">
      <a href="https://github.com/Houdini9494/Houdini9494">Designed & Built by Giacomo Piatto</a>
    </div>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
}

.hero {
  padding: 60px 0;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #666;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.cta-buttons a {
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 500;
}

.features {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

.feature {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 0 10px;
}

.feature h3 {
  color: #4CAF50;
  margin-bottom: 10px;
}

.footer {
  margin: 20px 0;
}
</style>
