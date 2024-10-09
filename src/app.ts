import app from './server';
const cron = require('node-cron');
const fetch = require('node-fetch');
global.fetch = fetch;
const { Client } = require('@microsoft/microsoft-graph-client');
import Turma from './controller/turma.controller'; // Certifique-se de exportar sua função migracaoService corretamente

const PORT = process.env.PORT || 3354;

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);

  async function iniciarMigracao() {
    try {
      // Executar a migração
      await Turma.migracaoService();
      console.log('Migração executada com sucesso.');
    } catch (err) {
      console.error('Erro ao executar a migração:', err);
    }
  }
  // await iniciarMigracao();

  // Agendar a migração para ser executada todos os dias às 17:35
  cron.schedule('28 13 * * *', async () => {
    console.log('Executando a tarefa agendada para a migração às 17:35');
    await iniciarMigracao();
  });

  console.log('Serviço de migração agendado para todos os dias às 17:35.');
});
