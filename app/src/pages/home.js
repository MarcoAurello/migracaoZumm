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

const Home = (props) => {

    //   const { id } = props.match.params;

    const [openLoadingDialog, setOpenLoadingDialog] = useState(false)
    const [openMessageDialog, setOpenMessageDialog] = useState(false)
    const [message, setMessage] = useState('')

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [caminho, setCaminho] = useState('');
    const [turmaSelecinada, setTurmaSelecinada] = useState([]);

    const [alunoChecado, setAlunoChecado] = useState([])


    const [CriarTodosEmails, setCriarTodosEmails] = useState([]);
    const [open, setOpen] = useState(false);
    const [responsavel, setResponsavel] = useState([])
    const [model, setModel] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTerm1, setSearchTerm1] = useState('');
    const [cpf, setCpf] = useState('')
    const [viewAlunos, setViewAlunos] = useState([])
    const [viewUnidades, setViewUnidades] = useState([])
    const [viewProfessores, setViewProfessores] = useState([])
    const [viewTurmas, setViewTurmas] = useState([])
    const [relatorio, setRelatorio] = useState([])
    const [registros, setRegistros] = useState([])
    const [pesquisa, setPesquisa] = useState('')
    const [showOnlyErrors, setShowOnlyErrors] = useState(false);




    // const [showOnlyErrors, setShowOnlyErrors] = useState(false);
    // const [searchTerm, setSearchTerm] = useState('');

    const filteredRelatorio = relatorio.filter(item => {
        const termo = searchTerm.toLowerCase();

        // Condição de busca pelo termo
        const matchesSearch =
            item.descricao.toLowerCase().includes(termo) ||
            (item.turma && item.turma.toLowerCase().includes(termo)) ||
            (item.aluno && item.aluno.toLowerCase().includes(termo)) ||
            (item.profissional && item.profissional.toLowerCase().includes(termo));

        // Condição de checkbox: se showOnlyErrors é true, filtra corrigido = false; caso contrário, inclui todos
        const matchesErrorFilter = showOnlyErrors ? item.corrigido === '0' : '1';

        return matchesSearch && matchesErrorFilter;
    });







    // const filteredRelatorio = relatorio.filter(item => {
    //     const termo = searchTerm.toLowerCase();

    //     return (
    //         item.descricao.toLowerCase().includes(termo) ||
    //         (item.turma && item.turma.toLowerCase().includes(termo)) ||
    //         (item.aluno && item.aluno.toLowerCase().includes(termo)) ||
    //         (item.profissional && item.profissional.toLowerCase().includes(termo))
    //     );
    // });

    const formatDate = (dateString) => {
        return moment(dateString).format('DD/MM/YYYY HH:mm');
    };










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

    const handleCpfChange = (e) => {
        // const numeroFormatado = Mascara.maskCPF(e.target.value);
        setCpf(e.target.value);
        // alert(cpf)
    };


    const check = () => {

        setOpenLoadingDialog(true)
        const token = getCookie("_token_task_manager")
        const params = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
        fetch(`${process.env.REACT_APP_DOMAIN_API}/api/aluno/${cpf}`, params)
            .then(response => {
                const { status } = response
                response.json().then(data => {
                    //   setOpenDialog(false)
                    if (status === 401) {


                        setMessage(data.message)
                        alert(data.message)
                        setOpenLoadingDialog(false)
                    } else if (status === 200) {
                        setAlunoChecado(data.data)




                        // setNome(data.data.AlunoNome)
                        // salvardadosMigrados()




                        setOpenLoadingDialog(false)

                    }
                })
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


    function viewAluno() {

        // setOpenLoadingDialog(true)
        const token = getCookie('_token_task_manager')
        const params = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        fetch(`${process.env.REACT_APP_DOMAIN_API}/api/aluno/alunoView`, params)
            .then(response => {
                const { status } = response
                response.json().then(data => {
                    setOpenLoadingDialog(false)
                    if (status === 401) {

                    } else if (status === 200) {

                        // alert(data.data)
                        // if(data.data.nome === 'DEP'){
                        setViewAlunos(data.data)
                        // }

                    }
                }).catch(err => setOpenLoadingDialog(true))
            })
    }

    function viewUnidade() {

        // setOpenLoadingDialog(true)
        const token = getCookie('_token_task_manager')
        const params = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        fetch(`${process.env.REACT_APP_DOMAIN_API}/api/unidade/unidadeView`, params)
            .then(response => {
                const { status } = response
                response.json().then(data => {
                    setOpenLoadingDialog(false)
                    if (status === 401) {

                    } else if (status === 200) {

                        // alert(data.data)
                        // if(data.data.nome === 'DEP'){
                        setViewUnidades(data.data)
                        // }

                    }
                }).catch(err => setOpenLoadingDialog(true))
            })
    }

    function viewProfessor() {

        // setOpenLoadingDialog(true)
        const token = getCookie('_token_task_manager')
        const params = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        fetch(`${process.env.REACT_APP_DOMAIN_API}/api/turma/viewProfessores`, params)
            .then(response => {
                const { status } = response
                response.json().then(data => {
                    setOpenLoadingDialog(false)
                    if (status === 401) {

                    } else if (status === 200) {

                        // alert(data.data)
                        // if(data.data.nome === 'DEP'){
                        setViewProfessores(data.data)
                        // }

                    }
                }).catch(err => setOpenLoadingDialog(true))
            })
    }

    function viewTurma() {
        // setOpenLoadingDialog(true)
        const token = getCookie('_token_task_manager')
        const params = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        fetch(`${process.env.REACT_APP_DOMAIN_API}/api/turma/viewTurma`, params)
            .then(response => {
                const { status } = response
                response.json().then(data => {
                    setOpenLoadingDialog(false)
                    if (status === 401) {

                        alert('1')
                    } else if (status === 200) {

                        setViewTurmas(data.data)


                    }
                }).catch(err => setOpenLoadingDialog(true))
            })
    }


    function relatorio1() {

        const token = getCookie('_token_task_manager')
        const params = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        fetch(`${process.env.REACT_APP_DOMAIN_API}/api/erro`, params)
            .then(response => {
                const { status } = response
                response.json().then(data => {
                    setOpenLoadingDialog(false)
                    if (status === 401) {

                        alert('1')
                    } else if (status === 200) {

                        setRelatorio(data.data)


                    }
                }).catch(err => setOpenLoadingDialog(true))
            })
    }

    function pesquisar() {
        // alert(pesquisa)
        const token = getCookie("'_token_task_manager'")
        const params = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
        fetch(`${process.env.REACT_APP_DOMAIN_API}/api/turma/search?pesquisa=${pesquisa}`, params)
            .then(response => {
                const { status } = response
                response.json().then(data => {
                    // setOpenLoadingDialog(false)

                    if (status === 401) {
                        // alert(status)
                    } else if (status === 200) {
                        // alert(pesquisa)
                        // alert(JSON.stringify(data.data))
                        setRegistros(data.data)
                    }
                }).catch(err => console.log(err))
            })
    }






    useEffect(() => {
        relatorio1()

        carregarResponsavel()
        viewAluno()
        viewUnidade()
        viewProfessor()
        viewTurma()

        if (pesquisa.length >= 5) {
            pesquisar()
        }




        // if(alunoChecado){
        //     alert(JSON.stringify(alunoChecado))
        // }

        // if(viewTurmas){
        //    alert(JSON.stringify(viewTurmas) )
        // }




    }, [alunoChecado, pesquisa]);


    return (

        <div>



            {/* <button style={{
                padding: '8px 16px', margin: '0 5px',
                backgroundColor: '#007bff', color: '#fff', border: 'none',
                borderRadius: '4px', cursor: 'pointer',
                transition: 'background-color 0.3s ease'
            }} onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/home/`}>
                home</button>

            <hr></hr> */}









            <p></p>

            <p></p>
            <div
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
                <table style={{
                    width: '100%',
                    textAlign: 'center',
                    borderCollapse: 'collapse',
                    fontFamily: 'Arial, sans-serif',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                    <tbody>
                        {/* Título */}
                        <tr style={{ backgroundColor: '#4a90e2', color: 'white' }}>
                            <td colSpan="4" style={{
                                padding: '16px',
                                fontWeight: 'bold',
                                fontSize: '18px'
                            }}>
                                Itens a Atualizar
                            </td>
                        </tr>

                        {/* Cabeçalhos */}
                        <tr style={{ backgroundColor: '#f5f5f5', color: '#333' }}>
                            <td style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Alunos</td>
                            <td style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Profissional</td>
                            <td style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Equipes</td>
                            <td style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Ensalamento</td>
                        </tr>

                        {/* Linhas de conteúdo */}
                        <tr style={{ backgroundColor: '#ffffff', transition: 'background 0.3s' }}>
                            {/* Coluna Alunos */}
                            <td style={{ border: '1px solid #E1E1E1', padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                    <div>
                                        <strong>Pendente:</strong>
                                        <div style={{ color: 'red' }}>{viewAlunos ? viewAlunos.length : ''}</div>
                                    </div>
                                    <div>
                                        <strong>Migrados:</strong>
                                        <div style={{ color: 'green' }}>{relatorio ? relatorio.filter(item => item.descricao.includes('Aluno criado na base')).length : ''}</div>
                                    </div>
                                    <div>
                                        <strong>Erro:</strong>
                                        <div style={{ color: 'red' }}>{relatorio ? relatorio.filter(item => item.descricao === 'Erro migras Aluno').length : ''}</div>
                                    </div>
                                </div>
                            </td>

                            {/* Coluna Profissional */}
                            <td style={{ border: '1px solid #E1E1E1', padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                    <div>
                                        <strong>Pendente:</strong>
                                        <div style={{ color: 'red' }}>{viewProfessores ? viewProfessores.length : ''}</div>
                                    </div>
                                    <div>
                                        <strong>Migrados:</strong>
                                        <div style={{ color: 'green' }}>{relatorio ? relatorio.filter(item => item.descricao.includes('Profissional Vinculado')).length : ''}</div>
                                    </div>
                                    <div>
                                        <strong>Erro:</strong>
                                        <div style={{ color: 'red' }}>{relatorio ? relatorio.filter(item => item.descricao.includes('não')).length : ''}</div>
                                    </div>
                                </div>
                            </td>

                            {/* Coluna Equipes */}
                            <td style={{ border: '1px solid #E1E1E1', padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                    <div>
                                        <strong>Pendente:</strong>
                                        <div style={{ color: 'red' }}>{viewTurmas ? viewTurmas.length : ''}</div>
                                    </div>
                                    <div>
                                        <strong>Migrados:</strong>
                                        <div style={{ color: 'green' }}>{relatorio ? relatorio.filter(item => item.descricao.includes('turma Migrada para Teams')).length : ''}</div>
                                    </div>
                                    <div>
                                        <strong>Erro:</strong>
                                        <div style={{ color: 'red' }}>{relatorio ? relatorio.filter(item => item.descricao === 'Erro migras Aluno').length : ''}</div>
                                    </div>
                                </div>
                            </td>

                            {/* Coluna Ensalamento */}
                            <td style={{ border: '1px solid #E1E1E1', padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                    <div>
                                        <strong>Pendente:</strong>
                                        <div style={{ color: 'red' }}>{relatorio ? relatorio.filter(item => item.descricao === 'qqqqq').length : ''}</div>
                                    </div>
                                    <div>
                                        <strong>Migrados:</strong>
                                        <div style={{ color: 'green' }}>{relatorio ? relatorio.filter(item => item.descricao.includes('aluno vinculado no teams')).length : ''}</div>
                                    </div>
                                    <div>
                                        <strong>Erro:</strong>
                                        <div style={{ color: 'red' }}>{relatorio ? relatorio.filter(item => item.descricao === 'Erro migras Aluno').length : ''}</div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>


            </div>



            <div
                style={{
                    margin: '20px',
                    padding: '20px',
                    backgroundColor: '#f9f9fb',
                    borderRadius: '12px',
                    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
                    border: '1px solid #e0e3e7',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '20px',
                    }}
                >
                    {/* Log Section */}
                    <div
                        style={{
                            flex: 1,
                            padding: '16px',
                            backgroundColor: '#e8f7fc',
                            borderRadius: '10px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            fontSize: '12px',
                            boxShadow: 'inset 0px 2px 8px rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        {/* Título e checkbox */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Log</h2>
                            <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={showOnlyErrors}
                                    onChange={(e) => setShowOnlyErrors(e.target.checked)}
                                    style={{ marginRight: '6px' }}
                                />
                                Apenas Erros
                            </label>
                        </div>

                        {/* Campo de pesquisa */}
                        <input
                            type="text"
                            placeholder="Digite o ID da turma, aluno ou profissional"
                            value={searchTerm}
                            onChange={(e) => [setSearchTerm(e.target.value), setPesquisa(e.target.value)]}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '16px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                fontSize: '12px',
                            }}
                        />

                        {/* Renderização dos itens filtrados */}
                        {filteredRelatorio.length > 0 ? (
                            filteredRelatorio.map((item, index) => (
                                <div key={index} style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#fff', borderRadius: '6px' }}>
                                    <div><strong>Descrição:</strong> {item.descricao}</div>
                                    {item.turma && <div><strong>Turma:</strong> {item.turma}</div>}
                                    {item.aluno && <div><strong>Aluno:</strong> {item.aluno}</div>}
                                    {item.profissional && <div><strong>Profissional:</strong> {item.profissional}</div>}
                                    <div><strong>Data:</strong> {formatDate(item.createdAt)}</div>
                                </div>
                            ))
                        ) : (
                            <div style={{ color: '#888' }}>Nenhum resultado encontrado</div>
                        )}
                    </div>


                    {/* Registros Section */}
                    <div
                        style={{
                            flex: 1,
                            padding: '16px',
                            backgroundColor: '#e8f7fc',
                            borderRadius: '10px',
                            fontSize: '12px',
                            boxShadow: 'inset 0px 2px 8px rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Registros</h2>
                        {registros && registros.length > 0 ? (
                            registros.map((item, index) => (
                                <div key={index} style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#fff', borderRadius: '6px' }}>
                                    <div><strong>Descrição:</strong> {item.descricao}</div>

                                    {item.tipo === 'turma' && (
                                        <div>
                                            <strong>nome:</strong> {item.nomeTurma || 'Nome não disponível'}
                                            <br />
                                            <strong>Unidade:</strong> {item.unidade || 'Nome não disponível'}
                                            <br />
                                            <strong>Link:</strong>
                                            {item.linkTurma ? (
                                                <button
                                                    onClick={() => window.open(item.linkTurma, '_blank')}
                                                    style={{
                                                        marginLeft: '8px',
                                                        padding: '6px 12px',
                                                        backgroundColor: '#007bff',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Acessar Turma
                                                </button>
                                            ) : (
                                                <span style={{ marginLeft: '8px', color: '#888' }}>Turma não foi criada</span>
                                            )}
                                        </div>
                                    )}

                                    {item.tipo === 'aluno' && (
                                        <div>
                                            <strong>Aluno:</strong> {item.nome || 'Nome não disponível'}
                                            <br />
                                            <strong>Email Cadastro:</strong> {item.emailCadastro || 'Nome não disponível'}
                                            <br />
                                            <strong>Email Senac:</strong> {item.email || 'Nome não disponível'}
                                        </div>
                                    )}
                                    {item.tipo === 'profissional' && <div><strong>Profissional:</strong> {item.profissional}</div>}
                                </div>
                            ))
                        ) : (
                            <div style={{ color: '#888' }}>Nenhum resultado encontrado</div>
                        )}
                    </div>
                </div>
            </div>





            {/* <Dialog open={openLoadingDialog}>
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
            </Dialog> */}


        </div>
    );
};

export default Home;
