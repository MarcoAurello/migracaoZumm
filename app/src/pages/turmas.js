import { Alert, CircularProgress, FormControl, InputLabel, MenuItem, Select, SpeedDial } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import TaskAluno from '../components/task-aluno'
import moment from 'moment';


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



  const [isLoading, setIsLoading] = useState(false);


  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pesquisa, setPesquisa] = useState('');
  const [open, setOpen] = useState(false);
  const [turmas, setTurmas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState('');



  const formatDate = (dateString) => {
    return moment(dateString).format('DD/MM/YYYY');
  };

  const vincularEmail = (idTurma) => {
    // alert(isAdmin)
    // alert(idTurma)
    // setOpenLoadingDialog(true)
    const token = getCookie('_token_task_manager')
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        idTurma,
        email,
        isAdmin

      })
    }
    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/turma/`, params)
      .then(response => {
        const { status } = response
        response.json().then(data => {
          // setOpenLoadingDialog(false)
          if (status === 401) {
            // setMessage(data.message)
            // setOpenMessageDialog(true)
          } else if (status === 200) {
            alert(data.message)


            // window.location.href = `${process.env.REACT_APP_DOMAIN}/cadastroInicial`;
          }
        })
      })
  }



  useEffect(() => {

    let timeoutId;


    if (pesquisa.length > 6) {
      timeoutId = setTimeout(() => {
        pesquisar();
      }, 10); // Executa a cada 5 segundos
    }


    // if(turmas){
    //   alert(JSON.stringify(turmas))
    // }

    // if (isAdmin) {
    //   alert(isAdmin)
    // }

  }, [pesquisa]);

  const carregarRegistro = () => {
    setOpenLoadingDialog(true);
    const token = getCookie('_token_task_manager');

    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/turma/`, {
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

      <div

        style={{
          margin: '20px',
          padding: '20px',
          backgroundColor: '#f9f9fb',
          borderRadius: '12px',
          boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e0e3e7'
        }}
      >

        <button style={{
          padding: '8px 16px ',
          marginRight: '10px',

          backgroundColor: '#4a90e2',
          alignSelf: 'self-start',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }} onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/home/`}>
          Home</button>
        {/* <button style={{
        padding: '8px 16px', margin: '0 5px',
        backgroundColor: '#007bff', color: '#fff', border: 'none',
        borderRadius: '4px', cursor: 'pointer',
        transition: 'background-color 0.3s ease'
      }} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
        Alunos Migrados</button>
      <hr></hr> */}
        <p></p>

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

      </div>









      {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <button style={{ padding: '8px 16px', margin: '0 5px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease' }} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Anterior</button>
        <span>Página {currentPage}</span>
        <button style={{ padding: '8px 16px', margin: '0 5px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease' }} onClick={() => setCurrentPage(prev => prev + 1)}>Próxima</button>

      </div> */}


      {turmaSelecionada.length > 0 ? (
        <div>
          {turmaSelecionada.map((item, index) => (
            <div
              key={index}
              style={{
                margin: '10px',
                display: 'flex',
                flexDirection: 'column',
                color: '#333',
                padding: '16px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                marginBottom: '8px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                border: '1px solid #E1E1E1',
              }}
            >
              <div style={{ fontSize: 15, marginLeft: 8, marginRight: 8, position: 'relative' }}>
                <b>Turma:</b> {item.turmaNome}
              </div>
              <div style={{ fontSize: 15, marginLeft: 8, marginRight: 8, position: 'relative' }}>
                <b>Código:</b> {item.codigoFormatado}
              </div>
              <div style={{ fontSize: 15, marginLeft: 8, marginRight: 8, position: 'relative' }}>
                <b>Unidade:</b> {item.unidade}
              </div>
              <div style={{ fontSize: 15, marginLeft: 8, marginRight: 8, position: 'relative' }}>
                <b>Inicio:</b> {formatDate(item.dataInicio)}
                <br></br>
                <b>Termino:</b> {formatDate(item.dataTermino)}
                <br></br>
                <button
                  style={{
                    padding: '8px 16px',
                    margin: '0 5px',
                    backgroundColor: '#626fef',
                    alignSelf: 'end',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  onClick={() => (window.location.href = `${item.linkTurma}`)}
                >
                  Ver turma no Teams
                </button>

                <button
                  style={{
                    padding: '8px 16px',
                    margin: '0 5px',
                    backgroundColor: '#4a90e2',
                    alignSelf: 'end',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  onClick={() => (window.location.href = `${process.env.REACT_APP_DOMAIN}/alunos/${item.idTurma}`)}
                >
                  Ver Alunos
                </button><p></p>

                <div>
                  <button
                    style={{
                      padding: '8px 16px',
                      margin: '0 5px',
                      backgroundColor: '#254edb',
                      alignSelf: 'end',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowModal(true)} // Exibe o modal ao clicar
                  >
                    Adicionar membro manualmente
                  </button>

                  {showModal && (
                    <div
                      style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        // backgroundColor: '#FFCCCC',
                        color: 'black',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                        width: '650px',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => setShowModal(false)} // Fecha o modal ao clicar
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            color: '#555',
                          }}
                        >
                          &times;
                        </button>
                      </div>
                      Informe email dominio <b> @edu.pe.senac.br ou @pe.senac.br:</b>

                      <TextField
                        margin="normal"
                        required
                        size="small"
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={e => setEmail(e.target.value)}
                      />

                      <div style={{ margin: '10px 0' }}>
                        <label>
                          <input
                            type="radio"
                            name="role"
                            value="admin"
                            checked={isAdmin}
                            onChange={() => setIsAdmin(true)}
                            style={{ marginRight: '5px' }}
                          />
                          Administrador
                        </label>

                        <label style={{ marginLeft: '15px' }}>
                          <input
                            type="radio"
                            name="role"
                            value="aluno"
                            checked={!isAdmin}
                            onChange={() => setIsAdmin(false)}
                            style={{ marginRight: '5px' }}
                          />
                          Aluno
                        </label>
                      </div>


                      {(email.includes('@edu.pe.senac.br') ||
                        email.includes('@pe.senac.br')) && isAdmin != null
                        ?
                        <button
                          style={{
                            padding: '8px 16px',
                            margin: '0 5px',
                            backgroundColor: '#254edb',
                            alignSelf: 'end',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                          onClick={() => vincularEmail(item.idTurmaTeams)} // Exibe o modal ao clicar
                        >
                          Adicionar email a turma {item.turmaNome}
                        </button>
                        : ''}

                    </div>
                  )}
                </div>
              </div>



            </div>
          ))}
        </div>
      ) : (
        ''
      )
      }









      <p></p>

      {
        turmas.length > 0 && turmaSelecionada.length === 0 ? (
          <div>
            {turmas.map((item, index) => (
              <div
                key={index}
                style={{
                  margin: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  color: '#333',
                  padding: '16px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #E1E1E1',
                }}
              >
                <div style={{ fontSize: 15, marginLeft: 8, marginRight: 8, position: 'relative' }}>
                  <b>Turma:</b> {item.turmaNome}
                </div>
                <div style={{ fontSize: 15, marginLeft: 8, marginRight: 8, position: 'relative' }}>
                  <b>Código:</b> {item.codigoFormatado}
                </div>
                <div style={{ fontSize: 15, marginLeft: 8, marginRight: 8, position: 'relative' }}>
                  <b>Unidade:</b> {item.unidade}
                </div>
                <div style={{ fontSize: 15, marginLeft: 8, marginRight: 8, position: 'relative' }}>
                  <b>Inicio:</b> {formatDate(item.dataInicio)}
                  <br></br>
                  <b>Termino:</b> {formatDate(item.dataTermino)}
                  <br></br>
                  <button
                    style={{
                      padding: '8px 16px',
                      margin: '0 5px',
                      backgroundColor: '#626fef',
                      alignSelf: 'end',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => (window.location.href = `${item.linkTurma}`)}
                  >
                    Ver turma no Teams
                  </button>

                  <button
                    style={{
                      padding: '8px 16px',
                      margin: '0 5px',
                      backgroundColor: '#4a90e2',
                      alignSelf: 'end',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => (window.location.href = `${process.env.REACT_APP_DOMAIN}/alunos/${item.idTurma}`)}
                  >
                    Ver Alunos
                  </button><p></p>
                  <div>
                  <button
                    style={{
                      padding: '8px 16px',
                      margin: '0 5px',
                      backgroundColor: '#254edb',
                      alignSelf: 'end',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowModal(true)} // Exibe o modal ao clicar
                  >
                    Adicionar membro manualmente
                  </button>

                  {showModal && (
                    <div
                      style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        // backgroundColor: '#FFCCCC',
                        color: 'black',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                        width: '650px',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => setShowModal(false)} // Fecha o modal ao clicar
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            color: '#555',
                          }}
                        >
                          &times;
                        </button>
                      </div>
                      Informe email dominio <b> @edu.pe.senac.br ou @pe.senac.br:</b>

                      <TextField
                        margin="normal"
                        required
                        size="small"
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={e => setEmail(e.target.value)}
                      />

                      <div style={{ margin: '10px 0' }}>
                        <label>
                          <input
                            type="radio"
                            name="role"
                            value="admin"
                            checked={isAdmin}
                            onChange={() => setIsAdmin(true)}
                            style={{ marginRight: '5px' }}
                          />
                          Administrador
                        </label>

                        <label style={{ marginLeft: '15px' }}>
                          <input
                            type="radio"
                            name="role"
                            value="aluno"
                            checked={!isAdmin}
                            onChange={() => setIsAdmin(false)}
                            style={{ marginRight: '5px' }}
                          />
                          Aluno
                        </label>
                      </div>


                      {(email.includes('@edu.pe.senac.br') ||
                        email.includes('@pe.senac.br')) && isAdmin != null
                        ?
                        <button
                          style={{
                            padding: '8px 16px',
                            margin: '0 5px',
                            backgroundColor: '#254edb',
                            alignSelf: 'end',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                          onClick={() => vincularEmail(item.idTurmaTeams)} // Exibe o modal ao clicar
                        >
                          Adicionar email a turma {item.turmaNome}
                        </button>
                        : ''}

                    </div>
                  )}
                </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          ''
        )
      }





    </div >
  );
};

export default Turmas;
