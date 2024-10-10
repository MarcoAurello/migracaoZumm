import { CircularProgress, FormControl, InputLabel, MenuItem, Select, SpeedDial, Switch } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import TaskAluno from '../components/task-aluno'
import BuildCircleIcon from '@mui/icons-material/BuildCircle';


import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const getCookie = require('../utils/getCookie')

const Home = (props) => {
  const [openLoadingDialog, setOpenLoadingDialog] = useState(false)
  const [openMessageDialog, setOpenMessageDialog] = useState(false)
  const [message, setMessage] = useState('')

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [perfilVisivelAtual, setPerfilVisivelAtual] = useState(false)
  const [caminho, setCaminho] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const [chamado, setChamado] = useState(null);

  const [fkUsuario, setFkUsuario] = useState(null);
  const [fkCham, setFkCham] = useState(null);
  const [executor, setExecutor] = useState('');
  const [obsDemandante, setObsDemandante] = useState('');
  const [criticidadeChefe, setCriticidade] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pesquisa, setPesquisa] = useState('');
  const [open, setOpen] = useState(false);
  const [turmas, setTurmas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState([]);
  const [modelAdmTeams, setModelAdmTeams] = useState('');
  const [emailAdm, setEmailAdm] = useState('');
  const [nomeAdm, setNomeAdm] = useState('');
  const [cadEmailAdm, setCadEmailAdm] = useState('');
  const [unidadeAdm, setUnidadeAdm] = useState('');


  const [idEquipe, setIdEquipe] = useState('');
  const [responsavel, setResponsavel] = useState([])
  const [unidades, setUnidades] = useState([])

  useEffect(() => {
    carregarResponsavel()
    carregarUnidades()

    let timeoutId;


    if (pesquisa.length > 6) {
      timeoutId = setTimeout(() => {
        pesquisar();
      }, 10); // Executa a cada 5 segundos
    }


    // if(turmaSelecionada){
    //   alert(JSON.stringify(turmaSelecionada))
    // }
  }, [pesquisa,responsavel]);



  function pesquisar() {
    const token = getCookie('_token_task_manager');
    const params = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    // fetch(`${process.env.REACT_APP_DOMAIN_API}/api/atividade${pesquisa?`/search?&pesquisa=${pesquisa}` : ''
    fetch(
      `${process.env.REACT_APP_DOMAIN_API}/api/turma/search?pesquisa=${pesquisa}`,
      params
    ).then((response) => {
      const { status } = response;
      response
        .json()
        .then((data) => {
          // setOpenLoadingDialog(false)

          if (status === 401) {
            // alert(status)
          } else if (status === 200) {
            // alert(pesquisa)
            // alert(JSON.stringify(data.data))
            setTurmaSelecionada(data.data);
            // alert(JSON.stringify(respostas))
            // filtrarUsuariosDemandados()
          }
        })
        .catch((err) => console.log(err));
    });
  }

  function carregarResponsavel() {
    // setOpenLoadingDialog(true)
    const token = getCookie('_token_task_manager')
    const params = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/admTurma`, params)
      .then(response => {
        const { status } = response
        response.json().then(data => {
          setOpenLoadingDialog(false)
          if (status === 401) {
          } else if (status === 200) {
            // alert(data.data.nome)
            // if(data.data.nome === 'DEP'){
            setResponsavel(data.data)
            // }

          }
        }).catch(err => setOpenLoadingDialog(true))
      })
  }

  function carregarUnidades() {
    // setOpenLoadingDialog(true)
    const token = getCookie('_token_task_manager')
    const params = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/unidade`, params)
      .then(response => {
        const { status } = response
        response.json().then(data => {
          setOpenLoadingDialog(false)
          if (status === 401) {
          } else if (status === 200) {
            // alert(data.data.nome)
            // if(data.data.nome === 'DEP'){
            setUnidades(data.data)
            // }

          }
        }).catch(err => setOpenLoadingDialog(true))
      })
  }

  const handleChangeVisivel = (event) => {

    setPerfilVisivelAtual(!perfilVisivelAtual)


  };



  const handleCriarEquipe = async () => {
    setModelAdmTeams(false)
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/turma/criarEquipe/${idEquipe}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailAdm })
      });

      if (response.ok) {
        alert('Equipe criada com sucesso!');
        // Atualizar o estado ou qualquer ação adicional após a criação da equipe
      } else {
        throw new Error('Falha ao criar equipe');
      }
    } catch (error) {
      console.error('Erro ao criar equipe:', error);
      alert('Erro ao criar equipe');
    } finally {
      setIsLoading(false);
    }
  };

  const cadastrarAdministrador = () => {
    setOpenLoadingDialog(true)
    const token = getCookie('_token_task_manager')
    const params = {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        cadEmailAdm,
        unidadeAdm,
        nomeAdm
      }) 
    }

    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/admTurma/`, params)
      .then(response => {
        const { status } = response
        response.json().then(data => {
          setOpenLoadingDialog(false)
          if(status === 401) {  
            alert(data.message)
            setOpenMessageDialog(true)
        
          } else if(status === 200) {
            alert(data.message)
            setOpenMessageDialog(true)
           
          }
        }).catch(err => setOpenLoadingDialog(true))
      })
  }

 
  const handleCriarEquipe1 = async (turmaId) => {

    setModelAdmTeams(true)
    setIdEquipe(turmaId)


  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  };

  const spinnerStyle = {
    border: '8px solid rgba(0, 0, 0, 0.1)',
    borderLeftColor: '#ffffff',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite'
  };

  const styles = {
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    }
  };

  // Adicione as regras de animação ao estilo do componente
  const styleSheet = document.styleSheets[0];
  const keyframes = `@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }`;
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  const buttonStyle = {
    background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    outline: 'none'
  };

  return (

    <div>


      <hr></hr>
      {/* <button style={{
        padding: '8px 16px', margin: '0 5px',
        backgroundColor: '#007bff', color: '#fff', border: 'none',
        borderRadius: '4px', cursor: 'pointer',
        transition: 'background-color 0.3s ease'
      }} onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/home/`}>
        home</button> */}
      <button style={{
        padding: '8px 16px', margin: '0 5px',
        backgroundColor: '#007bff', color: '#fff', border: 'none',
        borderRadius: '4px', cursor: 'pointer',
        transition: 'background-color 0.3s ease'
      }} onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/config/`}>
        <BuildCircleIcon/>
        </button>
      <hr></hr>










      <TextField
        fullWidth
        id="filled-basic"
        // variant="filled"
        label="Informe o codigo da turma ex 2024.20.169"
        name="pesquisa"
        value={pesquisa}

        style={{ backgroundColor: "#FFFACD" }}
        onChange={(e) => setPesquisa(e.target.value)}
      />

      {turmaSelecionada.length > 0 ? (
        <center>
          <table
            className="table table-striped"
            style={{
              border: '1px solid #ccc', // Borda cinza
              boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)', // Sombreado sutil
              borderRadius: '10px', // Bordas arredondadas
              width: '100%',
              backgroundColor: '#FFFFFF', // Fundo branco para contraste
              color: '#333', // Cor de texto para boa legibilidade
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#0078D4', color: '#FFFFFF', fontSize: '18px', textAlign: 'left' }}>
                <td colSpan="5" style={{ padding: '10px', fontWeight: 'bold' }}>Turmas</td>
              </tr>
              <tr style={{ backgroundColor: '#F3F2F1', color: '#333', fontSize: '16px' }}>
                <td style={{ padding: '10px' }}>Turma</td>
                <td style={{ padding: '10px' }}>Código</td>
                <td style={{ padding: '10px' }}>Ações</td>
              </tr>
            </thead>
            <tbody>
              {turmaSelecionada.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #E1E1E1', color: '#333' }}>
                  <td style={{ padding: '10px' }}>{item.turmaNome ? item.turmaNome : ''}</td>
                  <td style={{ padding: '10px' }}>{item.codigoFormatado ? item.codigoFormatado : ''}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <div>
                      {item.criadoNoTeams === false ? (
                        <div>
                          {isLoading && (
                            <div style={overlayStyle}>
                              <div style={spinnerStyle}></div>
                              <p style={{ color: 'white', fontSize: '15px', marginTop: '10px' }}>Criando Equipe no Teams...</p>
                            </div>
                          )}
                          <button
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#0078D4',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '600'
                            }}
                            onClick={() => handleCriarEquipe1(item.id)}
                          >
                            Criar equipe no Teams
                          </button>
                        </div>
                      ) : (
                        <a
                          style={{
                            padding: '8px 16px',

                            color: '#6CC24A',
                            border: 'none',
                            borderRadius: '4px',

                          }}
                        >
                          Turma Criada
                        </a>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    {item.criadoNoTeams === false ? "" : (
                      <button
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#E57373',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}
                        onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/alunos/${item.id}`}
                      >
                        Ver Alunos da Turma
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </center>
      ) : (
        <p style={{ textAlign: 'center', color: '#999' }}>Nenhuma turma encontrada.</p>
      )}




      {/* <SpeedDial variant="outlined" onClick={() => setOpen(true)}
        ariaLabel="Nova Tarefa"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<EditIcon />} /> */}

      <Dialog open={modelAdmTeams} >
        <Button style={{
          color: 'red',
          position: 'absolute',
          right: 0,
          top: 0
        }}
          onClick={() => setModelAdmTeams(false)}>x</Button>
        <DialogTitle>Selecione o responsável pela turma no TEAMS</DialogTitle>

        <DialogContent>
          <DialogContentText>

            <FormControl fullWidth size="small">

              <InputLabel id="demo-select-small">Funcionários</InputLabel>
              <Select
                fullWidth
                labelId="demo-select-small"
                id="demo-select-small"
                label="Unidade"
                value={emailAdm}>

                {responsavel.map((item, index) => {

                  return <MenuItem key={index} value={item.id} onClick={(e) => [setEmailAdm(item.email)]}>{item.nome}-{item.unidade}</MenuItem>

                })}
              </Select>
            </FormControl>

          </DialogContentText>



          <FormControl fullWidth size="small">

            <hr></hr>
            <TextField

              autoFocus
              margin="dense"
              id="Email"
              // label="Titulo do chamado"
              type="text"
              name="Email"
              fullWidth
              disabled
              variant="standard"
              value={emailAdm}
              onChange={e => setEmailAdm(e.target.value)}

            />

          </FormControl>

          {emailAdm && idEquipe
            ?
            <Button onClick={() => handleCriarEquipe()}>Criar equipe </Button>
            : ''}
            <p></p>





        </DialogContent>


        <DialogActions>




          <Switch
            label="Cadastrar Gestor turma TEAMS"
            checked={perfilVisivelAtual}
            onChange={handleChangeVisivel}
            inputProps={{ 'aria-label': 'controlled' }}
          />

          {perfilVisivelAtual ?
           <div style={{ 
            display: 'grid', 
            gap: '20px', 
            width: '100%', 
            maxWidth: '500px', 
            padding: '20px', 
            margin: '0 auto', 
            backgroundColor: '#f4f4f9', 
            borderRadius: '8px', 
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' 
          }}>
            Cadastre funcionários para administrar turmas TEAMS<hr></hr>
            <TextField
              id="Nome"
              label="Email Institucional"
              type="text"
              name="Nome"
           
              value={cadEmailAdm}
              onChange={e => setCadEmailAdm(e.target.value)}
              fullWidth
              InputLabelProps={{ style: { color: '#555' } }}
            />
            
            <TextField
              id="Email"
              label="Nome"
              type="text"
              name="Email"
           
              value={nomeAdm}
              onChange={e => setNomeAdm(e.target.value)}
              fullWidth
              InputLabelProps={{ style: { color: '#555' } }}
            />
          
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small" style={{ color: '#555' }}>Unidade</InputLabel>
              <Select
                fullWidth
                labelId="demo-select-small"
                id="demo-select-small"
                value={unidadeAdm}
                onChange={(e) => setUnidadeAdm(e.target.value)}
                style={{ color: '#333' }}
              >
                {unidades.map((lista, key) => (
                  <MenuItem key={key} value={lista.nome}>
                    {lista.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {cadEmailAdm && unidadeAdm && nomeAdm
            ?
            <Button onClick={() => cadastrarAdministrador()}>Cadastrar Administrador de turmas </Button>
            : ''}
          </div>
          
            : 'cadastrar novo administrador de turmas TEAMS'}




        </DialogActions>
      </Dialog>



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


    </div >
  );
};

export default Home;
