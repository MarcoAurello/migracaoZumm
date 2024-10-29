import app from './server';
const cron = require('node-cron');
const fetch = require('node-fetch');
global.fetch = fetch;
const { Client } = require('@microsoft/microsoft-graph-client');
import Turma from './controller/turma.controller'; // Certifique-se de exportar sua função migracaoService corretamente
import Aluno from './controller/aluno.controller'; // Certifique-se de exportar sua função migracaoService corretamente

const PORT = 3555;

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

  async function iniciarMigracaoDia() {
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
  cron.schedule('36 10 * * *', async () => {
    console.log('Executando a tarefa agendada para a migração às 17:35');
    await iniciarMigracao();
  });

//   cron.schedule('*/1 * * * *', async () => {
//     console.log('Executando a tarefa agendada a cada 10 minutos');
//     await iniciarMigracaoDia();
// });

async function executarServicos() {
  try {
    await Turma.migracaoService();
    await Turma.verificarProfissionalService();
    await Aluno.migracaoService();
    await Aluno.criarEmailService();
    await Aluno.vincularAlunoService();
  } catch (error) {
    console.error('Erro ao executar serviços:', error);
  }
}

// Chame a função
executarServicos();



setInterval(executarServicos, 600000);




  console.log('Serviço de migração agendado para todos os dias às 17:35.');
});
