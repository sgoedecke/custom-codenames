import React from 'react';
import {
  XXXL, LG,
} from '@zendeskgarden/react-typography';
import { Button } from '@zendeskgarden/react-buttons';
import { Grid, Row, Col } from '@zendeskgarden/react-grid';
import styled from 'styled-components';

const StyledXXXL = styled(XXXL)`
  color: #D79922;
  font-weight: 500;
`;


const AppHeader = ({
  gameState, socketId, roomName, usernames,
}) => {
  const updateName = () => {
    const name = window.prompt('Enter your name');

    if (name !== null && name !== '') {
      window.socket.emit('setUsername', name);
    }
  };
  const color = (gameState.redPlayers || []).indexOf(window.socket.id) >= 0 ? 'playerRed' : 'playerBlue';

  return (
    <div className="app-header">
      <Grid>
        <Row justifyContent="center">
          { gameState.winner ? (
            <StyledXXXL>
              { `Winner: ${gameState.winner} team!` }
            </StyledXXXL>
          )
            : <img style={{ marginBottom: '20px' }} src="../assets/images/header.png" alt="CODENAMES" />}

        </Row>

        <Row alignItems="center" justifyContent="center">
          <Col md={6}>
            <LG>
              You are
              {' '}
              <span className={color}>
                {usernames[socketId] || socketId}
              </span>
            </LG>

          </Col>
          <Col md={2}><div><Button onClick={updateName}>Change name</Button></div></Col>
        </Row>
        { !gameState.playing
                && (
                <Row justifyContent="center">
                  <LG>
                    Game is
                    {' '}
                    <b>waiting to start</b>
                  </LG>
                </Row>
                )}
      </Grid>
    </div>
  );
};

export default AppHeader;
