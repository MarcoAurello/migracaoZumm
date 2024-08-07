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

const Home = (props) => {
  const [openLoadingDialog, setOpenLoadingDialog] = useState(false)
  const [openMessageDialog, setOpenMessageDialog] = useState(false)
  const [message, setMessage] = useState('')

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
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
  const [idEquipe, setIdEquipe] = useState('');

  useEffect(() => {

    let timeoutId;


    if (pesquisa.length > 3) {
      timeoutId = setTimeout(() => {
        pesquisar();
      }, 10); // Executa a cada 5 segundos
    }
  }, [pesquisa]);



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


  const handleCriarEquipe = async () => {
    setModelAdmTeams(false)
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/turma/criarEquipe/${idEquipe}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailAdm}) 
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
    }finally {
      setIsLoading(false);
    }
  };

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










      <TextField
        fullWidth
        id="filled-basic"
        // variant="filled"
        label="Informe o nome ou codigo da turma"
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
              border: '1px solid #ccc', // Adiciona uma borda de 5px sólida cinza
              boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)', // Adiciona sombreado
              borderRadius: '10px', // Adiciona bordas arredondadas de 10px
              width: '100%',
              backgroundColor: '#080f00',

            }}
          >
            <tbody>
              <tr style={{ wordBreak: "break-all", fontSize: '20px', color: '#fff' }}>
                <td colSpan="5"><b>Turmas</b></td>


              </tr>
              <tr style={{ color: '#fff' }}>
                <td>Turma</td>
                <td>Codigo</td>

                <td></td>
              </tr>

              {turmaSelecionada.map((item, index) => (
                <tr key={index} style={{ border: '10px', color: '#fff', marginBottom: '20px' }}>
                  <td >{item.turmaNome ? item.turmaNome : ''}<br></br>


                  </td>
                  {item.codigoFormatado ? item.codigoFormatado : ''}
                  <td >

                  <div>
                    {item.criadoNoTeams === false?
                    <div>
                       {isLoading && (
        <div style={overlayStyle}>
          <div style={spinnerStyle}></div>
          <p style={{ color: 'white', fontSize: '15px', marginTop: '10px' }}>Criando Equipe no teams...</p>
        </div>
      )}
      <button style={buttonStyle} onClick={() => handleCriarEquipe1(item.id)}>
        Criar equipe no teams
      </button>

                    </div>:
                    
                    <button style={buttonStyle}>
        Turma Criada
      </button>

                    }
     
    </div>
                  </td> <td>

                    {item.criadoNoTeams === false?"":


<button style={{
  padding: '8px 16px', margin: '0 5px', backgroundColor: 'red', alignSelf: 'end',
  color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'
}}
  onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/alunos/${item.id}`}
>Ver Alunos da turma</button>

                    }




                  </td>
                </tr>


              ))}
            </tbody>
          </table>
        </center>
      ) : (
        ""
      )}









      <p></p>

     


      {/* <SpeedDial variant="outlined" onClick={() => setOpen(true)}
        ariaLabel="Nova Tarefa"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<EditIcon />} /> */}

      <Dialog open={modelAdmTeams} >
        <DialogTitle>Informe o email do responsável pela turma</DialogTitle>
        <DialogContent>
          <DialogContentText>

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
              variant="standard"
              value={emailAdm}
              onChange={e => setEmailAdm(e.target.value)}

            />

          </FormControl>





        </DialogContent>

      
        <DialogActions>
          {emailAdm && idEquipe
          ?
          <Button onClick={() => handleCriarEquipe()}>Criar equipe </Button>
        :''}
        

          <Button onClick={() => setModelAdmTeams(false)}>Cancelar</Button>
        
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
