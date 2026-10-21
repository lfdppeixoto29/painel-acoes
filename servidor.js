const express = require('express');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const { rodarAgente } = require('./agente');

const app = express();
const PORTA = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/dados', (req, res) => {
  const arquivo = path.join(__dirname, 'dados-mercado.json');
  if (!fs.existsSync(arquivo)) {
    rodarAgente();
  }
  const dados = fs.readFileSync(arquivo, 'utf-8');
  res.setHeader('Content-Type', 'application/json');
  res.send(dados);
});

app.post('/api/atualizar', (req, res) => {
  try {
    rodarAgente();
    res.json({ sucesso: true, mensagem: 'Agente executado com sucesso!' });
  } catch (e) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

cron.schedule('0 9 * * *', () => {
  console.log('[CRON] Executando agente diário automatizado...');
  rodarAgente();
});

if (!fs.existsSync(path.join(__dirname, 'dados-mercado.json'))) {
  rodarAgente();
}

app.listen(PORTA, () => {
  console.log('Painel online rodando na porta ' + PORTA);
});
