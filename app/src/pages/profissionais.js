import { CircularProgress, FormControl, InputLabel, MenuItem, Select, SpeedDial } from "@mui/material";

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

const Profissionais = (props) => {
    const [openLoadingDialog, setOpenLoadingDialog] = useState(false)



    const [isLoading, setIsLoading] = useState(false);


    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pesquisa, setPesquisa] = useState('');
    const [open, setOpen] = useState(false);
    const [turmas, setTurmas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState([]);

    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY');
    };


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

    }, [pesquisa]);

    const carregarRegistro = () => {
        setOpenLoadingDialog(true);
        const token = getCookie('_token_task_manager');

        fetch(`${process.env.REACT_APP_DOMAIN_API}/api/profissional/`, {
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
            `${process.env.REACT_APP_DOMAIN_API}/api/profissional/search?pesquisa=${pesquisa}`,
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
                    label="Informe o nome Professor"
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
                     {turmaSelecionada
                        .sort((a, b) => {
                            // Prioriza os itens onde fkTeams é null
                            const aPriority = a.fkTeams === null ? 0 : 1;
                            const bPriority = b.fkTeams === null ? 0 : 1;
                            return aPriority - bPriority;
                        })
                        .map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    margin: '10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    color:  item.fkTeams === null ? 'red' : 'black',
                                    padding: '16px',
                                    backgroundColor:  '#fff',
                                    borderRadius: '8px',
                                    marginBottom: '8px',
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid #E1E1E1',
                                }}
                            >  

                        
                                <div style={{ fontSize: 15,  position: 'relative' }}>
                                    <b>Nome:</b> {item.nome}
                                </div>
                                <div style={{ fontSize: 15, position: 'relative' }}>
                                    <b>Email:</b> {item.email}
                                </div>

                                <div style={{ fontSize: 15, marginRight: 8, position: 'relative' }}>
                                    <b>Email Senac:</b> {item.fkTeams != null ? 'sim' : 'não, este email não pode ser adicionado a turmas teams'}
                                </div>

                            </div>
                        ))}
                </div>
            ) : (
                ''
            )}









            <p></p>

            {turmas.length > 0 && turmaSelecionada.length === 0 ? (
                <div>
                    {turmas
                        .sort((a, b) => {
                            // Prioriza os itens onde fkTeams é null
                            const aPriority = a.fkTeams === null ? 0 : 1;
                            const bPriority = b.fkTeams === null ? 0 : 1;
                            return aPriority - bPriority;
                        })
                        .map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    margin: '10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    color:  item.fkTeams === null ? 'red' : 'black',
                                    padding: '16px',
                                    backgroundColor:'#fff',
                                    borderRadius: '8px',
                                    marginBottom: '8px',
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid #E1E1E1',
                                }}
                            >
                                <div style={{ fontSize: 15, marginLeft: 8, marginRight: 8, position: 'relative' }}>
                                    <b>Nome:</b> {item.nome}
                                </div>
                                <div style={{ fontSize: 15, marginLeft: 8, marginRight: 8, position: 'relative' }}>
                                    <b>Email:</b> {item.email}
                                </div>

                                <div style={{ fontSize: 15, marginLeft: 8, marginRight: 8, position: 'relative' }}>
                                    <b>Email Senac:</b> {item.fkTeams != null ? 'sim' : 'não, este email não pode ser adcionado a turmas teams'}
                                </div>

                            </div>
                        ))}
                </div>
            ) : (
                ''
            )}






        </div >
    );
};

export default Profissionais;
