import React from 'react';
import styled from 'styled-components'

const ToolbarContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0; 
  top: 0;
  height: 64px;
  background-color: #ffffff;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: 0px 0px 20px -15px #424242;
  z-index: 10;
`

const Toolbar = (props) => {
  const { menu, title, actions } = props;

  return (
    <ToolbarContainer>
      <div>{menu}</div>
      <div style={{marginRight: 16, marginLeft: 16, fontWeight: 'bold', flex: 1}}>{title}</div>
      <div>{actions}</div>
    </ToolbarContainer>
  )
}

export default Toolbar;