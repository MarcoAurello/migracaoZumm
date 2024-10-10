import { CircularProgress, FormControl, InputLabel, MenuItem, Select, SpeedDial } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import TaskAluno from '../components/task-aluno'


import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const getCookie = require('../utils/getCookie')

const Alunos = (props) => {

  const { id } = props.match.params;

  const [openLoadingDialog, setOpenLoadingDialog] = useState(false)
  const [openMessageDialog, setOpenMessageDialog] = useState(false)
  const [message, setMessage] = useState('')

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [caminho, setCaminho] = useState('');
  const [turmaSelecinada, setTurmaSelecinada] = useState([]);
  const [progress, setProgress] = useState(0); // Estado para guardar o progresso
  const [isLoading, setIsLoading] = useState(false); // Estado para gerenciar o loading
  const [hasError, setHasError] = useState(false); // Estado para detectar erros





  const [chamado, setChamado] = useState(null);

  const [fkUsuario, setFkUsuario] = useState(null);
  const [fkCham, setFkCham] = useState(null);
  const [executor, setExecutor] = useState('');
  const [obsDemandante, setObsDemandante] = useState('');
  const [criticidadeChefe, setCriticidade] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [CriarTodosEmails, setCriarTodosEmails] = useState([]);

  const [VincularTodosEmails, setVincularTodosEmails] = useState([]);

  const handleCriarTodosChange = (e) => {
    if (e.target.checked) {
      // Se marcado, armazena o ID de todos os alunos sem email
      const todosIds = alunos
        .filter(item => item.Aluno.emailCriado === false)
        .map(item => item.Aluno.id);
      setCriarTodosEmails(todosIds);
    } else {
      // Se desmarcado, limpa a lista de IDs
      setCriarTodosEmails([]);
    }
  };

  const handleVincularTodosChange = (e) => {
    if (e.target.checked) {
      // Se marcado, armazena o ID de todos os alunos sem email
      const todosIds = alunos
        .filter(item => (item.Aluno.alunoVinculado === false &&
          item.Aluno.emailCriado === true
        ))
        .map(item => item.Aluno.email);
      setVincularTodosEmails(todosIds);
    } else {
      // Se desmarcado, limpa a lista de IDs
      setVincularTodosEmails([]);
    }
  };




  const [open, setOpen] = useState(false);





  const [alunos, setAlunos] = useState([]);


  function carregarRegistro() {
    // alert(id)
    setOpenLoadingDialog(true)
    const token = getCookie("_token_task_manager")
    const params = {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/turmaAluno/${id ? id : ''}`, params)
      .then(response => {
        const { status } = response
        response.json().then(data => {
          setOpenLoadingDialog(false)
          if (status === 401) {
            // setMessage(data.message)
            // setOpenMessageDialog(true)
          } else if (status === 200) {
            setOpenLoadingDialog(false)
            setAlunos(data.data)


            // setCreateAd(data.data.createdAt)






          }
        }).catch(err => setOpenLoadingDialog(false))
      })
  }

  function carregarEscolhido() {
    // alert(id)
    setOpenLoadingDialog(true)
    const token = getCookie("_token_task_manager")
    const params = {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/turma/${id}`, params)
      .then(response => {
        const { status } = response
        response.json().then(data => {
          setOpenLoadingDialog(false)
          if (status === 401) {
            // setMessage(data.message)
            // setOpenMessageDialog(true)
          } else if (status === 200) {
            setOpenLoadingDialog(false)
            setTurmaSelecinada(data.data)

          }
        }).catch(err => setOpenLoadingDialog(false))
      })
  }


  const onSave = (item) => {
    // alert('1')



    setOpenLoadingDialog(true)
    const token = getCookie("_token_task_manager")
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        idTurma: id,
        email: item
      })
    }

    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/aluno/`, params)
      .then(response => {
        const { status } = response
        response.json().then(data => {
          setOpenLoadingDialog(false)
          if (status === 401) {
            alert(data.message)
            // setOpenMessageDialog(true)
            // window.location.pathname = "/login"
          } else if (status === 200) {
            // setOpen(false)
            // alert(JSON.stringify(data.data))
            alert(data.message)
            window.location.reload()
            // alert(data.message)
            // setQuantidade('')
            // setOpenMessageDialog(true)
            // setSolicitar(false)
            // window.location.reload()
            // setArea(data.data)
          }
        }).catch(err => setOpenLoadingDialog(true))
      })



  }




  const onVinculateEmailAll = (VincularTodosEmails) => {
    setOpenLoadingDialog(true);
    const token = getCookie("_token_task_manager");
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        VincularTodosEmails,
        idTurma: id // Certifique-se de que 'id' é o ID da turma
      })
    };

    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/aluno/vincularAllEmailInstitucional`, params)
      .then(response => {
        const { status } = response;
        response.json().then(data => {
          setOpenLoadingDialog(false);

          if (status === 401) {
            alert(data.message);
            console.error('Erro de autenticação:', data.message);
          } else if (status === 200) {
            console.log('Resultado do backend:', data.resultados); // Exibe o resultado completo no console
            alert(`Processo concluído: ${data.message}`);

            // Exibir os detalhes de cada aluno vinculado
            let mensagemResultado = "";
            data.resultados.forEach(resultado => {
              console.log(`Email: ${resultado.email}, Status: ${resultado.status}`);
              mensagemResultado += `Email: ${resultado.email}, Status: ${resultado.status}\n`;
            });

            alert(mensagemResultado); // Exibe todos os resultados na tela
            window.location.reload(); // Recarrega a página após a operação
          }
        }).catch(err => {
          setOpenLoadingDialog(false);
          console.error('Erro no parsing da resposta:', err);
          alert('Erro ao processar resposta do servidor');
        });
      })
      .catch(err => {
        setOpenLoadingDialog(false);
        console.error('Erro na requisição:', err);
        alert('Erro ao conectar com o servidor');
      });
  };


  const onCreateEmail = (item) => {


    setOpenLoadingDialog(true)
    const token = getCookie("_token_task_manager")
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        alunoId: item,
        idTurma: id
      })
    }

    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/aluno/createEmailInstitucional`, params)
      .then(response => {
        const { status } = response
        response.json().then(data => {
          setOpenLoadingDialog(false)
          if (status === 401) {
            alert(data.message)
            // setOpenMessageDialog(true)
            // window.location.pathname = "/login"
          } else if (status === 200) {
            // setOpen(false)
            // alert(JSON.stringify(data.data))
            alert(data.message)
            // alert(data.message)
            // setQuantidade('')
            // setOpenMessageDialog(true)
            // setSolicitar(false)
            window.location.reload()
            // setArea(data.data)
          }
        }).catch(err => setOpenLoadingDialog(true))
      })



  }

  // const onCreateEmailAll = (CriarTodosEmails) => {
  //   setOpenLoadingDialog(true);
  //   const token = getCookie("_token_task_manager");
  //   const params = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`
  //     },
  //     body: JSON.stringify({ CriarTodosEmails })
  //   };

  //   fetch(`${process.env.REACT_APP_DOMAIN_API}/api/aluno/createAllEmailInstitucional`, params)
  //     .then(response => {
  //       const { status } = response;
  //       response.json().then(data => {
  //         setOpenLoadingDialog(false);
  //         if (status === 401) {
  //           alert(data.message);
  //           console.error('Erro de autenticação:', data.message);
  //         } else if (status === 200) {
  //           console.log('Resultado do backend:', data.resultados);
  //           alert(`Processo concluído: ${data.message}`);
  //           // Exibir os detalhes na tela ou em logs adicionais
  //           data.resultados.forEach(resultado => {
  //             console.log(`Aluno ID: ${resultado.alunoId}, Status: ${resultado.status}`);
  //           });
  //           window.location.reload();
  //         }
  //       }).catch(err => {
  //         setOpenLoadingDialog(false);
  //         console.error('Erro no parsing da resposta:', err);
  //         alert('Erro ao processar resposta do servidor');
  //       });
  //     })
  //     .catch(err => {
  //       setOpenLoadingDialog(false);
  //       console.error('Erro na requisição:', err);
  //       alert('Erro ao conectar com o servidor');
  //     });
  // };






  //   const carregarRegistro = (currentPage, pageSize) => {
  //     setOpenLoadingDialog(true);
  //     const token = getCookie('_token_task_manager');

  //     fetch(`${process.env.REACT_APP_DOMAIN_API}/api/turmaAluno/${currentPage}`, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     })
  //       .then(response => {
  //         setOpenLoadingDialog(false);
  //         if (!response.ok) {
  //           throw new Error('Erro ao carregar os registros');
  //         }
  //         return response.json();
  //       })
  //       .then(data => {
  //         // Atualize o estado dos alunos com os dados retornados
  //         setAlunos(data.data);
  //       })
  //       .catch(error => {
  //         console.error('Erro ao carregar os registros:', error);
  //         setOpenLoadingDialog(false);
  //       });
  //   };

  // Chame a função carregarRegistro uma vez que o componente é montado

  const onCreateEmailAll = (CriarTodosEmails) => {
    setIsLoading(true); // Inicia o loading
    setHasError(false); // Reseta o erro

    // Fazer a requisição POST para iniciar o processo de criação de e-mails
    const token = getCookie("_token_task_manager"); // Obtendo o token
    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/aluno/createAllEmailInstitucional`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ CriarTodosEmails })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Após iniciar o processo no backend, começar a escutar as atualizações de progresso
          const eventSource = new EventSource(`${process.env.REACT_APP_DOMAIN_API}/api/aluno/progressCreateAllEmail`);

          eventSource.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);

            // Atualiza a barra de progresso
            if (parsedData.progress !== undefined) {
              setProgress(parsedData.progress); // Atualiza o progresso no estado
            }

            // Verifica se o processo foi concluído
            if (parsedData.message === 'Processo concluído') {
              alert('Todos os e-mails foram criados com sucesso!');
              eventSource.close();
              setIsLoading(false); // Para o loading
            }
          };

          // Se houver erro na conexão com o EventSource
          eventSource.onerror = (err) => {
            console.error('Erro ao conectar ao servidor:', err);
            setHasError(true); // Indica erro
            eventSource.close();
            setIsLoading(false); // Para o loading
          };
        } else {
          alert('Erro ao iniciar o processo.');
          setIsLoading(false); // Para o loading
        }
      })
      .catch(err => {
        console.error('Erro ao fazer a requisição:', err);
        setHasError(true); // Define erro
        setIsLoading(false); // Para o loading
      });
  };



  useEffect(() => {
    carregarRegistro();
    carregarEscolhido()





    // if(turmaSelecinada){
    //   alert(JSON.stringify(turmaSelecinada))

    // }

  }, []);

  return (

    <div>



      <button style={{
        padding: '8px 16px', margin: '0 5px',
        backgroundColor: '#007bff', color: '#fff', border: 'none',
        borderRadius: '4px', cursor: 'pointer',
        transition: 'background-color 0.3s ease'
      }} onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/home/`}>
        home</button>

      <hr></hr>









      <p></p>
      {/* {alunos.Turma.turmaNome} */}

      <b>Turma: </b>{turmaSelecinada ? turmaSelecinada.turmaNome : ''}
      <b style={{ marginLeft: '10px' }}>Codigo: </b>{turmaSelecinada ? turmaSelecinada.codigoFormatado : ''}
      <a
        style={{
          marginLeft: '10px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50', // Cor de fundo verde
          color: 'white',             // Cor do texto
          textDecoration: 'none',     // Remove o sublinhado
          borderRadius: '5px',        // Bordas arredondadas
          display: 'inline-block',    // Para respeitar o padding e o background
          transition: 'background-color 0.3s ease', // Suave ao passar o mouse
        }}
        href={turmaSelecinada ? turmaSelecinada.linkTurma : ''}
        target="_blank" // Abre o link em uma nova aba
        rel="noopener noreferrer" // Segurança ao abrir links externos
      >
        Entrar na sala do Teams
      </a>

      <p></p>


      <div
        style={{
          marginLeft: '10px',
          marginRight: '10px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 100,
          color: '#333333',
          padding: 16,
          background: '#FFFFFF',
          borderRadius: 8,
          marginBottom: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E1E1E1',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              flex: 1,
              marginRight: '10px',
              padding: '10px',
              backgroundColor: '#caf0fa',
              borderRadius: '8px',
            }}
          >
            {/* Conteúdo da primeira div */}
            <b>

              Alunos sem email institucional
            </b>

            <div style={{ margin: '10px 0' }}>
              <input
                type="checkbox"
                id="criarTodosCheckbox"
                onChange={handleCriarTodosChange}
              />
              <label htmlFor="criarTodosCheckbox" style={{ marginLeft: '8px' }}>
                Selecionar todos
              </label><br></br>

              {CriarTodosEmails.length > 0 ?
                <button
                  onClick={() => onCreateEmailAll(CriarTodosEmails)}
                  style={{
                    padding: '10px 20px',
                    marginTop: '12px',
                    backgroundColor: 'red',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    alignSelf: 'flex-end',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  criar emails @edu.pe.senac para todos
                </button> : ''}
            </div>

            {alunos
              .filter(item => item.Aluno.emailCriado === false) // Filtra apenas os alunos com emailCriado = true
              .map((item, index) => (
                <div
                  key={index}
                  style={{
                    marginLeft: '10px',
                    marginRight: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 100,
                    color: '#333333',
                    padding: 16,
                    background: '#FFFFFF',
                    borderRadius: 8,
                    marginBottom: '8px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E1E1E1',
                  }}
                >
                  <div style={{ fontSize: 14, margin: '4px 0', fontWeight: '600' }}>
                    <b>Nome:</b> {item.Aluno.nome}<br></br>
                    <b>Email cadastrado:</b> {item.Aluno.emailCadastro}
                  </div>
                  <div style={{ fontSize: 14, margin: '4px 0', fontWeight: '600' }}>
                    <b>
                      <div>

                        <button
                          onClick={() => onCreateEmail(item.Aluno.id)}
                          style={{
                            padding: '10px 20px',
                            marginTop: '12px',
                            backgroundColor: '#0078D4',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            alignSelf: 'flex-end',
                            fontSize: '14px',
                            fontWeight: 'bold',
                          }}
                        >
                          criar email institucional
                        </button>
                      </div>
                    </b>
                  </div>
                </div>
              ))}



          </div>

          <div
            style={{
              flex: 1,
              marginLeft: '10px',
              padding: '10px',
              backgroundColor: '#caf0fa',
              borderRadius: '8px',
            }}
          >
            {/* Conteúdo da segunda div */}
            <b>

              Vincular alunos a turma
            </b>
            <div style={{ margin: '10px 0' }}>
              <input
                type="checkbox"
                id="criarTodosCheckbox"
                onChange={handleVincularTodosChange}
              />
              <label htmlFor="criarTodosCheckbox" style={{ marginLeft: '8px' }}>
                Selecionar todos
              </label><br></br>

              {VincularTodosEmails.length > 0 ?
                <button
                  onClick={() => onVinculateEmailAll(VincularTodosEmails)}
                  style={{
                    padding: '10px 20px',
                    marginTop: '12px',
                    backgroundColor: 'red',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    alignSelf: 'flex-end',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  vincular alunos a turma TEAMS
                </button> : ''}
            </div>
            {alunos
              .filter(item => item.Aluno.emailCriado === true &&
                item.Aluno.alunoVinculado === false
              ) // Filtra apenas os alunos com emailCriado = true
              .map((item, index) => (
                <div
                  key={index}
                  style={{
                    marginLeft: '10px',
                    marginRight: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 100,
                    color: '#333333',
                    padding: 16,
                    background: '#FFFFFF',
                    borderRadius: 8,
                    marginBottom: '8px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E1E1E1',
                  }}
                >
                  <div style={{ fontSize: 14, margin: '4px 0', fontWeight: '600' }}>
                    <b>Nome:</b> {item.Aluno.nome}
                  </div>
                  <div style={{ fontSize: 14, margin: '4px 0', fontWeight: '600' }}>
                    <b>
                      <div>

                        <button
                          onClick={() => onSave(item.Aluno.email)}
                          style={{
                            padding: '10px 20px',
                            marginTop: '12px',
                            backgroundColor: '#0078D4',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            alignSelf: 'flex-end',
                            fontSize: '14px',
                            fontWeight: 'bold',
                          }}
                        >
                          vincular a turma no Teams
                        </button>
                      </div>
                    </b>
                  </div>


                </div>
              ))}



          </div>
          <div
            style={{
              flex: 1,
              marginLeft: '10px',
              padding: '10px',
              backgroundColor: '#caf0fa',
              borderRadius: '8px',
            }}
          >
            {/* Conteúdo da segunda div */}
            <b>

              Alunos vinculados a essa sala TEAMS
            </b>
            {alunos
              .filter(item => item.Aluno.alunoVinculado === true) // Filtra apenas os alunos com emailCriado = true
              .map((item, index) => (
                <div
                  key={index}
                  style={{
                    marginLeft: '10px',
                    marginRight: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 100,
                    color: '#333333',
                    padding: 16,
                    background: '#FFFFFF',
                    borderRadius: 8,
                    marginBottom: '8px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E1E1E1',
                  }}
                >
                  <div style={{ fontSize: 14, margin: '4px 0', fontWeight: '600' }}>
                    <b>Nome:</b> {item.Aluno.nome}
                  </div>
                  <div style={{ fontSize: 14, margin: '4px 0', fontWeight: '600' }}>
                    <b>
                      <div>


                        aluno vinculado

                      </div>
                    </b>
                  </div>


                </div>
              ))}



          </div>

        </div>

      </div>

      <div>
        {/* Renderiza a barra de progresso se isLoading for true */}
        {isLoading && (
          <div>
            <p>Progresso: {progress}%</p>
            <progress value={progress} max="100"></progress> {/* Barra de progresso */}
          </div>
        )}

        {/* Mostra erro se houver */}
        {hasError && <p style={{ color: 'red' }}>Ocorreu um erro ao criar os e-mails.</p>}

        {/* Botão para iniciar o processo */}
        <button onClick={() => onCreateEmailAll(['email1', 'email2'])}>Criar Emails</button>
      </div>










      <Dialog open={openLoadingDialog}>
        Aguarde, estamos trabalhando nisso...
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 120, height: 120 }}>
          <CircularProgress />
        </div>
      </Dialog>

      

    </div>
  );
};

export default Alunos;
