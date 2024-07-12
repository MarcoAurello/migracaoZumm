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

const Turmas = (props) => {
  const [openLoadingDialog, setOpenLoadingDialog] = useState(false)
  const [openMessageDialog, setOpenMessageDialog] = useState(false)
  const [message, setMessage] = useState('')

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [caminho, setCaminho] = useState('');


  const [chamado, setChamado] = useState(null);

  const [fkUsuario, setFkUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {

    let timeoutId;


    if (pesquisa.length > 3) {
      timeoutId = setTimeout(() => {
        pesquisar();
      }, 10); // Executa a cada 5 segundos
    }
  }, [pesquisa]);

  const carregarRegistro = (currentPage, pageSize) => {
    setOpenLoadingDialog(true);
    const token = getCookie('_token_task_manager');

    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/turma/?page=${currentPage}&pageSize=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setOpenLoadingDialog(false);
        if (!response.ok) {
          throw new Error('Erro ao carregar os registros');
        }
        return response.json();
      })
      .then(data => {
        // Atualize o estado dos alunos com os dados retornados
        setTurmas(data.data);
      })
      .catch(error => {
        console.error('Erro ao carregar os registros:', error);
        setOpenLoadingDialog(false);
      });
  };

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


  const handleCriarEquipe = async (turmaId) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN_API}/api/turma/criarEquipe/${turmaId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
        // Você pode adicionar mais configurações aqui, como enviar dados no corpo da requisição
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



  // Chame a função carregarRegistro uma vez que o componente é montado
  useEffect(() => {
    carregarRegistro(currentPage, pageSize);




  }, [currentPage, pageSize]);

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








      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <button style={{ padding: '8px 16px', margin: '0 5px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease' }} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Anterior</button>
        <span>Página {currentPage}</span>
        <button style={{ padding: '8px 16px', margin: '0 5px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease' }} onClick={() => setCurrentPage(prev => prev + 1)}>Próxima</button>

      </div>

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
                <td>turma</td>
                <td>codigo</td>

                <td></td>
              </tr>

              {turmaSelecionada.map((item, index) => (
                <tr key={index} style={{ border: '10px', color: '#fff' }}>
                  <td >{item.turmaNome ? item.turmaNome : ''}<br></br>


                  </td>
                  {item.codigoFormatado ? item.codigoFormatado : ''}
                  <td >

                  <div>
      {isLoading && (
        <div style={overlayStyle}>
          <div style={spinnerStyle}></div>
          <p style={{ color: 'white', fontSize: '1.5em', marginTop: '10px' }}>Carregando...</p>
        </div>
      )}
      <button onClick={() => handleCriarEquipe('id-da-turma')}>
        Criar equipe
      </button>
    </div>
                  </td>
                  <button style={{
                    padding: '8px 16px', margin: '0 5px', backgroundColor: 'red', alignSelf: 'end',
                    color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'
                  }}
                    onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/alunos/${item.id}`}
                  >Ver Alunos</button>

                  <td>

                  </td>
                  <td>



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

      {turmas.length = 0 ?
        <div>
          {
            turmas.map((item, index) =>


              < div key={index}
                style={{
                  // paddingBlock:'10px',
                  marginLeft: '10px',
                  marginRight: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 100,
                  color: '#424242',
                  padding: 16,
                  borderColor: 'black',
                  background: '#e7e6e5',
                  borderRadius: 5,
                  marginBottom: '5px',
                  boxShadow: '10px 20px 20px -18px #424242',

                  // cursor: 'pointer'
                }}>

                {/* <b>Aluno:</b>{item.nome}<br></br> */}
                <div style={{ fontSize: 15, marginLeft: 8, marginRight: 8, position: 'relative' }}>
                  <b>Turma:</b> {item.turmaNome}
                </div>
                <div style={{ fontSize: 15, marginLeft: 8, marginRight: 8, position: 'relative' }}>
                  <b>Codigo:</b> {item.codigoFormatado}
                </div>


                <div>
      {isLoading && (
        <div style={overlayStyle}>
          <div style={spinnerStyle}></div>
          <p style={{ color: 'white', fontSize: '1.5em', marginTop: '10px' }}>Carregando...</p>
        </div>
      )}
      <button onClick={() => handleCriarEquipe('id-da-turma')}>
        Criar equipe
      </button>
    </div>

                <button style={{
                  padding: '8px 16px', margin: '0 5px', backgroundColor: 'red', alignSelf: 'end',
                  color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'
                }}
                  onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/alunos/${item.id}`}
                >Ver Alunos</button>

                {/* <div style={{ fontSize: 12, marginLeft: 8, marginRight: 8, position: 'relative' }}>
            <b>Aluno:</b> {item.TurmaAlunos.id } 
          </div> */}


                <div style={{ color: 'red' }}>{item.TurmaAlunos.id ? item.TurmaAlunos.fkTurma : ''}</div>




              </div>
            )
          }

        </div> : ''
      }


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


    </div >
  );
};

export default Turmas;
