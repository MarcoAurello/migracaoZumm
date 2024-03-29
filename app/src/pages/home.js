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


  const [chamado, setChamado] = useState(null);

  const [fkUsuario, setFkUsuario] = useState(null);
  const [fkCham, setFkCham] = useState(null);
  const [executor, setExecutor] = useState('');
  const [obsDemandante, setObsDemandante] = useState('');
  const [criticidadeChefe, setCriticidade] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);




  const [open, setOpen] = useState(false);


  const onSave = () => {
    setOpenLoadingDialog(true)
    const token = getCookie('_token_task_manager')
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        tituloChamado: titulo,
        descricao
      })
    }

    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/chamado/`, params)
      .then(response => {
        const { status } = response
        response.json().then(data => {
          setOpenLoadingDialog(false)
          if (status === 401) {
            setMessage(data.message)
            setOpenMessageDialog(true)
            window.location.pathname = "/home"
          } else if (status === 200) {
            setOpen(false)
            // alert(JSON.stringify(data.data))
            setMessage(data.message)
            setOpenMessageDialog(true)
            window.location.pathname = "/home"
            // setArea(data.data)
          }
        }).catch(err => setOpenLoadingDialog(true))
      })
  }


  const [alunos, setAlunos] = useState([]);

  const carregarRegistro = (currentPage, pageSize) => {
    setOpenLoadingDialog(true);
    const token = getCookie('_token_task_manager');

    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/aluno/?page=${currentPage}&pageSize=${pageSize}`, {
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
        setAlunos(data.data);
      })
      .catch(error => {
        console.error('Erro ao carregar os registros:', error);
        setOpenLoadingDialog(false);
      });
  };

  // Chame a função carregarRegistro uma vez que o componente é montado
  useEffect(() => {
    carregarRegistro(currentPage, pageSize);




  }, [currentPage, pageSize]);

  return (

    <div>
      
       
      <hr></hr>
      <button style={{ padding: '8px 16px', margin: '0 5px',
       backgroundColor: '#007bff', color: '#fff', border: 'none',
        borderRadius: '4px', cursor: 'pointer',
         transition: 'background-color 0.3s ease' }} onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/turmas/`} >
          Todas as turmas</button>
          <button style={{ padding: '8px 16px', margin: '0 5px',
       backgroundColor: '#007bff', color: '#fff', border: 'none',
        borderRadius: '4px', cursor: 'pointer',
         transition: 'background-color 0.3s ease' }} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
          Alunos Migrados</button>
     <hr></hr>
      
        


      

      
     
       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <button style={{ padding: '8px 16px', margin: '0 5px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease' }} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Anterior</button>
        <span>Página {currentPage}</span>
        <button style={{ padding: '8px 16px', margin: '0 5px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease' }} onClick={() => setCurrentPage(prev => prev + 1)}>Próxima</button>
        <button style={{
          padding: '8px 16px', margin: '0 5px', backgroundColor: 'red', alignSelf:'end', marginLeft:'380px',
          color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }} o>Migrar todos</button>
      </div>
      
      <p></p>
      <b>Alunos não Migrados:</b>
      {alunos.map((item, index) =>
        // alert(JSON.stringify(item))
         
        < div key={index}
          style={{
            // paddingBlock:'10px',
            marginLeft:'10px',
            marginRight:'10px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 100,
            color: '#424242',
            padding: 16,
            background: '#FBF2D7',
            borderRadius: 5,
            marginBottom: '5px',
            boxShadow: '0px 0px 30px -18px #424242',

            // cursor: 'pointer'
          }}>

          {/* <b>Aluno:</b>{item.nome}<br></br> */}
          <div style={{ fontSize: 12, marginLeft: 8, marginRight: 8, position: 'relative' }}>
            <b>Aluno:</b> {item.nome}
          </div>
          <div style={{ fontSize: 12, marginLeft: 8, marginRight: 8, position: 'relative' }}>
            <b>Email Criado:</b> {item.email}
          </div>
          <div style={{ fontSize: 12, marginLeft: 8, marginRight: 8, position: 'relative' }}>
              {item.criadoNoTeams === false ? <div ><b>Migrado:</b> Não </div> : <div>Migrado: Sim</div>}

          </div>
          <button style={{
          padding: '8px 16px', margin: '0 5px', backgroundColor: 'red', alignSelf:'end',
          color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer',
         
        }} o>Migrar aluno para o Zumm</button>

          {/* <div style={{ fontSize: 12, marginLeft: 8, marginRight: 8, position: 'relative' }}>
            <b>Aluno:</b> {item.TurmaAlunos.id } 
          </div> */}


          <div style={{ color: 'red' }}>{item.TurmaAlunos.id ? item.TurmaAlunos.fkTurma : ''}</div>



         
        </div>
      )}

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

export default Home;
