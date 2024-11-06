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
const ImageLupa = require('../assets/lupa.png');
const danger = require('../assets/danger.png');
const bd = require('../assets/bdverde.png');

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
    const [relatorioAlunos, setRelatorioAlunos] = useState([])
    const [turmas, setTurmas] = useState([])
    const [profissionais, setProfissionais] = useState([])
    const [showPopup, setShowPopup] = useState(false);
    const [showPopup2, setShowPopup2] = useState(false);
    const [showPopup3, setShowPopup3] = useState(false);
    const [showPopup4, setShowPopup4] = useState(false);
    const [showPopup5, setShowPopup5] = useState(false);




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



    function relatorioAl() {

        const token = getCookie('_token_task_manager')
        const params = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        fetch(`${process.env.REACT_APP_DOMAIN_API}/api/aluno`, params)
            .then(response => {
                const { status } = response
                response.json().then(data => {
                    setOpenLoadingDialog(false)
                    if (status === 401) {

                        alert('1')
                    } else if (status === 200) {

                        setRelatorioAlunos(data.data)


                    }
                }).catch(err => setOpenLoadingDialog(true))
            })
    }

    function relatorioTurmas() {

        const token = getCookie('_token_task_manager')
        const params = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        fetch(`${process.env.REACT_APP_DOMAIN_API}/api/turma/`, params)
            .then(response => {
                const { status } = response
                response.json().then(data => {
                    setOpenLoadingDialog(false)
                    if (status === 401) {

                        alert('1')
                    } else if (status === 200) {

                        setTurmas(data.data)


                    }
                }).catch(err => setOpenLoadingDialog(true))
            })
    }

    function corrigir(item){
        const token = getCookie('_token_task_manager')
        const params = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        fetch(`${process.env.REACT_APP_DOMAIN_API}/api/profissional/${item}`, params)
        .then(response => {
            const { status } = response
            response.json().then(data => {
                setOpenLoadingDialog(false)
                if (status === 401) {

                    alert('1')
                } else if (status === 200) {

                   


                }
            }).catch(err => setOpenLoadingDialog(true))
        })



    } 

    function relatorioProfissional() {

        const token = getCookie('_token_task_manager')
        const params = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        fetch(`${process.env.REACT_APP_DOMAIN_API}/api/profissional/`, params)
            .then(response => {
                const { status } = response
                response.json().then(data => {
                    setOpenLoadingDialog(false)
                    if (status === 401) {

                        alert('1')
                    } else if (status === 200) {

                        setProfissionais(data.data)


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
        relatorioAl()
        relatorioTurmas()
        relatorioProfissional()

        if (pesquisa.length >= 5) {
            pesquisar()
        }


    }, [alunoChecado, pesquisa]);

    // const relatorioTurmas = () => {
    //     setOpenLoadingDialog(true);
    //     const token = getCookie('_token_task_manager');

    //     fetch(`${process.env.REACT_APP_DOMAIN_API}/api/turma/`, {
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         }
    //     })
    //         .then(response => {
    //             setOpenLoadingDialog(false);
    //             if (!response.ok) {
    //                 throw new Error('Erro ao carregar os registros');
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             // Atualize o estado dos alunos com os dados retornados
    //             setTurmas(data.data);
    //         })
    //         .catch(error => {
    //             console.error('Erro ao carregar os registros:', error);
    //             setOpenLoadingDialog(false);
    //         });
    // };





    return (

        <div>



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
                        {/* <tr style={{ backgroundColor: '#4a90e2', color: 'white' }}>
                            <td colSpan="4" style={{
                                padding: '16px',
                                fontWeight: 'bold',
                                fontSize: '18px'
                            }}>
                                Itens a Atualizar
                            </td>
                        </tr> */}

                        {/* Cabeçalhos */}
                        <tr style={{ backgroundColor: '#f7f4f4', color: '#333' }}>
                            <td style={{ backgroundColor: '#', padding: '16px', fontWeight: 'bold', }}>

                                <button style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#4a90e2',
                                    color: '#fff',
                                    border: 'none',
                                    // borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center', // Centraliza o conteúdo
                                    width: '100%', // Ocupa toda a largura da célula
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    transition: 'background-color 0.3s, transform 0.2s',
                                }}
                                    onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/todosAlunos/`}
                                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#3b7dc3'}
                                    onMouseOut={e => e.currentTarget.style.backgroundColor = '#4a90e2'}
                                >

                                    <b>
                                        Alunos
                                    </b>
                                    <img src={ImageLupa} height={30} alt="Logo" />

                                </button>

                            </td>
                            <td style={{ border: '1px solid #E1E1E1', backgroundColor: '#e1e0e0', padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>

                                <button style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#4a90e2',
                                    color: '#fff',
                                    border: 'none',
                                    // borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center', // Centraliza o conteúdo
                                    width: '100%', // Ocupa toda a largura da célula
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    transition: 'background-color 0.3s, transform 0.2s',
                                }}
                                    onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/profissionais/`}
                                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#3b7dc3'}
                                    onMouseOut={e => e.currentTarget.style.backgroundColor = '#4a90e2'}
                                >

                                    <b>
                                        Profissionais
                                    </b>
                                    <img src={ImageLupa} height={30} alt="Logo" />

                                </button>




                            </td>
                            <td style={{ padding: '16px', fontWeight: 'bold' }}>

                                <button style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#4a90e2',
                                    color: '#fff',
                                    border: 'none',
                                    // borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center', // Centraliza o conteúdo
                                    width: '100%', // Ocupa toda a largura da célula
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    transition: 'background-color 0.3s, transform 0.2s',
                                }}
                                    onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/turmas/`}
                                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#3b7dc3'}
                                    onMouseOut={e => e.currentTarget.style.backgroundColor = '#4a90e2'}
                                >

                                    <b>
                                        Turmas
                                    </b>
                                    <img src={ImageLupa} height={30} alt="Logo" />

                                </button>

                            </td>
                            {/* <td style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Ensalamento</td> */}
                        </tr>

                        {/* Linhas de conteúdo */}
                        <tr

                            style={{ backgroundColor: '#ffffff', transition: 'background 0.3s' }}>
                            {/* Coluna Alunos */}
                            <td style={{ backgroundColor: '#f7f4f4', padding: '16px' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>


                                    {/* <td style={{ padding: '16px' }}>
                                        <strong>Sig:</strong>
                                        <div style={{ color: 'red' }}>{viewAlunos ? viewAlunos.length : ''}</div>
                                    </td> */}

                                    <td style={{ padding: '16px' }}
                                        onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/todosAlunos/`}>
                                        <b>Migrados:</b>
                                        <div


                                            style={{ color: 'green', fontSize: '18px' }}>{relatorioAlunos ? relatorioAlunos.length : ''}
                                            <img src={bd} height={20} alt="banco de dados" /></div>
                                    </td>







                                    {/* <td style={{ padding: '16px' }}>


                                        <strong>Pendências criação email</strong>
                                        <div style={{ color: 'red' }}>{relatorioAlunos ? relatorioAlunos.filter(item => item.emailCriado === false).length : ''}</div>

                                    </td> */}

                                    <td>
                                        <b>Criação Email</b>
                                        <div
                                            style={{ color: 'red', cursor: 'pointer' }}
                                            onClick={() => setShowPopup2(!showPopup2)}
                                        >

                                            {relatorioAlunos ? <div>
                                                <b style={{ fontSize: '18px' }}>
                                                    Erros {relatorioAlunos.filter(item => item.emailCriado === false).length}
                                                </b>
                                                <img src={danger} height={20} alt="Logo" />
                                            </div>

                                                : ''}
                                        </div>
                                        {showPopup2 && (
                                            <div
                                                style={{
                                                    position: 'fixed',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    padding: '20px',
                                                    backgroundColor: '#FFCCCC',
                                                    color: 'black',
                                                    borderRadius: '8px',
                                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                                    zIndex: 1000,
                                                    width: '650px',
                                                    textAlign: 'left'
                                                }}
                                            >






                                                <b>Pendências criação email</b>
                                                <ul style={{ padding: '0', margin: '10px 0', listStyleType: 'none' }}>
                                                    {relatorioAlunos &&
                                                        relatorioAlunos
                                                            .filter(item => item.emailCriado === false)
                                                            .map((item, index) => (
                                                                <li key={index} style={{ fontSize: '14px' }}>
                                                                    <b>Nome:</b> {item.nome} <br></br><b>Email:</b> {item.email}
                                                                    <br></br><b>id:</b> {item.fkAluno}
                                                                    <hr></hr>
                                                                </li>
                                                            ))}
                                                </ul>
                                            </div>
                                        )}

                                    </td>


                                    <td>
                                        <b>Ensalamento </b>
                                        <div
                                            style={{ color: 'red', cursor: 'pointer' }}
                                            onClick={() => setShowPopup(!showPopup)}
                                        >

                                            {relatorioAlunos ? <div>
                                                <b style={{ fontSize: '18px' }}>
                                                    Erro  {relatorioAlunos.filter(item => item.alunoVinculado === false).length}
                                                </b>
                                                <img src={danger} height={20} alt="Logo" />
                                            </div>

                                                : ''}
                                        </div>
                                        {showPopup && (
                                            <div
                                                style={{
                                                    position: 'fixed',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    padding: '20px',
                                                    backgroundColor: '#FFCCCC',
                                                    color: 'black',
                                                    borderRadius: '8px',
                                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                                    zIndex: 1000,
                                                    width: '650px',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                <b>Pendência Ensalamento Aluno</b>
                                                <ul style={{ padding: '0', margin: '10px 0', listStyleType: 'none' }}>
                                                    {relatorioAlunos &&
                                                        relatorioAlunos
                                                            .filter(item => item.alunoVinculado === false)
                                                            .map((item, index) => (
                                                                <li key={index} style={{ fontSize: '14px' }}>
                                                                    <b>Nome:</b> {item.nome} <br></br><b>Email:</b> {item.email}
                                                                    <br></br><b>id:</b> {item.fkAluno}
                                                                    <hr></hr>
                                                                </li>
                                                            ))}
                                                </ul>
                                            </div>
                                        )}

                                    </td>




                                </div>
                            </td>


                            {/* Coluna Profissional */}
                            <td style={{ backgroundColor: '#e1e0e0', padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>


                                    <td
                                        onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/profissionais/`}
                                    >
                                        <b>Migrados:</b>





                                        <div
                                            style={{ color: 'green', cursor: 'pointer' }}
                                        // onClick={() => setShowPopup3(!showPopup3)}
                                        >

                                            {profissionais ? <div>
                                                <b style={{ fontSize: '18px' }}>
                                                    {profissionais.length}
                                                </b>
                                                <img src={bd} height={20} alt="Logo" />

                                            </div>

                                                : ''}
                                        </div>
                                        {showPopup3 && (
                                            <div
                                                style={{
                                                    position: 'fixed',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    padding: '20px',
                                                    backgroundColor: 'green',
                                                    color: '#fff',
                                                    borderRadius: '8px',
                                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                                    zIndex: 1000,
                                                    width: '650px',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                <b>Profissionais Ensalados:</b>
                                                <ul style={{ padding: '0', margin: '10px 0', listStyleType: 'none' }}>
                                                    {profissionais &&
                                                        profissionais
                                                            .filter(item => item.fkTeams != null)
                                                            .map((item, index) => (
                                                                <li key={index} style={{ fontSize: '14px' }}>
                                                                    <b>Nome:</b> {item.nome} <br></br><b>Email:</b> {item.email}

                                                                    <hr></hr>
                                                                </li>
                                                            ))}
                                                </ul>
                                            </div>
                                        )}

                                    </td>






                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>


                                            <td>
                                                <b>Ensalamento </b>
                                                <div
                                                    style={{ color: 'green', cursor: 'pointer' }}
                                                    onClick={() => setShowPopup4(!showPopup4)}
                                                >

                                                    {profissionais ? <div>
                                                        <b style={{ fontSize: '18px', color: 'red' }}>
                                                            Erro  {profissionais.filter(item => item.fkTeams === null).length}
                                                        </b>
                                                        <img src={danger} height={20} alt="Logo" />
                                                    </div>

                                                        : ''}
                                                </div>
                                                {showPopup4 && (
                                                    <div
                                                        style={{
                                                            position: 'fixed',
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                            padding: '20px',
                                                            backgroundColor: '#FFCCCC',
                                                            color: 'black',
                                                            borderRadius: '8px',
                                                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                                            zIndex: 1000,
                                                            width: '650px',
                                                            textAlign: 'left'
                                                        }}
                                                    >
                                                        <b>Erro Ensalamento:</b>
                                                        <ul style={{ padding: '0', margin: '10px 0', listStyleType: 'none' }}>
                                                            {profissionais &&
                                                                profissionais
                                                                    .filter(item => item.fkTeams === null)
                                                                    .map((item, index) => (
                                                                        <li key={index} style={{ fontSize: '14px' }}>
                                                                            <b>Nome:</b> {item.nome} <br></br>
                                                                            <b>Email:</b> {item.email}
                                                                            <br></br>
                                                                            {item?.fkTeams === null ?

                                                                                <button
                                                                                    onClick={() => corrigir(item.id)}
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
                                                                                    Corrigir
                                                                                </button>

                                                                                : 'b'}



                                                                            {/* <br></br><b>id:</b> {item.fkAluno} */}

                                                                            <hr></hr>

                                                                        </li>
                                                                    ))}
                                                        </ul>
                                                    </div>
                                                )}

                                            </td>


                                            {/* <div>
                                        <strong>Erro:</strong>
                                        <div style={{ color: 'red' }}>{profissionais ? profissionais.filter(item => item.fkTeams === null).length : ''}</div>
                                    </div> */}
                                        </div>
                                    </td>





                                    {/* <div>
                                        <strong>Erro:</strong>
                                        <div style={{ color: 'red' }}>{profissionais ? profissionais.filter(item => item.fkTeams === null).length : ''}</div>
                                    </div> */}
                                </div>
                            </td>




                            {/* Coluna Equipes */}
                            <td style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>


                                    <td>

                                        <td
                                            onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/turmas/`}
                                        >
                                            <b>Migrados do Sig:</b>





                                            <div
                                                style={{ color: 'green', cursor: 'pointer' }}
                                            // onClick={() => setShowPopup3(!showPopup3)}
                                            >

                                                {turmas ? <div>
                                                    <b style={{ fontSize: '18px' }}>
                                                        {turmas.filter(item => item.idTurmaTeams != null).length}
                                                    </b>
                                                    <img src={bd} height={20} alt="Logo" />

                                                </div>

                                                    : ''}
                                            </div>
                                            {/* {showPopup3 && (
                                            <div
                                                style={{
                                                    position: 'fixed',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    padding: '20px',
                                                    backgroundColor: 'green',
                                                    color: '#fff',
                                                    borderRadius: '8px',
                                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                                    zIndex: 1000,
                                                    width: '650px',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                <b>Profissionais Ensalados:</b>
                                                <ul style={{ padding: '0', margin: '10px 0', listStyleType: 'none' }}>
                                                    {turmas &&
                                                        turmas
                                                            .filter(item => item.fkTeams != null)
                                                            .map((item, index) => (
                                                                <li key={index} style={{ fontSize: '14px' }}>
                                                                    <b>Nome:</b> {item.nome} <br></br><b>Email:</b> {item.tur}

                                                                    <hr></hr>
                                                                </li>
                                                            ))}
                                                </ul>
                                            </div>
                                        )} */}

                                        </td>




                                    </td>




                                    <td>
                                        <b>Criação turma Teams  </b>
                                        <div
                                            style={{ color: 'red', cursor: 'pointer' }}
                                            onClick={() => setShowPopup5(!showPopup5)}
                                        >

                                            {turmas ? <div>
                                                <b style={{ fontSize: '18px', color: 'red' }}>
                                                    Erros {turmas ? turmas.filter(item => item.criadoNoTeams === false).length : ''}
                                                </b>
                                                <img src={danger} height={20} alt="Logo" />
                                            </div>

                                                : ''}
                                        </div>
                                        {showPopup5 && (
                                            <div
                                                style={{
                                                    position: 'fixed',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    padding: '20px',
                                                    backgroundColor: '#FFCCCC',
                                                    color: 'black',
                                                    borderRadius: '8px',
                                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                                    zIndex: 1000,
                                                    width: '650px',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                <b>Erro criação turma:</b>
                                                <ul style={{ padding: '0', margin: '10px 0', listStyleType: 'none' }}>
                                                    {turmas &&
                                                        turmas
                                                            .filter(item => item.criadoNoTeams === false)
                                                            .map((item, index) => (
                                                                <li key={index} style={{ fontSize: '14px' }}>
                                                                    <b>Nome:</b> {item.turmaNome} <br></br><b>Codigo:</b> {item.codigoFormatado}
                                                                    <br></br><b>Unidade:</b> {item.idTurma}
                                                                    <hr></hr>
                                                                </li>
                                                            ))}
                                                </ul>
                                            </div>
                                        )}

                                    </td>



                                </div>
                            </td>

                            {/* Coluna Ensalamento */}
                            {/* <td style={{ border: '1px solid #E1E1E1', padding: '16px' }}>
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
                            </td> */}
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
                            maxHeight: '600px',
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

                                <b style={{ color: 'red' }}>
                                    Apenas Erros
                                </b>
                            </label>
                        </div>

                        {/* Campo de pesquisa */}
                        {/* <TextField

                            fullWidth
                            id="filled-basic"
                            placeholder="Digite o ID da turma, aluno ou profissional"
                            value={searchTerm}
                            onChange={(e) => [setSearchTerm(e.target.value), setPesquisa(e.target.value)]}

                        /> */}

                        <TextField
                            fullWidth
                            id="filled-basic"
                            // variant="filled"
                            label="Digite o ID da turma, aluno ou profissional"
                            name="pesquisa"


                            style={{ backgroundColor: "#FFFACD" }}
                            value={searchTerm}
                            onChange={(e) => [setSearchTerm(e.target.value), setPesquisa(e.target.value)]}

                        />
                        <p></p>

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
                        <hr></hr>
                        <div style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>Emails</div>

                        <div style={{ marginBottom: '10px' }}>
                            Senha padrão email aluno: <b style={{ color: '#d9534f' }}>SENAC@2024</b>
                            <span style={{ fontSize: '14px', color: '#666' }}> (alterada no 1° acesso)</span>
                        </div>

                        <div style={{ marginBottom: '6px', color: '#007bff' }}>
                            <b>Aluno:</b> @edu.pe.senac.br
                        </div>

                        <div style={{ color: '#5bc0de' }}>
                            <b>Funcionário:</b> @pe.senac.br
                        </div>

                        <div style={{ color: 'red' }}>
                            <b>Importante:</b> evite ensalar manualmente no horário do ensalamento programado. 0hs, 12hs
                        </div>
                        <br></br>
                        <hr></hr>


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
