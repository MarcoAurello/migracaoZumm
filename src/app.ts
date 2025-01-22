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

//   cron.schedule('*/10 * * * *', async () => {
//     console.log('Executando a tarefa agendada a cada 10 minutos');
//     await executarServicos();
// });

async function executarServicos() {
  while (true) { // Loop infinito
    try {
      console.log("Iniciando execução dos serviços...");

      await Turma.migracaoService();
      await Turma.verificarProfissionalService();
      // await Turma.CoordenadorService();
      

      await Aluno.migracaoService();
      await Aluno.criarEmailService();
      await Aluno.vincularAlunoService();

      console.log("Execução dos serviços concluída. Aguardando 2 minutos antes de reiniciar...");

      // Delay de 2 minutos (120.000 ms)
      await new Promise(resolve => setTimeout(resolve, 120000));

    } catch (error) {
      console.error('Erro ao executar serviços:', error);

      // Em caso de erro, ainda aguardamos 2 minutos antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}


executarServicos();




setInterval(executarServicos, 600000);




  console.log('Serviço de migração agendado para todos os dias às 17:35.');
});
