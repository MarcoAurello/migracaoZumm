import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import { Avatar, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Switch, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Tooltip } from "@mui/material";
import Paper from '@mui/material/Paper';
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const getCookie = require('../utils/getCookie')

const PageContainer = styled.div`
  margin: 16px;
  padding: 32px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0px 0px 20px -18px #424242;
`

const AreaForm = (props) => {
  const { id } = props.match.params;
  const [openLoadingDialog, setOpenLoadingDialog] = useState(false)
  const [openMessageDialog, setOpenMessageDialog] = useState(false)
  const [message, setMessage] = useState('')
  
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [fkUnidade, setFkUnidade] = useState('')
  const [unidade, setUnidade] = useState([])

  useEffect(() => {
    function carregarRegistro() {
      setOpenLoadingDialog(true)
      const token = getCookie('_token_task_manager')
      const params = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      fetch(`${process.env.REACT_APP_DOMAIN_API}/api/area/${id}`, params)
        .then(response => {
          const { status } = response
          response.json().then(data => {
            setOpenLoadingDialog(false)
            if(status === 401) {  
              setMessage(data.message)
              setOpenMessageDialog(true)
            } else if(status === 200) {
              setOpenLoadingDialog(false)
              setNome(data.data.nome)
              setDescricao(data.data.descricao)
              setFkUnidade(data.data.fkUnidade)
            }
          }).catch(err => setOpenLoadingDialog(false))
        })
    }

    function carregarUnidade() {
      // setOpenLoadingDialog(true)
      const token = getCookie('_token_task_manager')
      const params = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      fetch(`${process.env.REACT_APP_DOMAIN_API}/api/unidade/`, params)
        .then(response => {
          const { status } = response
          response.json().then(data => {
            setOpenLoadingDialog(false)
            if(status === 401) {  
            } else if(status === 200) {
              setUnidade(data.data)
              if(id) {
                carregarRegistro()
              } else {
                setOpenLoadingDialog(false)
              }
            }
          }).catch(err => setOpenLoadingDialog(true))
        })
    }
    
    carregarUnidade()
  }, [])


  const onSave = () => {
    const token = getCookie('_token_task_manager')
    const params = {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        nome,
        descricao,
        fkUnidade
      }) 
    }

    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/area/`, params)
      .then(response => {
        const { status } = response
        response.json().then(data => {
          setOpenLoadingDialog(false)
          if(status === 401) {  
            setMessage(data.message)
            setOpenMessageDialog(true)
          } else if(status === 200) {
            // alert(JSON.stringify(data.data))
            setMessage(data.message)
            setOpenMessageDialog(true)
            // setArea(data.data)
          }
        }).catch(err => setOpenLoadingDialog(true))
      })
  }

  const onAlterar = () => {
    const token = getCookie('_token_task_manager')
    const params = {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        nome,
        descricao,
        fkUnidade
      }) 
    }

    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/area/${id}/edit/`, params)
      .then(response => {
        const { status } = response
        response.json().then(data => {
          setOpenLoadingDialog(false)
          if(status === 401) {  
            setMessage(data.message)
            setOpenMessageDialog(true)
          } else if(status === 200) {
            // alert(JSON.stringify(data.data))
            setMessage(data.message)
            setOpenMessageDialog(true)
            // setArea(data.data)
          }
        }).catch(err => setOpenLoadingDialog(true))
      })
  }

  return (
    <PageContainer>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16}}>
        <h3>Cadastro de Unidades</h3>
        <div style={{flex: 1}}></div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <FormGroup>
          <div style={{flex: 1, marginBottom: 16}}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small">Unidade</InputLabel>
              <Select
                fullWidth
                labelId="demo-select-small"
                id="demo-select-small"
                label="Unidade"
                value={fkUnidade}>
                <MenuItem value="" onClick={() => setFkUnidade("")}>
                  <em>Nenhum</em>
                </MenuItem>
                {unidade.map((item, index) => <MenuItem key={index} value={item.id} onClick={() => setFkUnidade(item.id)}>{item.nome}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
          <div style={{flex: 1, marginBottom: 16}}>
            <TextField size="small" fullWidth label="Nome" variant="outlined" value={nome}  onChange={e => setNome(e.target.value)}/>
          </div>
          <div style={{flex: 1, marginBottom: 16}}>
            <TextField size="small" fullWidth label="Descrição" variant="outlined" value={descricao}  onChange={e => setDescricao(e.target.value)}/>
          </div>
          <div style={{flex: 1, display: 'flex', flexDirection: 'row'}}>
            <Button variant="outlined" onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/area/`}>Voltar</Button>
            <div style={{flex: 1}}></div>
            <Button variant="contained" onClick={id ? onAlterar : onSave}>{id ? 'Alterar' : 'Salvar'}</Button>
          </div>
        </FormGroup>
      </div>

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
        <DialogContent style={{width: 400}}>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMessageDialog(false)}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default AreaForm;
