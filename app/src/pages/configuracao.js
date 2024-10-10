import { CircularProgress, Divider, FormControl, InputLabel, MenuItem, Select, SpeedDial, Switch } from "@mui/material";

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

const Configuracao = (props) => {

    //   const { id } = props.match.params;

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
    const [open, setOpen] = useState(false);
    const [responsavel, setResponsavel] = useState([])
    const [model, setModel] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTerm1, setSearchTerm1] = useState('');

    // Filter the responsavel array based on the search term
    const filteredResponsavel = responsavel.filter(item =>
        item.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // Filter the turmaSelecinada array based on the search term
    const filteredTurmas = turmaSelecinada.filter(item =>
        item.turmaNome.toLowerCase().includes(searchTerm1.toLowerCase())
    );


    const handleTurmas = async (Id) => {

        setModel(true)
        encontrarTurmasGestor(Id)


    };


    function encontrarTurmasGestor(idTutor) {

        setOpenLoadingDialog(true)
        const token = getCookie("_token_task_manager")
        const params = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
        fetch(`${process.env.REACT_APP_DOMAIN_API}/api/turma/${idTutor}`, params)
            .then(response => {
                const { status } = response
                response.json().then(data => {
                    setOpenLoadingDialog(false)
                    if (status === 401) {
                        setMessage(data.message)
                        setOpenMessageDialog(false)
                    } else if (status === 200) {
                        setOpenLoadingDialog(false)
                        setTurmaSelecinada(data.data)

                    }
                }).catch(err => setOpenLoadingDialog(false))
            })
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






    useEffect(() => {

        carregarResponsavel()




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

                            Lista Gestores de turma TEAMS
                        </b>



                        <div>
            <input
                type="text"
                placeholder="Pesquisar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    padding: '8px',
                    margin: '16px',
                    borderRadius: '4px',
                    border: '1px solid #E1E1E1',
                    width: 'calc(100% - 48px)', // Adjust for padding/margins
                }}
            />

            {filteredResponsavel.map((item, index) => (
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
                        <b>Nome:</b> {item.nome}<br />
                        <b>Unidade:</b> {item.unidade}<br />
                    </div>
                    <div style={{ fontSize: 14, margin: '4px 0', fontWeight: '600' }}>
                        <button
                            onClick={() => handleTurmas(item.id)}
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
                            Ver turmas desse gestor
                        </button>
                    </div>
                </div>
            ))}
        </div>



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

                            Alunos
                        </b>
                        {/* {responsavel
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
              ))} */}



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
            <Dialog open={model} onClose={() => setModel(false)} maxWidth="md" fullWidth>
            <DialogTitle>Turmas desse Tutor</DialogTitle>
            <DialogContent>
                <TextField
                    variant="outlined"
                    placeholder="Pesquisar por nome..."
                    value={searchTerm1}
                    onChange={(e) => setSearchTerm1(e.target.value)}
                    style={{ marginBottom: '16px', width: '100%' }}
                />
                <DialogContentText>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {filteredTurmas.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    margin: '10px 0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minHeight: 100,
                                    color: '#333333',
                                    padding: 16,
                                    background: '#FFFFFF',
                                    borderRadius: 8,
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid #E1E1E1',
                                }}
                            >
                                <div style={{ fontSize: 14, margin: '4px 0', fontWeight: '600' }}>
                                    <b>Nome da Turma:</b> {item.turmaNome}<br />
                                    Início: {moment(item.dataInicio).format('DD/MM/YYYY')}<br />
                                    Fim: {moment(item.dataTermino).format('DD/MM/YYYY')}<br />
                                </div>
                                <Button
                                    onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/alunos/${item.id}`}
                                    style={{
                                        marginTop: '12px',
                                        backgroundColor: '#0078D4',
                                        color: '#FFFFFF',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    ir para turma
                                </Button>
                            </div>
                        ))}
                    </div>
                </DialogContentText>
                <Divider style={{ margin: '16px 0' }} />
            </DialogContent>
            <FormControl fullWidth size="small">
                <Button onClick={() => setModel(false)} color="primary">
                    Fechar
                </Button>
            </FormControl>
        </Dialog>


        </div>
    );
};

export default Configuracao;
