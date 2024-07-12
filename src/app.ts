import app from './server'
const cron = require('node-cron');
const fetch = require('node-fetch');
global.fetch = fetch;
const { Client } = require('@microsoft/microsoft-graph-client');
import Turma from './controller/turma.controller'; // Certifique-se de exportar sua função migracaoService corretamente



const PORT = process.env.PORT || 3354

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`)
  // Defina o intervalo de tempo em milissegundos (10 minutos = 10 * 60 * 1000)
  const intervalo = 100 * 60 * 1000;

 
  async function iniciarMigracao() {
    try {
      // Executar a migração inicial
      await Turma.migracaoService();

      // Configurar o intervalo de migração periódica
      setInterval(async () => {
        await Turma.migracaoService();
      }, intervalo);

      console.log('Serviço de migração configurado com sucesso.');
    } catch (err) {
      console.error('Erro ao configurar o serviço de migração:', err);
    }
  }
  cron.schedule('0 0  * * *', async () => {
    await iniciarMigracao();
    console.log('Tarefa agendada executada às 14:40');
  });

  // // Iniciar a migração e configurar o intervalo
  // iniciarMigracao();
})
