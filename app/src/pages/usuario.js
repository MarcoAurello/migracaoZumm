import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Tooltip } from "@mui/material";
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

const Usuario = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openLoadingDialog, setOpenLoadingDialog] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [message, setMessage] = useState('');
  const [openMessageDialog, setOpenMessageDialog] = useState(false)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    function carregarRegistros() {
      setOpenLoadingDialog(true)
      const token = getCookie('_token_task_manager')
      const params = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      fetch(`${process.env.REACT_APP_DOMAIN_API}/api/usuario/`, params)
        .then(response => {
          const { status } = response
          response.json().then(data => {
            setOpenLoadingDialog(false)
            if(status === 401) {  
              setMessage(data.message)
              setOpenMessageDialog(true)
            } else if(status === 200) {
              setRegistros(data.data)
            }
          }).catch(err => setOpenLoadingDialog(true))
        })
    }

    carregarRegistros()
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <PageContainer>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16}}>
        <h3>Lista de Usuários</h3>
        <div style={{flex: 1}}></div>
        <div>
          <input type='text' style={{height: 32, border: '1px solid #e0e0e0', borderRadius: 3, outline: 'none', paddingRight: 8, paddingLeft: 8}} placeholder='Pesquisar' />
          {/* <Button size="small" variant="contained" startIcon={<AddIcon />} style={{marginLeft: 8 }} onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/usuario/cadastro/`}>
            Novo
          </Button> */}
        </div>
      </div>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={{backgroundColor: '#000000'}}>
            <TableRow>
              <TableCell style={{color: '#fafafa'}}>id</TableCell>
              <TableCell style={{color: '#fafafa'}}>Nome</TableCell>
              <TableCell style={{color: '#fafafa'}}>Email</TableCell>
              <TableCell style={{color: '#fafafa'}}>Perfil</TableCell>
              <TableCell style={{color: '#fafafa'}}>Validado</TableCell>
              <TableCell style={{color: '#fafafa'}}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registros.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.nome}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.Perfil ? row.Perfil.nome: ''}</TableCell>
                <TableCell>{<Checkbox disabled checked={row.validado} />}</TableCell>
                <TableCell>{
                  <Tooltip title='Editar'>
                    <IconButton onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/usuario/${row.id}/edit/`}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
                colSpan={6}
                count={registros.length}
                rowsPerPage={rowsPerPage}
                page={page}
                labelRowsPerPage='Linhas por Página'
                SelectProps={{
                  inputProps: {
                    'aria-label': 'Linhas por Página',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
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

export default Usuario;
