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

const {id} = props.match.params;

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
    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/turmaAluno/${id?id:''}`, params)
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


}, []);

  return (

    <div>
      
       
      <hr></hr>
      <button style={{ padding: '8px 16px', margin: '0 5px',
       backgroundColor: '#007bff', color: '#fff', border: 'none',
        borderRadius: '4px', cursor: 'pointer',
         transition: 'background-color 0.3s ease' }}onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/home/`}>
          home</button>
          <button style={{ padding: '8px 16px', margin: '0 5px',
       backgroundColor: '#007bff', color: '#fff', border: 'none',
        borderRadius: '4px', cursor: 'pointer',
         transition: 'background-color 0.3s ease' }} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
          Alunos Migrados</button>
     <hr></hr>
      
        


      

      
     
      
      <p></p>
      {/* {alunos.Turma.turmaNome} */}
      <b>Alunos:</b>
      {alunos.map((item, index) =>
       
         
        < div key={index}
          style={{
          
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

          }}>

        
          <div style={{ fontSize: 12, marginLeft: 8, marginRight: 8, position: 'relative' }}>
            <b>Nome:</b> {item.Aluno.nome}
          </div>
          <div style={{ fontSize: 12, marginLeft: 8, marginRight: 8, position: 'relative' }}>
            <b>Email:</b> {item.Aluno.email}
          </div>
          
          <button 
           onClick={() => onSave(item.Aluno.email)}
          style={{
          padding: '8px 16px', margin: '0 5px', backgroundColor: 'red', alignSelf:'end',
          color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer',
         
        }} o>Inserir Aluno na turma</button>

         

          {/* <div style={{ color: 'red' }}>{item.TurmaAlunos.id ? item.TurmaAlunos.fkTurma : ''}</div> */}



         
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

export default Alunos;
