import React, {useLayoutEffect, useState} from 'react';
import './PollsPage.css';
import {Admin, Page, NewPoll, PollResult, Poll, PollParticipant} from "../../../../types";
import {Alert, Button, Card, Col, Form, InputGroup, ListGroup, Modal, Row} from "react-bootstrap";


export interface ChoosePollAudienceModalProps {
    admin: Admin;
    polls: Poll[];
    pollParticipants: PollParticipant[];
    setPollParticipants: React.Dispatch<React.SetStateAction<PollParticipant[]>>;
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}



export const ChoosePollAudienceModal: React.FC<ChoosePollAudienceModalProps> = ({
    admin,
    polls,
    pollParticipants,
    setPollParticipants,
    showModal,
    setShowModal,
}) => {

    const handle_box_checked = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const val = e.target.value.split(/(\s+)/)
        const poll_id = +(val[0])
        const option = val.slice(2).reduce((previousValue, currentValue) => previousValue + currentValue, '');
        const poll_option : PollParticipant = {
            pollID: poll_id,
            option: option,
        };
        const tmp_participants = pollParticipants.slice();

        if(e.target.checked) {
            tmp_participants.push(poll_option);
        }
        else{
            const index = tmp_participants.findIndex(value => value.pollID === poll_id && value.option === option);
            if (index > -1) {
                tmp_participants.splice(index, 1);
            }
        }
        setPollParticipants(tmp_participants);
    }


    const handleSubmitParticipants = () => {
        setShowModal(false);
    }

    const handleCancel = () => {
        setPollParticipants([]);
        setShowModal(false);
    }

    const handleClear = () => {
        setPollParticipants([]);
    }

    return (
      <>
          <Modal show={showModal} onHide={handleCancel}>
              <Modal.Header closeButton>
                  <Modal.Title>Choose the poll participants:</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Row className={"mb-3"}>
                      <Form.Group className="mb-3" as={Col} controlId={"validationPollTitle"}>
                          <dl>
                          {
                              polls.map(poll =>
                                  (
                                      <Card key={'choose-poll-options-' + poll.pollID}>
                                          <Card.Header>{poll.title}</Card.Header>
                                          <ListGroup variant="flush">
                                          {
                                              poll.options.map(opt => (
                                                  <ListGroup.Item key={'poll-' + poll.pollID + '-option-' + opt}>
                                                      <Form.Check label={opt} value={poll.pollID + ' ' + opt} onChange={handle_box_checked} />
                                                  </ListGroup.Item>
                                              ))
                                          }
                                          </ListGroup>
                                      </Card>
                                  )
                              )
                          }
                          </dl>
                          <Form.Control.Feedback type={"invalid"}>
                              Please select the poll participants
                          </Form.Control.Feedback>
                      </Form.Group>
                  </Row>

              </Modal.Body>
              <Modal.Footer>
                  <Button className={"mb-3"} variant={"success"} type={"submit"} onClick={handleSubmitParticipants} >
                      Add
                  </Button>
                  <Button className={"mb-3"} variant={"success"} type={"reset"} onClick={handleClear}>
                      Clear
                  </Button>
                  <Button className={"mb-3"} variant={"success"} type={"submit"}  onClick={handleCancel}>
                      Cancel
                  </Button>
              </Modal.Footer>
          </Modal>
      </>
    );

};
