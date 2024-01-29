import React from 'react';

import styled from 'styled-components'

const ContentContainer = styled.div`
  position: absolute; 
  left: 0;
  right: 0; 
  top: 64px;
  bottom: 0;
  overflow-x: none;
  overflow-y: scroll;
  z-index: 0;
  background-color:#f5f5f5;
`

const Content = (props) => {
  const { children } = props;

  return (
    <ContentContainer>
      {children}
    </ContentContainer>
  );
}

export default Content;