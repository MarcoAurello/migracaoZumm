import React from 'react'

const TaskFilterItem = (props) => {
  const { dia, diaSemana, selected } = props

  return (
    <div style={{ margin: 8, borderRadius: 5, padding: 16, backgroundColor: selected ? '#1976d2' : '#EEEEEE', cursor: 'pointer', border: '1px solid #e0e0e0' }}>
      <div style={{ fontSize: 18, fontWeight: 'bold', color: selected ? '#FFFFFF' : '#212121' }}>{dia}</div>
      <div style={{ fontSize: 12, color: selected ? '#BBDEFB' : '#616161' }}>{diaSemana}</div>
    </div>
  )
}

export default TaskFilterItem
