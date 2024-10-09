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


            // setCreateAd(data.data.createdAt)






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
        idTurma : id
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

  const onCreateEmailAll = (CriarTodosEmails) => {
    setOpenLoadingDialog(true);
    const token = getCookie("_token_task_manager");
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ CriarTodosEmails })
    };
  
    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/aluno/createAllEmailInstitucional`, params)
      .then(response => {
        const { status } = response;
        response.json().then(data => {
          setOpenLoadingDialog(false);
          if (status === 401) {
            alert(data.message);
            console.error('Erro de autenticação:', data.message);
          } else if (status === 200) {
            console.log('Resultado do backend:', data.resultados);
            alert(`Processo concluído: ${data.message}`);
            // Exibir os detalhes na tela ou em logs adicionais
            data.resultados.forEach(resultado => {
              console.log(`Aluno ID: ${resultado.alunoId}, Status: ${resultado.status}`);
            });
            window.location.reload();
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
      <button style={{
        padding: '8px 16px', margin: '0 5px',
        backgroundColor: '#007bff', color: '#fff', border: 'none',
        borderRadius: '4px', cursor: 'pointer',
        transition: 'background-color 0.3s ease'
      }} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
        Alunos Migrados</button>
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

              {CriarTodosEmails.length > 0?
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
             </button>:''}
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

              {VincularTodosEmails.length > 0?
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
             </button>:''}
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









      {/* <SpeedDial variant="outlined" onClick={() => setOpen(true)}
        ariaLabel="Nova Tarefa"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<EditIcon />} /> */}

      {/* <Dialog open={open} >
        <DialogTitle>Abertura de Chamado</DialogTitle>
        <DialogContent>
          <DialogContentText>

          </DialogContentText>



          <FormControl fullWidth size="small">
            <InputLabel id="demo-select-small">Titulo do Chamado</InputLabel>
            <hr></hr>
            <TextField

              autoFocus
              margin="dense"
              id="tituloChamado"
              // label="Titulo do chamado"
              type="text"
              name="tituloChamado"
              fullWidth
              variant="standard"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}

            />

          </FormControl>

          <p></p>


          <FormControl fullWidth size="small">
            <InputLabel id="demo-select-small">Descrição do Chamado</InputLabel>
            <hr></hr>
            <TextField
              autoFocus
              margin="dense"
              id="descricao"
              // label="Descrição do chamado"
              type="text"
              name="descricao"
              fullWidth
              variant="standard"
              rows={4}
              multiline
              value={descricao}
              onChange={e => setDescricao(e.target.value)}

            />

          </FormControl>

          <p></p>

          <FormControl fullWidth size="small">
            <InputLabel id="demo-select-small">Unidade</InputLabel>
            <Select
              fullWidth
              labelId="demo-select-small"
              id="demo-select-small"
              label="Unidade"
              value='ssss'>
              <MenuItem >
                <em>Nenhum</em>
              </MenuItem>
              <MenuItem >
                aaaaaa
              </MenuItem>

            </Select>
          </FormControl>



          <TextField
            autoFocus
            margin="dense"
            id="caminho"
            label="Envie uma imagem"
            type="file"
            name="caminho"
            fullWidth
            variant="standard"
            value={caminho}
            onChange={e => setCaminho(e.target.value)}
          />







        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={onSave}>Salvar</Button>
        </DialogActions>
      </Dialog> */}

      <Dialog open={openLoadingDialog}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 120, height: 120 }}>
          <CircularProgress />
        </div>
      </Dialog>
      {/* <Dialog
        open={openMessageDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          Atenção
        </DialogTitle>
        <DialogContent style={{ width: 400 }}>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions >

          <Button onClick={() => setOpenMessageDialog(false)}>
            OK
          </Button>
        </DialogActions>
      </Dialog> */}


    </div>
  );
};

export default Alunos;
