import { Chip, IconButton, MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';
import TaskFilterItem from './task-filter-item';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const TaskFilter = (props) => {
  const [funcionario, setFuncionario] = useState('');
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      marginTop: 16,
      marginBottom: 16
    }}>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',  height: 48, padding: 16}}>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <div style={{fontSize: 24, fontWeight: 'bold', marginBottom: 4, marginRight: 8}}>
            Fevereiro/2023
          </div>
          <IconButton size="medium" edge="end" aria-label="account of current user" aria-haspopup="true"color="inherit">
            <CalendarMonthIcon />
          </IconButton>
        </div>
        <div style={{fontSize: 14}}>
          <Chip label="Diego Alisson" onClick={() => alert('teste')} />
        </div>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 16,
        paddingLeft: 16,
        justifyContent: 'center',
        height: 80,
        overflowY: 'hidden',
        overflowX: 'hidden'
      }}>
        <TaskFilterItem dia='12' diaSemana='Sab' />
        <TaskFilterItem dia='13' diaSemana='Dom' />
        <TaskFilterItem dia='07' diaSemana='Seg' />
        <TaskFilterItem dia='08' diaSemana='Ter' />
        <TaskFilterItem dia='09' diaSemana='Qua' />
        <TaskFilterItem dia='10' diaSemana='Qui' />
        <TaskFilterItem dia='11' diaSemana='Sex' />
        <TaskFilterItem dia='12' diaSemana='Sab' />
        <TaskFilterItem dia='13' diaSemana='Dom' />
        <TaskFilterItem dia='07' diaSemana='Seg' />
        <TaskFilterItem dia='08' diaSemana='Ter' selected={true} />
        <TaskFilterItem dia='09' diaSemana='Qua' />
        <TaskFilterItem dia='11' diaSemana='Sex' />
        <TaskFilterItem dia='12' diaSemana='Sab' />
        <TaskFilterItem dia='13' diaSemana='Dom' />
        <TaskFilterItem dia='07' diaSemana='Seg' />
        <TaskFilterItem dia='08' diaSemana='Ter' />
        <TaskFilterItem dia='09' diaSemana='Qua' />
        <TaskFilterItem dia='11' diaSemana='Sex' />
        <TaskFilterItem dia='12' diaSemana='Sab' />
        <TaskFilterItem dia='13' diaSemana='Dom' />
      </div>
    </div>
  )
}

export default TaskFilter;

