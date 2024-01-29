import React, { useState } from 'react'
import { Button, Chip, IconButton, LinearProgress, Modal } from '@mui/material'
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, SpeedDial } from "@mui/material";

import MoreIcon from '@mui/icons-material/MoreVert'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const getCookie = require('../utils/getCookie')


const TaskItem = (props) => {


  const { idChamado, tituloChamado, descri, criticidade, caminho, fkUnidade,
    fkStatus, created, modified, usuario, unidade, userSelect, email, fone } = props;

  const [open, setOpen] = React.useState(false);
  const [criticidadeChefe, setCriticidade] = useState(null)
  const [obsDemandante, setObsDemandante] = useState('');




  const data = new Date(props.created)
  function formDate(data) {
    var day = data.getDate();
    var month = data.getMonth() + 1;
    var year = data.getFullYear();
    var dateFormatted = day + '/' + (month) + '/' + year;
    return dateFormatted
  }
  var date = formDate(data)


  const [chamado, setChamado] = useState(null);
  const [fkCham, setFkCham] = useState(null);
  const confirmarEncaminhamento = (chamado) => {

    setChamado(chamado)
    // carregarUsuarios()
    setOpen(true)
    setFkCham(parseInt(chamado.id))

  }

  // //css cor da criticidade
  // function corCriticidade(criticidade) {
  //   var cor = criticidade


  //   if (cor == '1') {
  //     var color = "#9AFF9A"
  //   } if (cor == '2') {
  //     var color = "#fffcb7"
  //   } if (cor == '3') {
  //     var color = "#FFA500"
  //   } if (cor == '4') {
  //     var color = "#FF4040"
  //   } if (cor == '5') {
  //     var color = "#FF4040"
  //   }
  //   return color
  // }



  return (
    <div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: 100,
        color: '#424242',
        padding: 16,

        // cursor: 'pointer'
      }}>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          type="text/css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
          integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
          crossorigin="anonymous"
        />

        <div style={{ display: 'flex', flexDirection: 'column', paddingRight: 16, borderRight: '1px solid #E0E0E0' }}>
          <div style={{ fontSize: 13, fontWeight: 'bold', color: '#424242' }}>09:15</div>
          <div style={{ fontSize: 12, color: '#757575' }}>11:00</div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          marginLeft: 16,
          padding: 16,
          flex: 1,
          borderRadius: 5,
          boxShadow: '0px 0px 30px -18px #424242',
          display: 'flex',
          flexDirection: 'column',
          minWidth: "200px",

        }}>

          <div style={{ display: 'flex', flexDirection: 'row' }}>


            <div style={{
              flex: 1, fontSize: 15, fontWeight: 'bold', color: '#424242', display: 'flex',
              flexDirection: 'row', alignItems: 'center'
            }}>{" Assunto: " + props.tituloChamado}

            </div>



          </div>

          <div style={{ minWidth: "200px" }}>
            <div style={{ fontSize: 12, display: 'flex', flexDirection: 'row', marginTop: 8, minWidth: 10 }}>


              <div style={{ marginLeft: 15, marginRight: 8, position: 'relative' }}>
                <Chip size="small" label={"Chamado aberto em: " + date} />
              </div>
              <div style={{ fontSize: 12, marginLeft: 8, marginRight: 8, position: 'relative' }}>
                <Chip size="small" label={"Solicitante: " + props.usuario} />
              </div>
              <div style={{ fontSize: 12, marginLeft: 8, marginRight: 8, position: 'relative' }}>
                <Chip size="small" label={"Unidade: " + props.unidade} />
              </div>
            </div>

            <div style={{ fontSize: 12, display: 'flex', flexDirection: 'row', marginTop: 8, minWidth: 10 }}>



              <div style={{ fontSize: 12, marginLeft: 8, marginRight: 8, position: 'relative' }}>
                <Chip size="small" label={"E mail: " + props.email} />
              </div>
              <div style={{ fontSize: 12, marginLeft: 8, marginRight: 8, position: 'relative' }}>
                <Chip size="small" label={"Telefone: " + props.fone} />
              </div>
            </div>


            <hr></hr>

          </div>


          <div style={{ fontSize: 14, marginLeft: 8, marginRight: 8, position: 'relative' }}>
            <b>Chamado:</b> {" " + props.descricao} 
          </div>
          <div style={{ marginTop: 30, display: 'flex', flexDirection: 'row' }}>
            <Button variant="contained" style={{ background: '#00BFFF', borderRadius: 0 }}
              onClick={() => confirmarEncaminhamento(props.confirmarEncaminhamento)}
            // onClick={() => selecionarFuncionario()} >

            >Selecionar Funcionario
            </Button>

            <div style={{ flex: 1 }}></div>
            <LinearProgress color="success" variant="determinate" value={100} />

          </div>
        </div>
      </div>
      <Dialog open={open} >
        <DialogTitle>Selecionar Funcionario</DialogTitle>
        <DialogContent>
          <DialogContentText>

          </DialogContentText>



         
            <InputLabel id="demo-select-small"><b>Titulo Chamado:</b></InputLabel>
            {chamado ? chamado.tituloChamado : ''}

            <hr></hr>
            <InputLabel id="demo-select-small"><b>Descrição:</b></InputLabel>
            {chamado ? chamado.descricao : ''}

            <hr></hr>
            <InputLabel id="demo-select-small"><b>Solicitante:</b></InputLabel>
            {chamado ? chamado.Usuario.nome : ''}

            <hr></hr>
            <select className="form-control" onChange={e => setCriticidade(e.target.value)} value={criticidade}
                        //  onChange={e => setFkUsuario(e.target.value)}

                        >
                            <option value={null} >Informe a criticidade do chamado</option>
                            <option value={1} >1- Circunstancial</option>
                            <option value={2} >2- Planejado</option>
                            <option value={3} >3- Urgente</option>
                            <option value={4} >4- Execução Imediata</option>

                        </select>



          <p></p>


          <FormControl fullWidth size="small">
          
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
          // onChange={e => setCaminho(e.target.value)}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button >Salvar</Button>
        </DialogActions>
      </Dialog>


















    </div>





  )
}

export default TaskItem
