import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import { Avatar, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Switch, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Tooltip } from "@mui/material";
import Paper from '@mui/material/Paper';
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

import SendIcon from '@mui/icons-material/Send';

import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-monokai";

const getCookie = require('../utils/getCookie')

const PageContainer = styled.div`
  margin: 16px;
  padding: 32px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0px 0px 20px -18px #424242;
`

const ConfiguracaoForm = (props) => {
  const [openLoadingDialog, setOpenLoadingDialog] = useState(false)
  const [openMessageDialog, setOpenMessageDialog] = useState(false)
  const [message, setMessage] = useState('')
  
  
  const [id, setId] = useState(null)
  const [autenticacaoAd, setAutenticacaoAd] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [host, setHost] = useState('')
  const [porta, setPorta] = useState('')
  const [ssl, setSsl] = useState(false)
  const [template, setTemplate] = useState('')
  const [urlAd, setUrlAd] = useState('')
  const [baseDN, setBaseDN] = useState('')
  const [usernameAd, setUsernameAd] = useState('')
  const [passwordAd, setPasswordAd] = useState('')
  
  const [createdAt, setCreatedAt] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)


  const [openDialogEmailTeste, setOpenDialogEmailTeste] = useState(false)
  const [to, setTo] = useState('')
  const [content, setContent] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')

  useEffect(() => {
    function carregarRegistro() {
      setOpenLoadingDialog(true)
      const token = getCookie('_token_task_manager')
      const params = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      fetch(`${process.env.REACT_APP_DOMAIN_API}/api/configuracao/`, params)
        .then(response => {
          const { status } = response
          response.json().then(data => {
            setOpenLoadingDialog(false)
            if(status === 401) {  
              setMessage(data.message)
              setOpenMessageDialog(true)
            } else if(status === 200) {
              setOpenLoadingDialog(false)
              
              setId(data.data.id)
              setAutenticacaoAd(data.data.autenticacaoAd)
              setEmail(data.data.email)
              setPassword(data.data.password)
              setHost(data.data.host)
              setPorta(data.data.porta)
              setSsl(data.data.ssl)
              setTemplate(data.data.template)
              setUrlAd(data.data.urlAd)
              setBaseDN(data.data.baseDN)
              setUsernameAd(data.data.usernameAd)
              setPasswordAd(data.data.passwordAd)
              setCreatedAt(data.data.createdAt)
              setUpdatedAt(data.data.updatedAt)
            }
          }).catch(err => setOpenLoadingDialog(false))
        })
    }

    carregarRegistro()
  }, [])

  const onAlterar = () => {
    setOpenLoadingDialog(true)
    const token = getCookie('_token_task_manager')
    const params = {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        email,
        password,
        host,
        porta,
        autenticacaoAd,
        ssl,
        template,
        urlAd,
        baseDN,
        usernameAd,
        passwordAd
      }) 
    }

    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/configuracao/${id}/edit/`, params)
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
            setId(data.data.id)
            setAutenticacaoAd(data.data.autenticacaoAd)
            setEmail(data.data.email)
            setPassword(data.data.password)
            setHost(data.data.host)
            setPorta(data.data.porta)
            setSsl(data.data.ssl)
            setTemplate(data.data.template)
            setUrlAd(data.data.urlAd)
            setBaseDN(data.data.baseDN)
            setUsernameAd(data.data.usernameAd)
            setPasswordAd(data.data.passwordAd)
            setCreatedAt(data.data.createdAt)
            setUpdatedAt(data.data.updatedAt)

            setOpenMessageDialog(true)
            
            // setArea(data.data)
          }
        }).catch(err => setOpenLoadingDialog(true))
      })
  }

  const enviarEmailTeste = () => {
    setOpenLoadingDialog(true)
    const token = getCookie('_token_task_manager')
    const params = {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        to,
        message: content
      }) 
    }

    fetch(`${process.env.REACT_APP_DOMAIN_API}/api/configuracao/enviaremaildeteste/`, params)
      .then(response => {
        const { status } = response
        response.json().then(data => {
          setOpenLoadingDialog(false)
          if(status === 401) {  
            setMessage(data.message)
            setOpenMessageDialog(true)
            setOpenDialogEmailTeste(false)
          } else if(status === 200) {
            setMessage(data.message)
            setOpenMessageDialog(true)
            setOpenDialogEmailTeste(false)
          }
        }).catch(err => setOpenLoadingDialog(true))
      })
  }

  return (
    <PageContainer>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16}}>
        <h3>Configurações Gerais</h3>
        <div style={{flex: 1}}></div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <FormGroup>
        <div style={{flex: 1, marginBottom: 16}}>
          <TextField size="small" fullWidth label="Email" variant="outlined" value={email}  onChange={e => setEmail(e.target.value)}/>
        </div>
        <div style={{flex: 1, marginBottom: 16}}>
          <TextField size="small" fullWidth label="Password" type='password' variant="outlined" value={password}  onChange={e => setPassword(e.target.value)}/>
        </div>
        <div style={{flex: 1, marginBottom: 16}}>
          <TextField size="small" fullWidth label="Host" type='text' variant="outlined" value={host}  onChange={e => setHost(e.target.value)}/>
        </div>
        <div style={{flex: 1, marginBottom: 16}}>
          <TextField size="small" fullWidth label="Porta" type='text' variant="outlined" value={porta}  onChange={e => setPorta(e.target.value)}/>
        </div>
        <div style={{flex: 1, marginBottom: 16}}>
          <TextField size="small" fullWidth label="Url (Activity Directory)" type='text' variant="outlined" value={urlAd}  onChange={e => setUrlAd(e.target.value)}/>
        </div>
        <div style={{flex: 1, marginBottom: 16}}>
          <TextField size="small" fullWidth label="BaseDN (Activity Directory)" type='text' variant="outlined" value={baseDN}  onChange={e => setBaseDN(e.target.value)}/>
        </div>
        <div style={{flex: 1, marginBottom: 16}}>
          <TextField size="small" fullWidth label="Username (Activity Directory)" type='text' variant="outlined" value={usernameAd}  onChange={e => setUsernameAd(e.target.value)}/>
        </div>
        <div style={{flex: 1, marginBottom: 16}}>
          <TextField size="small" fullWidth type="password" label="Password (Activity Directory)" variant="outlined" value={passwordAd}  onChange={e => setPasswordAd(e.target.value)}/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', marginBottom: 16}}>
          <FormControlLabel control={<Switch checked={autenticacaoAd} />} label="Antenticação Activity Directory" onChange={e => setAutenticacaoAd(e.target.checked)} />
          <FormControlLabel control={<Switch checked={ssl} onChange={e => setSsl(e.target.checked)} />} label="ssl" />
        </div>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 16}}>
          <label style={{fontSize: 13, marginBottom: 8}}>Template</label>
          <div style={{flex: 1}}></div>
          <Button variant="outlined" size="small" startIcon={<SendIcon />} onClick={() => setOpenDialogEmailTeste(true)}>
            Email Teste
          </Button>
        </div>
        <AceEditor 
          mode="html"
          width="100%"
          height="300px"
          theme="monokai"
          value={template}
          onChange={(value) => setTemplate(value)}
          editorProps={{$blockScrolling: true}}
        />
        <div style={{flex: 1, display: 'flex', flexDirection: 'row', marginTop: 16}}>
          <Button variant="outlined" onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/usuario/`}>Voltar</Button>
          <div style={{flex: 1}}></div>
          <Button variant="contained" onClick={onAlterar}>Alterar</Button>
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

      <Dialog open={openDialogEmailTeste}>
          <DialogTitle>Email de Teste</DialogTitle>
          <DialogContent>
            {/* <DialogContentText>
              Para a correta utilização do sistema é necessário o preenchimento dos campos abaixo. Estas informações passaram pela aprovação do gestor imediato.
            </DialogContentText> */}
            <TextField
              margin="dense"
              label="Para"
              type="text"
              fullWidth
              variant="standard"
              size="small"              
              value={to}
              onChange={e => setTo(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Mensagem"
              fullWidth
              variant="standard"
              multiline
              maxRows={6}
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialogEmailTeste(false)}>Cancelar</Button>
            <Button onClick={enviarEmailTeste}>Enviar</Button>
          </DialogActions>
        </Dialog>
    </PageContainer>
  );
};

export default ConfiguracaoForm;
