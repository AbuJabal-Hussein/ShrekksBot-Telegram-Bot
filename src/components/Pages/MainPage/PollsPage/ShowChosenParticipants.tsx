import React from 'react';
import './PollsPage.css';
import {Poll, PollParticipant} from "../../../../types";
import {Card, CloseButton, Col, Container, Row, Table} from "react-bootstrap";


export interface ShowChosenParticipantsProps {
    polls: Poll[];
    pollParticipants: PollParticipant[];
    setPollParticipants: React.Dispatch<React.SetStateAction<PollParticipant[]>>;
}



export const ShowChosenParticipants: React.FC<ShowChosenParticipantsProps> = ({
    polls,
    pollParticipants,
    setPollParticipants,
}) => {

    const pollsDict: { [x: number]: { title: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }; } = {};

    for (const poll of polls) {
        pollsDict[poll.pollID] = poll
    }

    const handleCardClose = (e: React.MouseEvent<HTMLButtonElement>) =>{
        const val = e.currentTarget.value.split(/(\s+)/)
        const poll_id = +(val[0])
        const option = val.slice(2).reduce((previousValue, currentValue) => previousValue + currentValue, '');
        const tmp_participants = pollParticipants.slice();

        const index = tmp_participants.findIndex(value => value.pollID === poll_id && value.option === option);
        if (index > -1) {
            tmp_participants.splice(index, 1);
        }

        setPollParticipants(tmp_participants);
    }


    return (
      <>
          <Container>
              <Row>
                  {
                      pollParticipants.map(value => (

                              <div key={'poll-option-' + value.pollID + '-' + value.option.replaceAll(' ','-')}>
                                  <CloseButton value={value.pollID + ' ' + value.option} onClick={handleCardClose}/><br/>
                                  <Table striped bordered hover size={"sm"} >
                                     <thead>
                                        <tr>
                                            <th> poll </th>
                                            <th> option </th>
                                        </tr>
                                     </thead>
                                      <tbody>
                                        <tr>
                                            <td>{pollsDict[value.pollID]?.title}</td>
                                            <td>{value.option}</td>
                                        </tr>
                                      </tbody>
                                      <tfoot/>
                                  </Table>
                              </div>

                      ))
                  }
              </Row>
          </Container>
      </>
    );

}