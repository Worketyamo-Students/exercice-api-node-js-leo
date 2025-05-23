const express = require('express');
const { initializeDataFile } = require('./controllers/controller.js');
const routes = require('./routes/route.js');

const app = express();
const PORT = 3005;

app.use(express.json());
app.use('/', routes);

async function startServer() {
  try {
    await initializeDataFile();
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Erreur lors du démarrage:', err);
    process.exit(1);
  }
}

startServer();