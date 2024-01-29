import { CircularProgress, FormControl, InputLabel, MenuItem, Select, SpeedDial } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import TaskFilter from '../components/task-filter'
import TaskItem from '../components/task-item'

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


  const [registros, setRegistros] = useState([]);

  useEffect(() => {

    const carregarRegistro = () => {
      setOpenLoadingDialog(true)
      const token = getCookie('_token_task_manager')
      const params = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      fetch(`${process.env.REACT_APP_DOMAIN_API}/api/chamado/`, params)
        .then(response => {
          const { status } = response
          response.json().then(data => {
            setOpenLoadingDialog(false)
            if (status === 401) {
              // setMessage(data.message)
              // setOpenMessageDialog(true)
              alert('erro na aplicação')

            } else if (status === 200) {
              setOpenLoadingDialog(false)
              // setDescricao(data.data.descricao)
              //  alert(JSON.stringify(data))
              setRegistros(data.data)
              // carregarUsuarios();





            }
          }).catch(err => setOpenLoadingDialog(false))
        })
    }

    carregarRegistro()
  }, [])



  //  


  return (

    <div>




      {/* <TaskFilter /> */}


      {registros.map((item, index) =>
        // alert(JSON.stringify(item))

        < TaskItem key={index}

          idChamado={item.id}
          tituloChamado={item.tituloChamado}
          descricao={item.descricao}
          criticidade={item.criticidade}
          fkUnidade={item.fkUnidade}
          created={item.createdAt}
          fkUsuario={item.fkUsuario}
          usuario={item.Usuario ? item.Usuario.nome : 'não encontado'}
          email={item.Usuario ? item.Usuario.email : 'não encontado'}
          fone={item.Usuario ? item.Usuario.telefone : 'não encontado'}
          unidade={item.Unidade ? item.Unidade.nome : 'não encontrado'}
          confirmarEncaminhamento={item}
        />
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
      <Dialog
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
      </Dialog>


    </div>
  );
};

export default Home;
