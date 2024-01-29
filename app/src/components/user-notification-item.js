import { Chip, MenuItem } from '@mui/material'
import React from 'react'
import Avatar from '@mui/material/Avatar';

const UserNotificationItem = (props) => {
  const { item } = props

  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  function stringAvatar(name) {
    let wordNumber = name.split(' ')
    let text = ''
    if(wordNumber.length > 1) {
      text = `${name.split(' ')[0][0].toUpperCase()}${name.split(' ')[1][0].toUpperCase()}`
    } else {
      text = `${name.split(' ')[0][0].toUpperCase()}${name.split(' ')[0][1].toUpperCase()}`
    }

    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: text,
    };
  }

  return (
    <MenuItem style={{display: 'flex', flexDirection: 'row', borderBottom: '1px solid #EEEEEE', minWidth: 350}} onClick={() => window.location.href = `${process.env.REACT_APP_DOMAIN}/validar/${item.id}`}>
      <Avatar {...stringAvatar(`${item.nome}`)} />
      <div style={{marginLeft: 16}}>
        <div style={{ width: '100%', fontSize: 14, fontWeight: 'bold', color: '#424242'}}>{item.nome}</div>
        <div style={{ width: '100%', fontSize: 13, color: '#424242'}}>{item.email}</div>
        <div style={{ width: '100%' , marginTop: 4}}>
          <Chip label="Aguardando Validação do Cadastro" size="small" />
        </div>
      </div>
    </MenuItem>
  )
}


export default UserNotificationItem